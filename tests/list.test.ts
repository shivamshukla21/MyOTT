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

describe('List API', () => {
  it('should add an item to the list', async () => {
    const response = await request(app)
      .post('/api/list/add')
      .send({ userId: 'testUser', itemId: 'testItem', itemType: 'movie' });

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemId: 'testItem',
          itemType: 'movie'
        })
      ])
    );
  });
});
