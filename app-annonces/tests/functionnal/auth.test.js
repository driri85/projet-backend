const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/models');

describe('Auth API - Functional Tests', () => {
    let testUser;

    beforeAll(async () => {
        // Clean up test user if exists
        await User.destroy({ where: { username: 'test@example.com' } });
    });

    afterAll(async () => {
        // Clean up test user after tests
        await User.destroy({ where: { username: 'test@example.com' } });
    });

    describe('POST /register', () => {
        test('Should create a new user successfully', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    firstname: 'Test',
                    lastname: 'User',
                    username: 'test@example.com',
                    password: 'Password123!',
                    phone_number: '+33612345678'
                })
                .expect(201);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.username).toBe('test@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });

        test('Should reject registration with duplicate username', async () => {
            await request(app)
                .post('/register')
                .send({
                    firstname: 'Test',
                    lastname: 'Duplicate',
                    username: 'test@example.com',
                    password: 'Password123!'
                })
                .expect(400);
        });

        test('Should reject registration without required fields', async () => {
            await request(app)
                .post('/register')
                .send({
                    firstname: 'Test'
                })
                .expect(400);
        });
    });

    describe('POST /login', () => {
        test('Should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    username: 'test@example.com',
                    password: 'Password123!'
                })
                .expect(200);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.username).toBe('test@example.com');
            testUser = response.body;
        });

        test('Should reject login with wrong password', async () => {
            await request(app)
                .post('/login')
                .send({
                    username: 'test@example.com',
                    password: 'WrongPassword'
                })
                .expect(401);
        });

        test('Should reject login with non-existent user', async () => {
            await request(app)
                .post('/login')
                .send({
                    username: 'nonexistent@example.com',
                    password: 'Password123!'
                })
                .expect(404);
        });
    });

    describe('POST /logout', () => {
        test('Should logout successfully with valid token', async () => {
            const response = await request(app)
                .post('/logout')
                .set('Authorization', testUser.token)
                .expect(200);

            expect(response.body).toHaveProperty('message');
        });

        test('Should reject logout without token', async () => {
            await request(app)
                .post('/logout')
                .expect(401);
        });
    });

    describe('GET /home', () => {
        test('Should return welcome message', async () => {
            const response = await request(app)
                .get('/home')
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Hello world !');
        });
    });
});
