const request = require('supertest');
const app = require('../../src/app');
const { Category, User } = require('../../src/models');

describe('Categories API - Functional Tests', () => {
    let adminToken;
    let testCategoryId;

    beforeAll(async () => {
        // Login as admin to get token
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'contact@soufian-a.net',
                password: 'MotDePasse123'
            });
        adminToken = loginResponse.body.token;
    });

    afterAll(async () => {
        // Clean up test category if exists
        if (testCategoryId) {
            await Category.destroy({ where: { id: testCategoryId } });
        }
    });

    describe('GET /categories', () => {
        test('Should return list of categories', async () => {
            const response = await request(app)
                .get('/categories')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('slug');
        });
    });

    describe('GET /categories/:id', () => {
        test('Should return a specific category', async () => {
            const response = await request(app)
                .get('/categories/1')
                .expect(200);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('name');
        });

        test('Should return 404 for non-existent category', async () => {
            await request(app)
                .get('/categories/99999')
                .expect(404);
        });
    });

    describe('POST /categories', () => {
        test('Should create a new category with admin token', async () => {
            const response = await request(app)
                .post('/categories')
                .set('Authorization', adminToken)
                .send({
                    name: 'Test Category',
                    description: 'Category for testing',
                    slug: 'test-category-' + Date.now()
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe('Test Category');
            testCategoryId = response.body.id;
        });

        test('Should reject creation without admin token', async () => {
            await request(app)
                .post('/categories')
                .send({
                    name: 'Unauthorized Category',
                    slug: 'unauthorized'
                })
                .expect(401);
        });

        test('Should reject duplicate slug', async () => {
            const slug = 'duplicate-slug-' + Date.now();
            
            await request(app)
                .post('/categories')
                .set('Authorization', adminToken)
                .send({
                    name: 'First Category',
                    slug: slug
                })
                .expect(201);

            await request(app)
                .post('/categories')
                .set('Authorization', adminToken)
                .send({
                    name: 'Second Category',
                    slug: slug
                })
                .expect(409);
        });
    });

    describe('PUT /categories/:id', () => {
        test('Should update a category with admin token', async () => {
            if (!testCategoryId) {
                const createResponse = await request(app)
                    .post('/categories')
                    .set('Authorization', adminToken)
                    .send({
                        name: 'To Update',
                        slug: 'to-update-' + Date.now()
                    });
                testCategoryId = createResponse.body.id;
            }

            const response = await request(app)
                .put(`/categories/${testCategoryId}`)
                .set('Authorization', adminToken)
                .send({
                    name: 'Updated Category Name',
                    description: 'Updated description',
                    slug: 'updated-slug-' + Date.now()
                })
                .expect(200);

            expect(response.body.name).toBe('Updated Category Name');
        });

        test('Should reject update without admin token', async () => {
            await request(app)
                .put('/categories/1')
                .send({
                    name: 'Unauthorized Update'
                })
                .expect(401);
        });
    });

    describe('DELETE /categories/:id', () => {
        test('Should delete a category with admin token', async () => {
            const createResponse = await request(app)
                .post('/categories')
                .set('Authorization', adminToken)
                .send({
                    name: 'To Delete',
                    slug: 'to-delete-' + Date.now()
                });

            await request(app)
                .delete(`/categories/${createResponse.body.id}`)
                .set('Authorization', adminToken)
                .expect(200);
        });

        test('Should reject deletion without admin token', async () => {
            await request(app)
                .delete('/categories/1')
                .expect(401);
        });
    });
});
