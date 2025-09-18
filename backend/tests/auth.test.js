import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import { User } from '../models/User.js'; // This file doesn't exist yet!

// Connect to a test database before all tests
beforeAll(async () => {
  const url = process.env.MONGO_URI; // Use a test DB
  await mongoose.connect(url, { useNewUrlParser: true });
});

// Clear the User collection before each test
beforeEach(async () => {
  await User.deleteMany();
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'customer' // Optional, or set a default
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser');

    // Check if user is in the database
    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
  });

  it('should fail if username is taken', async () => {
    // First, create a user
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    // Then, try to create the same user
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Username already exists');
  });
});