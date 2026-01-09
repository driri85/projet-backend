const adminCommentsService = require('../../src/services/adminComments');
const { AdminComment } = require('../../src/models');

jest.mock('../../src/models');

describe('AdminComments Service - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        test('Should create a new admin comment', async () => {
            const mockComment = {
                id: 1,
                annonce_id: 1,
                admin_id: 1,
                comment: 'This needs review'
            };

            AdminComment.create = jest.fn().mockResolvedValue(mockComment);

            const result = await adminCommentsService.create({
                annonce_id: 1,
                admin_id: 1,
                comment: 'This needs review'
            });

            expect(AdminComment.create).toHaveBeenCalledWith({
                annonce_id: 1,
                admin_id: 1,
                comment: 'This needs review'
            });
            expect(result).toEqual(mockComment);
        });
    });

    describe('getByAnnonceId', () => {
        test('Should return comments for specific annonce', async () => {
            const mockComments = [
                {
                    id: 1,
                    annonce_id: 1,
                    comment: 'First comment',
                    Admin: { id: 1, username: 'admin@test.com' }
                },
                {
                    id: 2,
                    annonce_id: 1,
                    comment: 'Second comment',
                    Admin: { id: 1, username: 'admin@test.com' }
                }
            ];

            AdminComment.findAll = jest.fn().mockResolvedValue(mockComments);

            const result = await adminCommentsService.getByAnnonceId(1);

            expect(AdminComment.findAll).toHaveBeenCalledWith({
                where: { annonce_id: 1 },
                include: ['Admin'],
                order: [['createdAt', 'DESC']]
            });
            expect(result).toEqual(mockComments);
        });

        test('Should return empty array when no comments exist', async () => {
            AdminComment.findAll = jest.fn().mockResolvedValue([]);

            const result = await adminCommentsService.getByAnnonceId(999);

            expect(result).toEqual([]);
        });
    });
});
