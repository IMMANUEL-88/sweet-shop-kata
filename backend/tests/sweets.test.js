import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Sweet } from "../models/Sweet.js";

let adminToken;
let customerToken;
let customerId;

beforeAll(async () => {
  // Connect to the database
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
});

// Clear collections before each test
beforeEach(async () => {
  await Sweet.deleteMany();
  await User.deleteMany();

  // Create and log in an admin user
  await request(app).post("/api/auth/register").send({
    username: "admin",
    password: "password123",
    role: "admin",
  });
  const adminRes = await request(app).post("/api/auth/login").send({
    username: "admin",
    password: "password123",
  });
  adminToken = adminRes.body.token;

  // Create and log in a customer user
  await request(app).post("/api/auth/register").send({
    username: "customer",
    password: "password123",
    role: "customer",
  });
  const customerRes = await request(app).post("/api/auth/login").send({
    username: "customer",
    password: "password123",
  });
  customerToken = customerRes.body.token;
  customerId = customerRes.body.user._id;
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// --- Test for POST /api/sweets ---
describe("POST /api/sweets", () => {
  const newSweetData = {
    name: "Chocolate Eclair",
    category: "Pastry",
    price: 3.99,
    quantity: 50,
    imageUrl:
      "https://www.seriouseats.com/thmb/f3kx43qc--aS4-okr8VNpnSAZZQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__12__20201210-choux-eclairs-vicky-wasik-16-acf615b81c2f4217857bbf80d60c28c1.jpg",
  };

  it("should fail with 401 (Unauthorized) if no token is provided", async () => {
    const res = await request(app).post("/api/sweets").send(newSweetData);

    expect(res.statusCode).toEqual(401);
  });

  it("should fail with 403 (Forbidden) if a non-admin user (customer) tries to add a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(newSweetData);

    expect(res.statusCode).toEqual(403);
  });

  it("should fail with 400 (Bad Request) if admin provides invalid data (missing name)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        // name is missing
        category: "Pastry",
        price: 3.99,
        quantity: 50,
      });

    expect(res.statusCode).toEqual(400);
  });

  it("should successfully create a new sweet if admin user is authenticated", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newSweetData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe("Chocolate Eclair");
    expect(res.body.price).toBe(3.99);

    // Verify it's in the database
    const sweet = await Sweet.findById(res.body._id);
    expect(sweet).not.toBeNull();
    expect(sweet.name).toBe("Chocolate Eclair");
  });
});

// --- Test for GET /api/sweets ---
describe("GET /api/sweets", () => {
  it("should fail with 401 (Unauthorized) if no token is provided", async () => {
    const res = await request(app).get("/api/sweets");
    expect(res.statusCode).toEqual(401);
  });

  it("should return an empty array if no sweets exist", async () => {
    // The beforeEach hook cleans the Sweets collection, so it's empty
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should return a list of all sweets for an authenticated customer", async () => {
    // Manually create some sweets for this test
    await Sweet.insertMany([
      { name: "Gummy Bears", category: "Candy", price: 1.99, quantity: 100 },
      { name: "Lollipop", category: "Candy", price: 0.99, quantity: 200 },
    ]);

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe("Gummy Bears");
  });

  it("should return a list of all sweets for an authenticated admin", async () => {
    // Manually create sweets for this test
    await Sweet.insertMany([
      { name: "Admin Choco", category: "Chocolate", price: 5.99, quantity: 50 },
    ]);

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Admin Choco");
  });
});

