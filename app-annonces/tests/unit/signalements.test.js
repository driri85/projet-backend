const signalementsService = require('../../src/services/signalements');
const { Signalement } = require('../../src/models');

jest.mock('../../src/models');

describe('Signalements Service - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        test('Should create a new signalement', async () => {
            const mockSignalement = {
                id: 1,
                annonce_id: 1,
                email: 'user@example.com',
                message: 'Inappropriate content',
                status: 'new'
            };

            Signalement.create = jest.fn().mockResolvedValue(mockSignalement);

            const result = await signalementsService.create({
                annonce_id: 1,
                email: 'user@example.com',
                message: 'Inappropriate content'
            });

            expect(Signalement.create).toHaveBeenCalledWith({
                annonce_id: 1,
                email: 'user@example.com',
                message: 'Inappropriate content',
                status: 'new'
            });
            expect(result).toEqual(mockSignalement);
        });
    });

    describe('getAll', () => {
        test('Should return all signalements with associations', async () => {
            const mockSignalements = [
                {
                    id: 1,
                    status: 'new',
                    Annonce: { id: 1, title: 'Test Annonce' }
                },
                {
                    id: 2,
                    status: 'in-progress',
                    Annonce: { id: 2, title: 'Another Annonce' }
                }
            ];

            Signalement.findAll = jest.fn().mockResolvedValue(mockSignalements);

            const result = await signalementsService.getAll();

            expect(Signalement.findAll).toHaveBeenCalledWith({
                include: ['Annonce', 'Admin'],
                order: [['createdAt', 'DESC']]
            });
            expect(result).toEqual(mockSignalements);
        });
    });

    describe('updateStatus', () => {
        test('Should update signalement status successfully', async () => {
            const mockSignalement = {
                id: 1,
                status: 'new',
                update: jest.fn().mockResolvedValue({
                    id: 1,
                    status: 'processed',
                    admin_id: 1,
                    response: 'Issue resolved'
                })
            };

            Signalement.findByPk = jest.fn().mockResolvedValue(mockSignalement);

            const result = await signalementsService.updateStatus(1, {
                status: 'processed',
                admin_id: 1,
                response: 'Issue resolved'
            });

            expect(mockSignalement.update).toHaveBeenCalledWith({
                status: 'processed',
                admin_id: 1,
                response: 'Issue resolved',
                processedAt: expect.any(Date)
            });
            expect(result).toHaveProperty('status', 'processed');
        });

        test('Should return null for non-existent signalement', async () => {
            Signalement.findByPk = jest.fn().mockResolvedValue(null);

            const result = await signalementsService.updateStatus(999, { status: 'processed' });

            expect(result).toBeNull();
        });
    });
});
