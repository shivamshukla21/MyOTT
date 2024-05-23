import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';

const MONGO_URI = 'mongodb+srv://shivamshukla21:8wvEUr69ekesBih@clustermyott.zfnj6um.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMyOTT';

beforeAll(async () => {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Root Route', () => {
  it('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Welcome to My List API!');
  });
});

describe('List API', () => {
  it('should add an item to the list', async () => {
    const response = await request(app)
      .post('/api/list/add')
      .send({ userId: 'testUser', itemId: 'testItem', itemType: 'movie' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item added to My List successfully');
  });

  it('should remove an item from the list', async () => {
    // First, add an item to the list
    await request(app)
      .post('/api/list/add')
      .send({ userId: 'testUser', itemId: 'testItemToRemove', itemType: 'movie' });

    // Then, remove the item
    const response = await request(app)
      .post('/api/list/remove')
      .send({ userId: 'testUser', itemId: 'testItemToRemove' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item removed from My List successfully');
  });

  it('should list items for a user', async () => {
    // Add an item to the list
    await request(app)
      .post('/api/list/add')
      .send({ userId: 'testUser', itemId: 'testItem', itemType: 'movie' });

    // Fetch the list of items
    const response = await request(app).get('/api/list/testUser');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemId: 'testItem',
          itemType: 'movie'
        })
      ])
    );
  });
});
