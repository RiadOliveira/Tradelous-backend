import ListProductsFromCompanyService from '../services/ListProductsFromCompanyService';
import AddProductToCompanyService from '../services/AddProductToCompanyService';
import DeleteProductFromCompanyService from '../services/DeleteProductFromCompanyService';
import UpdateProductService from '../services/UpdateProductService';
import multer from 'multer';
import multerConfig from '@config/upload';
import UpdateProductsImageService from '../services/UpdateProductsImageService';

import { Router, Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { container } from 'tsyringe';

const productsRoutes = Router();
const upload = multer(multerConfig);

productsRoutes.get('/', async (request: Request, response: Response) => {
    const userId = request.user.id;

    const listProductsFromCompany = container.resolve(
        ListProductsFromCompanyService,
    );
    const allProducts = await listProductsFromCompany.execute(userId);

    return response.json(allProducts);
});

productsRoutes.post(
    '/',
    upload.single('image'),
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
            brand: Joi.string().required(),
            barCode: Joi.string().optional(),
        },
    }),
    async (request: Request, response: Response) => {
        const { name, price, quantity, brand, barCode } = request.body;
        const image = request.file ? request.file.filename : '';
        const userId = request.user.id;

        const addProductToCompany = container.resolve(
            AddProductToCompanyService,
        );
        const newProduct = await addProductToCompany.execute(
            {
                name,
                price,
                quantity,
                brand,
                barCode,
                image,
            },
            userId,
        );

        return response.status(201).json(newProduct);
    },
);

productsRoutes.put(
    '/:productId',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
            brand: Joi.string().required(),
            barCode: Joi.string().optional(),
        },
        [Segments.PARAMS]: {
            productId: Joi.string().uuid().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { productId } = request.params;
        const { name, price, quantity, brand, barCode } = request.body;
        const userId = request.user.id;

        const updateProduct = container.resolve(UpdateProductService);
        const updatedProduct = await updateProduct.execute(
            {
                name,
                id: productId,
                price,
                quantity,
                brand,
                barCode,
            },
            userId,
        );

        return response.status(202).json(updatedProduct);
    },
);

productsRoutes.patch(
    '/update-image/:productId',
    upload.single('image'),
    celebrate({
        [Segments.PARAMS]: {
            productId: Joi.string().uuid().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { productId } = request.params;
        const image = request.file ? request.file.filename : '';
        const userId = request.user.id;

        const updateProductsImage = container.resolve(
            UpdateProductsImageService,
        );
        const updatedProduct = await updateProductsImage.execute(
            {
                productId,
                image,
            },
            userId,
        );

        return response.status(202).json(updatedProduct);
    },
);

productsRoutes.delete(
    '/:productId',
    celebrate({
        [Segments.PARAMS]: {
            productId: Joi.string().uuid().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { productId } = request.params;
        const userId = request.user.id;

        const deleteProductFromCompany = container.resolve(
            DeleteProductFromCompanyService,
        );
        await deleteProductFromCompany.execute(productId, userId);

        return response.status(204).json();
    },
);

export default productsRoutes;
