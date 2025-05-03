import request from 'supertest';
import app from '@src/start/app';

describe('GET /', () => {
  it('should return a welcome message', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.body).toEqual({ message: 'Hello sweetie!' });
  });
});
