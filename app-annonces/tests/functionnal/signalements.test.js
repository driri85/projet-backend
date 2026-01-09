const request = require('supertest');
const app = require('../../src/app');
const { Signalement, Annonce } = require('../../src/models');

describe('Signalements API - Functional Tests', () => {
    let adminToken;
    let testAnnonceId;
    let testSignalementId;

    beforeAll(async () => {
        // Login as admin
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'contact@arsdv.site',
                password: 'MotDePasse123'
            });
        adminToken = loginResponse.body.token;

        // Create a test annonce
        const annonce = await Annonce.create({
            title: 'Test Annonce for Signalement',
            description: 'This is a test annonce',
            price: 100,
            status: 'published'
        });
        testAnnonceId = annonce.id;
    });

    afterAll(async () => {
        // Clean up
        if (testSignalementId) {
            await Signalement.destroy({ where: { id: testSignalementId } });
        }
        if (testAnnonceId) {
            await Annonce.destroy({ where: { id: testAnnonceId } });
        }
    });

    describe('POST /signalements', () => {
        test('Should create a signalement (public endpoint)', async () => {
            const response = await request(app)
                .post('/signalements')
                .send({
                    annonce_id: testAnnonceId,
                    email: 'reporter@example.com',
                    message: 'This annonce contains inappropriate content'
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('reporter@example.com');
            expect(response.body.status).toBe('new');
            testSignalementId = response.body.id;
        });

        test('Should reject signalement without required fields', async () => {
            await request(app)
                .post('/signalements')
                .send({
                    annonce_id: testAnnonceId
                })
                .expect(400);
        });
    });

    describe('GET /signalements', () => {
        test('Should return list of signalements for admin', async () => {
            const response = await request(app)
                .get('/signalements')
                .set('Authorization', adminToken)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('id');
                expect(response.body[0]).toHaveProperty('email');
                expect(response.body[0]).toHaveProperty('status');
            }
        });

        test('Should reject access without admin token', async () => {
            await request(app)
                .get('/signalements')
                .expect(401);
        });
    });

    describe('PATCH /signalements/:id', () => {
        test('Should update signalement status for admin', async () => {
            if (!testSignalementId) {
                const createResponse = await request(app)
                    .post('/signalements')
                    .send({
                        annonce_id: testAnnonceId,
                        email: 'test@example.com',
                        message: 'Test report'
                    });
                testSignalementId = createResponse.body.id;
            }

            const response = await request(app)
                .patch(`/signalements/${testSignalementId}`)
                .set('Authorization', adminToken)
                .send({
                    status: 'processed',
                    response: 'We have taken appropriate action'
                })
                .expect(200);

            expect(response.body.status).toBe('processed');
            expect(response.body.response).toBe('We have taken appropriate action');
        });

        test('Should reject update without admin token', async () => {
            await request(app)
                .patch(`/signalements/${testSignalementId}`)
                .send({
                    status: 'processed'
                })
                .expect(401);
        });
    });
});