// --- Test for GET /api/sweets/search ---
describe("GET /api/sweets/search", () => {
  // Seed the database with a known set of sweets before each search test
  beforeEach(async () => {
    await Sweet.insertMany([
      { name: "Caramel Log", category: "Caramel", price: 5, quantity: 10 },
      { name: "Cherry Drop", category: "Hard Candy", price: 2, quantity: 20 },
      { name: "Dark Chocolate", category: "Chocolate", price: 8, quantity: 5 },
      { name: "Milk Chocolate", category: "Chocolate", price: 7, quantity: 15 },
    ]);
  });

  it("should fail with 401 (Unauthorized) if no token is provided", async () => {
    const res = await request(app).get("/api/sweets/search?name=choco");
    expect(res.statusCode).toEqual(401);
  });

  it("should return all sweets if no search query is provided", async () => {
    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(4);
  });

  it("should search by name (case-insensitive)", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=chocolate")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe("Dark Chocolate");
    expect(res.body[1].name).toBe("Milk Chocolate");
  });

  it("should search by category", async () => {
    const res = await request(app)
      .get("/api/sweets/search?category=Chocolate")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
  });

  it("should search by price range (min and max)", async () => {
    const res = await request(app)
      .get("/api/sweets/search?minPrice=4&maxPrice=7")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe("Caramel Log");
    expect(res.body[1].name).toBe("Milk Chocolate");
  });

  it("should search by price range (min only)", async () => {
    const res = await request(app)
      .get("/api/sweets/search?minPrice=6")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe("Dark Chocolate");
  });

  it("should combine search queries (category and name)", async () => {
    const res = await request(app)
      .get("/api/sweets/search?category=Chocolate&name=dark")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Dark Chocolate");
  });

  it("should return an empty array for no results", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=nonexistent")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});

// --- Test for PUT /api/sweets/:id ---
describe("PUT /api/sweets/:id", () => {
  let testSweet;
  const updatedData = {
    name: "New Sweet Name",
    category: "New Category",
    price: 99.99,
    quantity: 1,
    imageUrl: "https://example.com/new.jpg", // <-- ADD THIS
  };

  // Before each test, create a fresh sweet to work with
  beforeEach(async () => {
    testSweet = await Sweet.create({
      name: "Old Name",
      category: "Old Category",
      price: 10,
      quantity: 10,
    });
  });

  it("should fail with 401 (Unauthorized) if no token is provided", async () => {
    const res = await request(app)
      .put(`/api/sweets/${testSweet._id}`)
      .send(updatedData);
    expect(res.statusCode).toEqual(401);
  });

  it("should fail with 403 (Forbidden) if a non-admin user (customer) tries to update", async () => {
    const res = await request(app)
      .put(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send(updatedData);
    expect(res.statusCode).toEqual(403);
  });

  it("should fail with 404 (Not Found) if the sweet does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId(); // Create a valid, but non-existent, ID
    const res = await request(app)
      .put(`/api/sweets/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);
    expect(res.statusCode).toEqual(404);
  });

  it("should fail with 400 (Bad Request) if admin provides invalid data (e.g., empty name)", async () => {
    const res = await request(app)
      .put(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "" }); // Mongoose model 'required: true' will catch this
    expect(res.statusCode).toEqual(400);
  });

  it("should successfully update the sweet if admin is authenticated", async () => {
    const res = await request(app)
      .put(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("New Sweet Name");
    expect(res.body.price).toBe(99.99);

    // Verify the change in the database
    const sweetInDb = await Sweet.findById(testSweet._id);
    expect(sweetInDb.name).toBe("New Sweet Name");
  });
});

// --- Test for DELETE /api/sweets/:id ---
describe("DELETE /api/sweets/:id", () => {
  let testSweet;

  // Before each test, create a fresh sweet to delete
  beforeEach(async () => {
    testSweet = await Sweet.create({
      name: "To Be Deleted",
      category: "Temporary",
      price: 1,
      quantity: 1,
    });
  });

  it("should fail with 401 (Unauthorized) if no token is provided", async () => {
    const res = await request(app).delete(`/api/sweets/${testSweet._id}`);
    expect(res.statusCode).toEqual(401);
  });

  it("should fail with 403 (Forbidden) if a non-admin user (customer) tries to delete", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(res.statusCode).toEqual(403);
  });

  it("should fail with 404 (Not Found) if the sweet does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId(); // Create a valid, but non-existent, ID
    const res = await request(app)
      .delete(`/api/sweets/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  it("should successfully delete the sweet if admin is authenticated", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Sweet removed");

    // Verify it's gone from the database
    const sweetInDb = await Sweet.findById(testSweet._id);
    expect(sweetInDb).toBeNull();
  });
});

// --- Test for POST /api/sweets/:id/purchase ---
describe("POST /api/sweets/:id/purchase", () => {
  let sweetInStock;
  let sweetOutOfStock;

  beforeEach(async () => {
    // Create one sweet that is in stock
    sweetInStock = await Sweet.create({
      name: "Available Sweet",
      category: "Candy",
      price: 5,
      quantity: 10,
    });
    // Create one sweet that is out of stock
    sweetOutOfStock = await Sweet.create({
      name: "Sold Out Sweet",
      category: "Chocolate",
      price: 10,
      quantity: 0,
    });
  });

  it("should fail with 401 (Unauthorized) if no token is provided", async () => {
    const res = await request(app).post(
      `/api/sweets/${sweetInStock._id}/purchase`
    );
    expect(res.statusCode).toEqual(401);
  });

  it("should fail with 404 (Not Found) if the sweet does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/sweets/${nonExistentId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(res.statusCode).toEqual(404);
  });

  it("should fail with 400 (Bad Request) if the sweet is out of stock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetOutOfStock._id}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Sweet is out of stock");
  });

  it("should successfully purchase a sweet and decrease quantity by 1 (as customer)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetInStock._id}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toBe(9); // 10 - 1 = 9

    // Verify in DB
    const sweetInDb = await Sweet.findById(sweetInStock._id);
    expect(sweetInDb.quantity).toBe(9);
  });

  it("should successfully purchase a sweet and decrease quantity by 1 (as admin)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetInStock._id}/purchase`)
      .set("Authorization", `Bearer ${adminToken}`); // Admins can buy sweets too

    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toBe(9);
  });
});

