const request = require('supertest');
const app = require('../app');
const { pool } = require('../db');

describe('Auth and Credential Flow', () => {
    let token;
    let userId;
    let credentialId;
    const testUser = {
        username: 'testuser_' + Date.now(),
        password: 'password123'
    };
    const testCredential = {
        connection_name: 'Test DB',
        host: 'localhost',
        port: 5432,
        db_name: 'test_db',
        username: 'postgres',
        password: 'password'
    };

    afterAll(async () => {
        // Cleanup
        if (userId) {
            await pool.query('DELETE FROM app_users WHERE id = $1', [userId]);
        }
        await pool.end();
    });

    test('should signup a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('username', testUser.username);
        token = res.body.token;
        userId = res.body.user.id;
    });

    test('should login the user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token; // Refresh token just in case
    });

    test('should add a database credential', async () => {
        const res = await request(app)
            .post('/api/credentials')
            .set('Authorization', `Bearer ${token}`)
            .send(testCredential);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.connection_name).toEqual(testCredential.connection_name);
        credentialId = res.body.id;
    });

    test('should get credentials list', async () => {
        const res = await request(app)
            .get('/api/credentials')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].id).toEqual(credentialId);
    });

    test('should delete the credential', async () => {
        const res = await request(app)
            .delete(`/api/credentials/${credentialId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Credential deleted successfully');
    });
});
