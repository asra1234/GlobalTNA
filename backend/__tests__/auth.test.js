jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const request = require('supertest');

const User = require('../models/User');
const createApp = require('../app');

describe('auth endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  test('POST /api/auth/register returns 400 for a short password', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ava',
        email: 'ava@example.com',
        password: '123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Password must be at least 6 characters' });
    expect(User.findOne).not.toHaveBeenCalled();
  });

  test('POST /api/auth/register creates a user and returns auth payload', async () => {
    const app = createApp();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'Ava',
      email: 'ava@example.com',
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ava',
        email: 'ava@example.com',
        password: 'secure123',
      });

    expect(response.status).toBe(201);
    expect(User.findOne).toHaveBeenCalledWith({ email: 'ava@example.com' });
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ava',
        email: 'ava@example.com',
        passwordHash: expect.any(String),
      })
    );
    expect(response.body.user).toEqual({
      id: '507f1f77bcf86cd799439011',
      name: 'Ava',
      email: 'ava@example.com',
    });
    expect(response.body.token).toEqual(expect.any(String));
  });
});