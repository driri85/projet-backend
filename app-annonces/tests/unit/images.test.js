const imagesService = require('../../src/services/images');
const { ImageAnnonce } = require('../../src/models');

jest.mock('../../src/models');

describe('Images Service - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        test('Should create a new image', async () => {
            const mockImage = {
                id: 1,
                annonce_id: 1,
                url: 'https://example.com/image.jpg',
                ordering: 0
            };

            ImageAnnonce.create = jest.fn().mockResolvedValue(mockImage);

            const result = await imagesService.create({
                annonce_id: 1,
                url: 'https://example.com/image.jpg',
                ordering: 0
            });

            expect(ImageAnnonce.create).toHaveBeenCalledWith({
                annonce_id: 1,
                url: 'https://example.com/image.jpg',
                ordering: 0
            });
            expect(result).toEqual(mockImage);
        });
    });

    describe('getByAnnonceId', () => {
        test('Should return images for specific annonce ordered by ordering', async () => {
            const mockImages = [
                { id: 1, url: 'image1.jpg', ordering: 0 },
                { id: 2, url: 'image2.jpg', ordering: 1 },
                { id: 3, url: 'image3.jpg', ordering: 2 }
            ];

            ImageAnnonce.findAll = jest.fn().mockResolvedValue(mockImages);

            const result = await imagesService.getByAnnonceId(1);

            expect(ImageAnnonce.findAll).toHaveBeenCalledWith({
                where: { annonce_id: 1 },
                order: [['ordering', 'ASC']]
            });
            expect(result).toEqual(mockImages);
        });

        test('Should return empty array when no images exist', async () => {
            ImageAnnonce.findAll = jest.fn().mockResolvedValue([]);

            const result = await imagesService.getByAnnonceId(999);

            expect(result).toEqual([]);
        });
    });

    describe('delete', () => {
        test('Should delete image successfully', async () => {
            const mockImage = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(true)
            };

            ImageAnnonce.findByPk = jest.fn().mockResolvedValue(mockImage);

            const result = await imagesService.delete(1);

            expect(mockImage.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test('Should return false for non-existent image', async () => {
            ImageAnnonce.findByPk = jest.fn().mockResolvedValue(null);

            const result = await imagesService.delete(999);

            expect(result).toBe(false);
        });
    });
});