// --- Test for POST /api/sweets/:id/restock ---
describe("POST /api/sweets/:id/restock", () => {
  let testSweet;
  const restockAmount = { amount: 50 };

  beforeEach(async () => {
    // Create a sweet with a known quantity
    testSweet = await Sweet.create({
      name: "Restock Target",
      category: "Candy",
      price: 3,
      quantity: 10,
    });
  });

  it("should fail with 401 (Unauthorized) if no token is provided", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .send(restockAmount);
    expect(res.statusCode).toEqual(401);
  });

  it("should fail with 403 (Forbidden) if a non-admin user (customer) tries to restock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send(restockAmount);
    expect(res.statusCode).toEqual(403);
  });

  it("should fail with 404 (Not Found) if the sweet does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/sweets/${nonExistentId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockAmount);
    expect(res.statusCode).toEqual(404);
  });

  it("should fail with 400 (Bad Request) if the amount is missing or invalid", async () => {
    // Test 1: Missing amount
    const res1 = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
    expect(res1.statusCode).toEqual(400);

    // Test 2: Invalid amount
    const res2 = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: -10 });
    expect(res2.statusCode).toEqual(400);
  });

  it("should successfully restock the sweet and increase quantity (as admin)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockAmount);

    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toBe(60); // 10 (initial) + 50 (restock) = 60

    // Verify in DB
    const sweetInDb = await Sweet.findById(testSweet._id);
    expect(sweetInDb.quantity).toBe(60);
  });
});

describe("POST /api/cart - Add Item to Cart", () => {
  let sweet1;

  beforeEach(async () => {
    // Create a sweet to add to the cart
    // This runs AFTER the top-level beforeEach, so the DB is clean
    sweet1 = await Sweet.create({
      name: "Lollipop",
      category: "Candy",
      price: 1,
      quantity: 100,
    });
  });

  it("should fail with 401 Unauthorized if no token is provided", async () => {
    const res = await request(app)
      .post("/api/cart")
      .send({ sweetId: sweet1._id, quantity: 1 });
    expect(res.statusCode).toEqual(401);
  });

  it("should fail with 404 Not Found if the sweet does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sweetId: nonExistentId, quantity: 1 });
    expect(res.statusCode).toEqual(404);
  });

  it("should fail with 400 Bad Request if quantity is zero or negative", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sweetId: sweet1._id, quantity: 0 }); // Invalid quantity
    expect(res.statusCode).toEqual(400);
  });

  it("should successfully add a new item to the user cart", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sweetId: sweet1._id, quantity: 2 });

    expect(res.statusCode).toEqual(200);
    expect(res.body[0].sweet).toBe(sweet1._id.toString());
    expect(res.body[0].quantity).toBe(2);

    // Verify in the database
    const user = await User.findById(customerId);
    expect(user.cart.length).toBe(1);
    expect(user.cart[0].quantity).toBe(2);
  });

  it("should update the quantity if the same item is added to the cart again", async () => {
    // 1. Add 2 lollipops
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sweetId: sweet1._id, quantity: 2 });

    // 2. Add 3 more lollipops
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sweetId: sweet1._id, quantity: 3 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1); // Cart should still only have one item
    expect(res.body[0].quantity).toBe(5); // Quantity should be 2 + 3 = 5
  });
});

describe("GET /api/cart - View Cart", () => {
  let sweet1;

  beforeEach(async () => {
    // Before each test, create a sweet that can be added to the cart
    sweet1 = await Sweet.create({
      name: "Lollipop",
      category: "Candy",
      price: 1,
      quantity: 100,
    });
  });

  it("should fail with 401 Unauthorized if no token is provided", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.statusCode).toEqual(401);
  });

  it("should return an empty array for a user with an empty cart", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should return all items in the user’s cart with full sweet details", async () => {
    // First, add an item to the user's cart
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sweetId: sweet1._id, quantity: 5 });

    // Now, try to view the cart
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].quantity).toBe(5);
    // Check for populated sweet details
    expect(res.body[0].sweet).toHaveProperty("name", "Lollipop");
    expect(res.body[0].sweet).toHaveProperty("price", 1);
  });
});

