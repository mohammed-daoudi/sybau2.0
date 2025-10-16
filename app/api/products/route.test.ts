import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/products/route';
import { createMocks } from 'node-mocks-http';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongodb';
import { Product } from '@/lib/types';

jest.mock('@/lib/mongodb', () => ({
  connectToDatabase: jest.fn(),
  disconnectFromDatabase: jest.fn(),
}));

describe('Product API Routes', () => {
  const mockProduct: Product = {
    _id: '1',
    title: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    price: 99.99,
    images: ['test.jpg'],
    category: 'test',
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    test('returns all products', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      const mockFind = jest.fn().mockResolvedValueOnce([mockProduct]);
      const mockProductModel = { find: mockFind };

      (connectToDatabase as jest.Mock).mockResolvedValueOnce({
        models: { Product: mockProductModel },
      });

      await GET(req as unknown as NextRequest);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toHaveLength(1);
      expect(data[0]).toEqual(expect.objectContaining({
        title: mockProduct.title,
        price: mockProduct.price,
      }));
    });

    test('handles database errors', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      (connectToDatabase as jest.Mock).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      await GET(req as unknown as NextRequest);

      expect(res._getStatusCode()).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty('error');
    });
  });

  describe('POST /api/products', () => {
    test('creates a new product', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: mockProduct,
      });

      const mockCreate = jest.fn().mockResolvedValueOnce(mockProduct);
      const mockProductModel = { create: mockCreate };

      (connectToDatabase as jest.Mock).mockResolvedValueOnce({
        models: { Product: mockProductModel },
      });

      await POST(req as unknown as NextRequest);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data).toEqual(expect.objectContaining({
        title: mockProduct.title,
        price: mockProduct.price,
      }));
    });

    test('validates required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: { title: 'Test' }, // Missing required fields
      });

      await POST(req as unknown as NextRequest);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty('error');
    });
  });

  describe('PUT /api/products/[id]', () => {
    test('updates an existing product', async () => {
      const updates = { price: 149.99 };
      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: '1' },
        body: updates,
      });

      const mockFindByIdAndUpdate = jest
        .fn()
        .mockResolvedValueOnce({ ...mockProduct, ...updates });
      const mockProductModel = { findByIdAndUpdate: mockFindByIdAndUpdate };

      (connectToDatabase as jest.Mock).mockResolvedValueOnce({
        models: { Product: mockProductModel },
      });

      await PUT(req as unknown as NextRequest);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.price).toBe(updates.price);
    });

    test('handles non-existent product', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: 'nonexistent' },
        body: { price: 149.99 },
      });

      const mockFindByIdAndUpdate = jest.fn().mockResolvedValueOnce(null);
      const mockProductModel = { findByIdAndUpdate: mockFindByIdAndUpdate };

      (connectToDatabase as jest.Mock).mockResolvedValueOnce({
        models: { Product: mockProductModel },
      });

      await PUT(req as unknown as NextRequest);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty('error');
    });
  });

  describe('DELETE /api/products/[id]', () => {
    test('deletes an existing product', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: '1' },
      });

      const mockFindByIdAndDelete = jest.fn().mockResolvedValueOnce(mockProduct);
      const mockProductModel = { findByIdAndDelete: mockFindByIdAndDelete };

      (connectToDatabase as jest.Mock).mockResolvedValueOnce({
        models: { Product: mockProductModel },
      });

      await DELETE(req as unknown as NextRequest);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toEqual(expect.objectContaining({
        title: mockProduct.title,
      }));
    });

    test('handles non-existent product', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'nonexistent' },
      });

      const mockFindByIdAndDelete = jest.fn().mockResolvedValueOnce(null);
      const mockProductModel = { findByIdAndDelete: mockFindByIdAndDelete };

      (connectToDatabase as jest.Mock).mockResolvedValueOnce({
        models: { Product: mockProductModel },
      });

      await DELETE(req as unknown as NextRequest);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty('error');
    });
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });
});