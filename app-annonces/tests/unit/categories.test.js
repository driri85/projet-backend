const categoriesService = require('../../src/services/categories');
const { Category } = require('../../src/models');

jest.mock('../../src/models');

describe('Categories Service - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        test('Should return all categories', async () => {
            const mockCategories = [
                { id: 1, name: 'Électronique', slug: 'electronique' },
                { id: 2, name: 'Mobilier', slug: 'mobilier' }
            ];

            Category.findAll = jest.fn().mockResolvedValue(mockCategories);

            const result = await categoriesService.getAll();

            expect(Category.findAll).toHaveBeenCalledWith({
                order: [['name', 'ASC']]
            });
            expect(result).toEqual(mockCategories);
        });
    });

    describe('getById', () => {
        test('Should return category by id', async () => {
            const mockCategory = { id: 1, name: 'Électronique', slug: 'electronique' };

            Category.findByPk = jest.fn().mockResolvedValue(mockCategory);

            const result = await categoriesService.getById(1);

            expect(Category.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockCategory);
        });

        test('Should return null for non-existent category', async () => {
            Category.findByPk = jest.fn().mockResolvedValue(null);

            const result = await categoriesService.getById(999);

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        test('Should create a new category', async () => {
            const mockCategory = {
                id: 3,
                name: 'Véhicules',
                slug: 'vehicules',
                description: 'Cars and bikes'
            };

            Category.create = jest.fn().mockResolvedValue(mockCategory);

            const result = await categoriesService.create({
                name: 'Véhicules',
                slug: 'vehicules',
                description: 'Cars and bikes'
            });

            expect(Category.create).toHaveBeenCalledWith({
                name: 'Véhicules',
                slug: 'vehicules',
                description: 'Cars and bikes'
            });
            expect(result).toEqual(mockCategory);
        });
    });

    describe('update', () => {
        test('Should update category successfully', async () => {
            const mockCategory = {
                id: 1,
                name: 'Électronique',
                slug: 'electronique',
                update: jest.fn().mockResolvedValue({ id: 1, name: 'Electronics Updated' })
            };

            Category.findByPk = jest.fn().mockResolvedValue(mockCategory);

            const result = await categoriesService.update(1, { name: 'Electronics Updated' });

            expect(mockCategory.update).toHaveBeenCalledWith({ name: 'Electronics Updated' });
            expect(result).toHaveProperty('name', 'Electronics Updated');
        });

        test('Should return null for non-existent category', async () => {
            Category.findByPk = jest.fn().mockResolvedValue(null);

            const result = await categoriesService.update(999, { name: 'Test' });

            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        test('Should delete category successfully', async () => {
            const mockCategory = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(true)
            };

            Category.findByPk = jest.fn().mockResolvedValue(mockCategory);

            const result = await categoriesService.delete(1);

            expect(mockCategory.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test('Should return false for non-existent category', async () => {
            Category.findByPk = jest.fn().mockResolvedValue(null);

            const result = await categoriesService.delete(999);

            expect(result).toBe(false);
        });
    });
});