describe("DELETE /api/cart/:id - Remove Item from Cart", () => {
  let sweet1, sweet2;

  beforeEach(async () => {
    // Seed sweets
    sweet1 = await Sweet.create({
      name: "Lollipop",
      price: 1,
      category: "Candy",
      quantity: 100,
    });
    sweet2 = await Sweet.create({
      name: "Gummy Bears",
      category: "Candy",
      price: 2,
      quantity: 50,
    });

    // Seed the user's cart with two items
    const user = await User.findById(customerId);
    user.cart = [
      { sweet: sweet1._id, quantity: 5 },
      { sweet: sweet2._id, quantity: 3 },
    ];
    await user.save();
  });

  it("should fail with 401 Unauthorized if no token is provided", async () => {
    const res = await request(app).delete(`/api/cart/${sweet1._id}`);
    expect(res.statusCode).toEqual(401);
  });

  it("should fail with 404 Not Found if the item is not in the cart", async () => {
    const nonExistentSweetId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/cart/${nonExistentSweetId}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("Item not found in cart");
  });

  it("should successfully remove a single item from the cart", async () => {
    const res = await request(app)
      .delete(`/api/cart/${sweet1._id}`) // Deleting the Lollipop
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1); // Cart should only have 1 item left
    expect(res.body[0].sweet.name).toBe("Gummy Bears"); // The Gummy Bears should remain

    // Verify in the database
    const user = await User.findById(customerId);
    expect(user.cart.length).toBe(1);
    expect(user.cart[0].sweet.toString()).toBe(sweet2._id.toString());
  });
});

describe('POST /api/cart/purchase - Purchase from Cart', () => {
  let sweet1, sweet2;

  beforeEach(async () => {
    // This hook runs *after* the top-level 'beforeEach' (which creates the user)
    // and *after* the 'Cart API' beforeEach (which creates the sweets).
    
    // We just need to find the sweets created in the parent describe block
    sweet1 = await Sweet.findOne({ name: 'Lollipop' });
    sweet2 = await Sweet.findOne({ name: 'Gummy Bear' });

    // Seed the user's cart with items
    const user = await User.findById(customerId);
    user.cart = [
      { sweet: sweet1._id, quantity: 10 }, // 10 Lollipops (Stock is 100)
      { sweet: sweet2._id, quantity: 3 }   // 3 Gummy Bears (Stock is 50)
    ];
    await user.save();
  });

  it('should fail with 401 Unauthorized if no token is provided', async () => {
    const res = await request(app).post('/api/cart/purchase');
    expect(res.statusCode).toEqual(401);
  });

  it('should fail with 400 Bad Request if the cart is empty', async () => {
    // Clear the cart for this specific test
    const user = await User.findById(customerId);
    user.cart = [];
    await user.save();

    const res = await request(app)
      .post('/api/cart/purchase')
      .set('Authorization', `Bearer ${customerToken}`);
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Your cart is empty');
  });

  it('should fail with 400 Bad Request if *one* item in the cart is out of stock', async () => {
    // Update Gummy Bear stock to be less than the cart quantity
    // Cart has 3, we set stock to 2
    await Sweet.findByIdAndUpdate(sweet2._id, { quantity: 2 });

    const res = await request(app)
      .post('/api/cart/purchase')
      .set('Authorization', `Bearer ${customerToken}`);
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('Not enough stock for Gummy Bear');

    // Verify stock was NOT changed for the *other* item
    const sweet1InDb = await Sweet.findById(sweet1._id);
    expect(sweet1InDb.quantity).toBe(100); // Should be unchanged
  });

  it('should successfully purchase items, decrease stock, and clear the cart', async () => {
    const res = await request(app)
      .post('/api/cart/purchase')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Purchase successful!');

    // Verify stock has decreased
    const sweet1InDb = await Sweet.findById(sweet1._id);
    const sweet2InDb = await Sweet.findById(sweet2._id);
    expect(sweet1InDb.quantity).toBe(90); // 100 - 10
    expect(sweet2InDb.quantity).toBe(47);  // 50 - 3

    // Verify cart is empty
    const user = await User.findById(customerId);
    expect(user.cart.length).toBe(0);
  });
});
