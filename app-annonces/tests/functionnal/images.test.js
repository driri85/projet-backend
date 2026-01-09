const request = require('supertest');
const app = require('../../src/app');
const { ImageAnnonce, Annonce } = require('../../src/models');

describe('Images API - Functional Tests', () => {
    let adminToken;
    let testAnnonceId;
    let testImageId;

    beforeAll(async () => {
        // Login as admin
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'contact@soufian-a.net',
                password: 'MotDePasse123'
            });
        adminToken = loginResponse.body.token;

        // Create a test annonce
        const annonce = await Annonce.create({
            title: 'Test Annonce for Images',
            description: 'This is a test annonce',
            price: 200,
            status: 'published'
        });
        testAnnonceId = annonce.id;
    });

    afterAll(async () => {
        // Clean up
        if (testAnnonceId) {
            await ImageAnnonce.destroy({ where: { annonce_id: testAnnonceId } });
            await Annonce.destroy({ where: { id: testAnnonceId } });
        }
    });

    describe('POST /images', () => {
        test('Should add an image to annonce with admin token', async () => {
            const response = await request(app)
                .post('/images')
                .set('Authorization', adminToken)
                .send({
                    annonce_id: testAnnonceId,
                    url: 'https://example.com/image1.jpg',
                    ordering: 0
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.url).toBe('https://example.com/image1.jpg');
            expect(response.body.annonce_id).toBe(testAnnonceId);
            testImageId = response.body.id;
        });

        test('Should reject image creation without admin token', async () => {
            await request(app)
                .post('/images')
                .send({
                    annonce_id: testAnnonceId,
                    url: 'https://example.com/unauthorized.jpg'
                })
                .expect(401);
        });
    });

    describe('GET /images/:annonceId', () => {
        test('Should return images for a specific annonce (public)', async () => {
            const response = await request(app)
                .get(`/images/${testAnnonceId}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('id');
                expect(response.body[0]).toHaveProperty('url');
                expect(response.body[0]).toHaveProperty('ordering');
            }
        });

        test('Should return empty array for annonce with no images', async () => {
            const newAnnonce = await Annonce.create({
                title: 'No Images',
                description: 'Test',
                price: 50,
                status: 'published'
            });

            const response = await request(app)
                .get(`/images/${newAnnonce.id}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);

            await Annonce.destroy({ where: { id: newAnnonce.id } });
        });
    });

    describe('DELETE /images/:id', () => {
        test('Should delete an image with admin token', async () => {
            const createResponse = await request(app)
                .post('/images')
                .set('Authorization', adminToken)
                .send({
                    annonce_id: testAnnonceId,
                    url: 'https://example.com/to-delete.jpg',
                    ordering: 1
                });

            await request(app)
                .delete(`/images/${createResponse.body.id}`)
                .set('Authorization', adminToken)
                .expect(200);
        });

        test('Should reject deletion without admin token', async () => {
            await request(app)
                .delete(`/images/${testImageId}`)
                .expect(401);
        });

        test('Should return 404 for non-existent image', async () => {
            await request(app)
                .delete('/images/99999')
                .set('Authorization', adminToken)
                .expect(404);
        });
    });
});
