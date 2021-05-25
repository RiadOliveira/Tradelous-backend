import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProductsFromCompanyService from '../services/ListProductsFromCompanyService';
import AddProductToCompanyService from '../services/AddProductToCompanyService';
import DeleteProductFromCompanyService from '../services/DeleteProductFromCompanyService';
import UpdateProductService from '../services/UpdateProductService';
import multer from 'multer';
import multerConfig from '@config/upload';
import UpdateProductsImageService from '../services/UpdateProductsImageService';

const productsRoutes = Router();
const upload = multer(multerConfig);

productsRoutes.get(
    '/:companyId',
    async (request: Request, response: Response) => {
        const { companyId } = request.params;

        const listProductsFromCompany = container.resolve(
            ListProductsFromCompanyService,
        );

        const allProducts = await listProductsFromCompany.execute(companyId);

        return response.json(allProducts);
    },
);

productsRoutes.post(
    '/add',
    upload.single('image'),
    async (request: Request, response: Response) => {
        const { name, price, quantity, brand, barCode } = request.body;

        let image;
        if (request.file) {
            image = request.file.filename;
        }

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
    '/update/:productId',
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
    '/updateImage/:productId',
    upload.single('image'),
    async (request: Request, response: Response) => {
        const { productId } = request.params;

        let image = '';
        if (request.file) {
            image = request.file.filename;
        }

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
    '/delete/:productId',
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
