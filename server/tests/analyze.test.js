const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('POST /api/analyze', () => {
    afterAll(async () => {
        await db.pool.end();
    });

    it('should return query plan for a valid SELECT query', async () => {
        const res = await request(app)
            .post('/api/analyze')
            .send({ userQuery: 'SELECT 1' });

        expect(res.statusCode).toEqual(200);
        // The response is an array of plans, so we check the first element
        expect(res.body[0]).toHaveProperty('Plan');
    });

    it('should return 400 if query is missing', async () => {
        const res = await request(app)
            .post('/api/analyze')
            .send({});

        expect(res.statusCode).toEqual(400);
    });

    it('should handle syntax errors gracefully', async () => {
        const res = await request(app)
            .post('/api/analyze')
            .send({ userQuery: 'SELECT * FROM non_existent_table' });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});
