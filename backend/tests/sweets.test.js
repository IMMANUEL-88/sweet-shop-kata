import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Sweet } from '../models/Sweet.js'; // This model doesn't exist yet!

let adminToken;
let customerToken;

beforeAll(async () => {
  // Connect to the database
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
});

// Clear collections before each test
beforeEach(async () => {
  await Sweet.deleteMany();
  await User.deleteMany();

  // Create and log in an admin user
  await request(app).post('/api/auth/register').send({
    username: 'admin',
    password: 'password123',
    role: 'admin'
  });
  const adminRes = await request(app).post('/api/auth/login').send({
    username: 'admin',
    password: 'password123'
  });
  adminToken = adminRes.body.token;

  // Create and log in a customer user
  await request(app).post('/api/auth/register').send({
    username: 'customer',
    password: 'password123',
    role: 'customer'
  });
  const customerRes = await request(app).post('/api/auth/login').send({
    username: 'customer',
    password: 'password123'
  });
  customerToken = customerRes.body.token;
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/sweets', () => {
  const newSweetData = {
    name: 'Chocolate Eclair',
    category: 'Pastry',
    price: 3.99,
    quantity: 50
  };

  it('should fail with 401 (Unauthorized) if no token is provided', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .send(newSweetData);
    
    expect(res.statusCode).toEqual(401);
  });

  it('should fail with 403 (Forbidden) if a non-admin user (customer) tries to add a sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(newSweetData);
    
    expect(res.statusCode).toEqual(403);
  });

  it('should fail with 400 (Bad Request) if admin provides invalid data (missing name)', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        // name is missing
        category: 'Pastry',
        price: 3.99,
        quantity: 50
      });
    
    expect(res.statusCode).toEqual(400);
  });
  
  it('should successfully create a new sweet if admin user is authenticated', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newSweetData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('Chocolate Eclair');
    expect(res.body.price).toBe(3.99);

    // Verify it's in the database
    const sweet = await Sweet.findById(res.body._id);
    expect(sweet).not.toBeNull();
    expect(sweet.name).toBe('Chocolate Eclair');
  });
});