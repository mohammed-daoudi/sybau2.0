import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  // Auth API mocks
  rest.post('/api/auth/signin', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'customer',
        },
      })
    );
  }),

  // Products API mocks
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        products: [
          {
            id: '1',
            name: 'Test Product',
            description: 'Test description',
            price: 99.99,
            images: ['test-image.jpg'],
            category: 'test',
            inventory: 10,
          },
        ],
      })
    );
  }),

  // Orders API mocks
  rest.get('/api/orders', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        orders: [
          {
            id: '1',
            status: 'processing',
            items: [],
            total: 99.99,
            date: new Date().toISOString(),
          },
        ],
      })
    );
  }),

  // Customer API mocks
  rest.get('/api/customers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customers: [
          {
            id: '1',
            name: 'Test Customer',
            email: 'test@example.com',
            orders: [],
          },
        ],
      })
    );
  }),
];

export const server = setupServer(...handlers);