import { createMocks } from 'node-mocks-http';
import handleProduct from '@/app/api/products/[id]/route';
import { Product } from '@/lib/types';

describe('/api/products/[id]', () => {
  test('returns product for valid ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: '1' },
    });

    await handleProduct(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('name');
    expect(json).toHaveProperty('price');
  });

  test('returns 404 for invalid ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'invalid-id' },
    });

    await handleProduct(req, res);

    expect(res._getStatusCode()).toBe(404);
    const json = JSON.parse(res._getData());
    expect(json).toHaveProperty('error');
  });

  test('handles POST requests for product updates', async () => {
    const productUpdate = {
      name: 'Updated Product',
      price: 199.99,
    };

    const { req, res } = createMocks({
      method: 'PUT',
      query: { id: '1' },
      body: productUpdate,
    });

    await handleProduct(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.name).toBe(productUpdate.name);
    expect(json.price).toBe(productUpdate.price);
  });

  test('validates required fields on update', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: { id: '1' },
      body: { name: '' }, // Invalid data
    });

    await handleProduct(req, res);

    expect(res._getStatusCode()).toBe(400);
    const json = JSON.parse(res._getData());
    expect(json).toHaveProperty('error');
  });
});