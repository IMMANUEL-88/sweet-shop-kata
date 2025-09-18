import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import { User } from '../models/User.js'; // This file doesn't exist yet!

// Connect to the database before all tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
});

// Clear the User collection before each test
beforeEach(async () => {
  await User.deleteMany();
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});


// --- Test for POST /api/auth/register ---
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


// --- Test for POST /api/auth/login ---
describe('POST /api/auth/login', () => {
  // We need a user to exist before we can test logging in
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'logintester',
        password: 'password123',
        role: 'customer'
      });
  });

  it('should log in a user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'logintester',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('logintester');
  });

  it('should fail with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'logintester',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should fail with non-existent username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'nouser',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});