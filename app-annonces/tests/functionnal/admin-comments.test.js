const request = require('supertest');
const app = require('../../src/app');
const { AdminComment, Annonce } = require('../../src/models');

describe('Admin Comments API - Functional Tests', () => {
    let adminToken;
    let testAnnonceId;
    let testCommentId;

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
            title: 'Test Annonce for Comments',
            description: 'This is a test annonce',
            price: 150,
            status: 'draft'
        });
        testAnnonceId = annonce.id;
    });

    afterAll(async () => {
        // Clean up
        if (testAnnonceId) {
            await AdminComment.destroy({ where: { annonce_id: testAnnonceId } });
            await Annonce.destroy({ where: { id: testAnnonceId } });
        }
    });

    describe('POST /admin-comments', () => {
        test('Should create an admin comment with admin token', async () => {
            const response = await request(app)
                .post('/admin-comments')
                .set('Authorization', adminToken)
                .send({
                    annonce_id: testAnnonceId,
                    comment: 'This annonce needs revision before publication'
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.comment).toBe('This annonce needs revision before publication');
            expect(response.body.annonce_id).toBe(testAnnonceId);
            testCommentId = response.body.id;
        });

        test('Should reject comment creation without admin token', async () => {
            await request(app)
                .post('/admin-comments')
                .send({
                    annonce_id: testAnnonceId,
                    comment: 'Unauthorized comment'
                })
                .expect(401);
        });

        test('Should reject comment without required fields', async () => {
            await request(app)
                .post('/admin-comments')
                .set('Authorization', adminToken)
                .send({
                    annonce_id: testAnnonceId
                })
                .expect(400);
        });
    });

    describe('GET /admin-comments/:annonceId', () => {
        test('Should return comments for a specific annonce', async () => {
            const response = await request(app)
                .get(`/admin-comments/${testAnnonceId}`)
                .set('Authorization', adminToken)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('id');
                expect(response.body[0]).toHaveProperty('comment');
                expect(response.body[0]).toHaveProperty('annonce_id', testAnnonceId);
            }
        });

        test('Should reject access without admin token', async () => {
            await request(app)
                .get(`/admin-comments/${testAnnonceId}`)
                .expect(401);
        });
    });
});
