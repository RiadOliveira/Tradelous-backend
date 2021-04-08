import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProductsFromCompanyService from '../services/listProductsFromCompanyService';
import AddProductToCompanyService from '../services/addProductToCompanyService';
import DeleteProductFromCompanyService from '../services/deleteProductFromCompanyService';

const productsRoutes = Router();

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

productsRoutes.post('/add', async (request: Request, response: Response) => {
    const { name, companyId, price, brand, qrCode } = request.body;

    const addProductToCompany = container.resolve(AddProductToCompanyService);

    const newProduct = await addProductToCompany.execute({
        name,
        companyId,
        price,
        brand,
        qrCode,
    });

    return response.json(newProduct).status(201);
});

productsRoutes.put('/update', async (request: Request, response: Response) => {
    //To finish
    const { name, price, brand, qrCode, id } = request.body;
    return response.json();
});

productsRoutes.delete(
    '/delete/:productId',
    async (request: Request, response: Response) => {
        const { productId } = request.params;

        const userId = request.user.id;

        const deleteProductFromCompany = container.resolve(
            DeleteProductFromCompanyService,
        );

        await deleteProductFromCompany.execute(productId, userId);

        return response.json().status(204);
    },
);

export default productsRoutes;
