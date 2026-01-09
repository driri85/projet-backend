const request = require('supertest');
const app = require('../../src/app');
const { Annonce, Category, User } = require('../../src/models');
const { Op } = require('sequelize');

describe('Annonces API - Functional Tests', () => {
    let adminToken;
    let testCategoryId;
    let testAnnonceId;
    let testUserId;

    beforeAll(async () => {
        // Login as admin
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'contact@soufian-a.net',
                password: 'MotDePasse123'
            });
        adminToken = loginResponse.body.token;

        // Create a test category
        const category = await Category.findOne({ where: { slug: 'electronique' } });
        testCategoryId = category ? category.id : null;

        // Get admin user id
        const admin = await User.findOne({ where: { username: 'contact@soufian-a.net' } });
        testUserId = admin.id;
    });

    afterAll(async () => {
        // Clean up test annonces
        if (testAnnonceId) {
            await Annonce.destroy({ where: { id: testAnnonceId } });
        }
        await Annonce.destroy({ where: { title: { [Op.like]: 'Test%' } } });
    });

    describe('GET /annonces', () => {
        test('Should return list of published annonces (public)', async () => {
            const response = await request(app)
                .get('/annonces')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        test('Should filter annonces by category', async () => {
            if (testCategoryId) {
                const response = await request(app)
                    .get(`/annonces?category=${testCategoryId}`)
                    .expect(200);

                expect(Array.isArray(response.body)).toBe(true);
            }
        });

        test('Should search annonces by keyword', async () => {
            const response = await request(app)
                .get('/annonces?search=test')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /annonces/:id', () => {
        beforeAll(async () => {
            const annonce = await Annonce.create({
                title: 'Test Annonce Details',
                description: 'Description',
                price: 150,
                status: 'published',
                category_id: testCategoryId,
                user_id: testUserId
            });
            testAnnonceId = annonce.id;
        });

        test('Should return annonce details by id (public)', async () => {
            const response = await request(app)
                .get(`/annonces/${testAnnonceId}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', testAnnonceId);
            expect(response.body).toHaveProperty('title');
            expect(response.body).toHaveProperty('description');
            expect(response.body).toHaveProperty('price');
        });

        test('Should return 404 for non-existent annonce', async () => {
            await request(app)
                .get('/annonces/99999')
                .expect(404);
        });
    });

    describe('POST /annonces', () => {
        test('Should create annonce with admin token', async () => {
            const response = await request(app)
                .post('/annonces')
                .set('Authorization', adminToken)
                .send({
                    title: 'Test New Annonce',
                    description: 'New test description',
                    price: 250,
                    status: 'published',
                    category_id: testCategoryId
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test New Annonce');

            // Clean up
            await Annonce.destroy({ where: { id: response.body.id } });
        });

        test('Should reject annonce creation without token', async () => {
            await request(app)
                .post('/annonces')
                .send({
                    title: 'Unauthorized',
                    description: 'Test',
                    price: 100
                })
                .expect(401);
        });

        test('Should reject annonce with invalid data', async () => {
            await request(app)
                .post('/annonces')
                .set('Authorization', adminToken)
                .send({
                    title: '',
                    price: -50
                })
                .expect(400);
        });
    });

    describe('PUT /annonces/:id', () => {
        test('Should update annonce with admin token', async () => {
            const response = await request(app)
                .put(`/annonces/${testAnnonceId}`)
                .set('Authorization', adminToken)
                .send({
                    title: 'Updated Title',
                    price: 300
                })
                .expect(200);

            expect(response.body.title).toBe('Updated Title');
            expect(response.body.price).toBe('300');
        });

        test('Should reject update without token', async () => {
            await request(app)
                .put(`/annonces/${testAnnonceId}`)
                .send({
                    title: 'Unauthorized Update'
                })
                .expect(401);
        });

        test('Should return 404 for updating non-existent annonce', async () => {
            await request(app)
                .put('/annonces/99999')
                .set('Authorization', adminToken)
                .send({
                    title: 'Does not exist'
                })
                .expect(404);
        });
    });

    describe('DELETE /annonces/:id', () => {
        test('Should delete annonce with admin token', async () => {
            const annonce = await Annonce.create({
                title: 'Test Delete',
                description: 'To be deleted',
                price: 50,
                status: 'published',
                user_id: testUserId
            });

            await request(app)
                .delete(`/annonces/${annonce.id}`)
                .set('Authorization', adminToken)
                .expect(200);
        });

        test('Should reject deletion without token', async () => {
            await request(app)
                .delete(`/annonces/${testAnnonceId}`)
                .expect(401);
        });

        test('Should return 404 for deleting non-existent annonce', async () => {
            await request(app)
                .delete('/annonces/99999')
                .set('Authorization', adminToken)
                .expect(404);
        });
    });

    describe("POST /annonces/multiplicate", () => {
        test("Retourne le résultat 8 pour l'opération 2x4", async () => {
            const result = await request(app)
                .post("/annonces/multiplicate")
                .send({ items: [2, 4] })
                .expect(200);

            expect(result.body).toEqual({ result: 8 });
        });

        test("Retourne un code erreur 400 si j'envoi des items au mauvais format", async () => {
            await request(app)
                .post("/annonces/multiplicate")
                .send({ items: ["A", "B"] })
                .expect(400);
        });
    });
});