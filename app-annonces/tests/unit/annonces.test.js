const annoncesService = require('../../src/services/annonces');
const { Annonce, dbInstance } = require('../../src/models');
const { mailer } = require('../../src/utils/mailer');

jest.mock('../../src/models');
jest.mock('../../src/utils/mailer');

describe('Annonces Service - Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            params: {},
            query: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    describe('getAnnonceById', () => {
        test('Should return annonce by id', async () => {
            const mockAnnonce = {
                id: 1,
                title: 'Test Annonce',
                description: 'Test Description',
                price: 100,
                status: 'active',
                category_id: 1
            };

            req.params.id = 1;
            Annonce.findOne = jest.fn().mockResolvedValue(mockAnnonce);

            await annoncesService.getAnnonceById(req, res);

            expect(Annonce.findOne).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAnnonce);
        });

        test('Should return null for non-existent annonce', async () => {
            req.params.id = 999;
            Annonce.findOne = jest.fn().mockResolvedValue(null);

            await annoncesService.getAnnonceById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(null);
        });
    });

    describe('searchAnnonce', () => {
        test('Should return all annonces when no search key provided', async () => {
            const mockAnnonces = [
                { id: 1, title: 'Annonce 1' },
                { id: 2, title: 'Annonce 2' }
            ];

            Annonce.findAll = jest.fn().mockResolvedValue(mockAnnonces);

            await annoncesService.searchAnnonce(req, res);

            expect(Annonce.findAll).toHaveBeenCalledWith({});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAnnonces);
        });

        test('Should return filtered annonces with search key', async () => {
            const mockAnnonces = [
                { id: 1, title: 'Laptop HP' }
            ];

            req.query.search = 'Laptop';
            Annonce.findAll = jest.fn().mockResolvedValue(mockAnnonces);

            await annoncesService.searchAnnonce(req, res);

            expect(Annonce.findAll).toHaveBeenCalledWith({
                where: {
                    title: {
                        [require('sequelize').Op.like]: '%Laptop%'
                    }
                }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAnnonces);
        });
    });

    describe('createAnnonce', () => {
        let mockTransaction;

        beforeEach(() => {
            mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            dbInstance.transaction = jest.fn().mockResolvedValue(mockTransaction);
        });

        test('Should create annonce successfully', async () => {
            const mockAnnonce = {
                id: 1,
                title: 'New Annonce',
                description: 'Description',
                price: 150,
                filepath: '/path/to/image',
                status: 'active',
                category_id: 1
            };

            req.body = {
                title: 'New Annonce',
                description: 'Description',
                price: 150,
                filepath: '/path/to/image',
                status: 'active',
                category_id: 1
            };

            const mockMailInfo = { messageId: '123', accepted: ['admin@test.com'] };

            Annonce.create = jest.fn().mockResolvedValue(mockAnnonce);
            mailer.mockResolvedValue(mockMailInfo);

            await annoncesService.createAnnonce(req, res);

            expect(Annonce.create).toHaveBeenCalledWith(
                {
                    title: 'New Annonce',
                    description: 'Description',
                    price: 150,
                    filepath: '/path/to/image',
                    status: 'active',
                    category_id: 1
                },
                { transaction: mockTransaction }
            );
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Annonce créer avec succès',
                annonce: mockAnnonce,
                mail_notification: mockMailInfo
            });
        });

        test('Should handle creation error', async () => {
            req.body = {
                title: 'New Annonce',
                description: 'Description',
                price: 150,
                status: 'active',
                category_id: 1
            };

            const mockError = new Error('Database error');
            Annonce.create = jest.fn().mockRejectedValue(mockError);

            await annoncesService.createAnnonce(req, res);

            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Erreur de la création de l\'annonce',
                message: mockError
            });
        });
    });

    describe('updateAnnonce', () => {
        let mockTransaction;

        beforeEach(() => {
            mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            dbInstance.transaction = jest.fn().mockResolvedValue(mockTransaction);
        });

        test('Should update annonce successfully', async () => {
            req.params.id = 1;
            req.body = {
                title: 'Updated Annonce',
                description: 'Updated Description',
                price: 200,
                filepath: '/path/to/image',
                status: 'inactive',
                category_id: 2
            };

            Annonce.update = jest.fn().mockResolvedValue([1]);

            await annoncesService.updateAnnonce(req, res);

            expect(Annonce.update).toHaveBeenCalledWith(
                {
                    title: 'Updated Annonce',
                    description: 'Updated Description',
                    price: 200,
                    filepath: '/path/to/image',
                    status: 'inactive',
                    category_id: 2
                },
                {
                    where: { id: 1 },
                    transaction: mockTransaction
                }
            );
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Annonce mise à jour avec succès',
                annonce: [1]
            });
        });

        test('Should handle update error', async () => {
            req.params.id = 1;
            req.body = {
                title: 'Updated Annonce'
            };

            const mockError = new Error('Update error');
            Annonce.update = jest.fn().mockRejectedValue(mockError);

            await annoncesService.updateAnnonce(req, res);

            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Erreur de la mise à jour de l\'annonce',
                error: mockError
            });
        });
    });

    describe('deleteAnnonce', () => {
        let mockTransaction;

        beforeEach(() => {
            mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            dbInstance.transaction = jest.fn().mockResolvedValue(mockTransaction);
        });

        test('Should delete annonce successfully', async () => {
            req.params.id = 1;

            Annonce.destroy = jest.fn().mockResolvedValue(1);

            await annoncesService.deleteAnnonce(req, res);

            expect(Annonce.destroy).toHaveBeenCalledWith({
                where: { id: 1 },
                transaction: mockTransaction
            });
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Annonce supprimée avec succès'
            });
        });

        test('Should handle delete error', async () => {
            req.params.id = 1;

            const mockError = new Error('Delete error');
            Annonce.destroy = jest.fn().mockRejectedValue(mockError);

            await annoncesService.deleteAnnonce(req, res);

            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Erreur de la suppression de l\'annonce',
                error: mockError
            });
        });
    });

    describe('multiplicated', () => {
        test('Should multiply two numbers correctly', () => {
            const result = annoncesService.multiplicated(5, 3);
            expect(result).toBe(15);
        });

        test('Should handle zero multiplication', () => {
            const result = annoncesService.multiplicated(5, 0);
            expect(result).toBe(0);
        });

        test('Should handle negative numbers', () => {
            const result = annoncesService.multiplicated(-5, 3);
            expect(result).toBe(-15);
        });
    });

    describe('multiplicate', () => {
        test('Should multiply array values and return result', () => {
            req.body.items = [4, 5];

            annoncesService.multiplicate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ result: 20 });
        });

        test('Should handle invalid format', () => {
            req.body.items = [null, 5];

            annoncesService.multiplicate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Format incorrect' });
        });

        test('Should handle zero result', () => {
            req.body.items = [0, 5];

            annoncesService.multiplicate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Format incorrect' });
        });
    });
});
