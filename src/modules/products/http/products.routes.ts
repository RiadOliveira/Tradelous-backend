import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProductsFromCompanyService from '../services/ListProductsFromCompanyService';
import AddProductToCompanyService from '../services/AddProductToCompanyService';
import DeleteProductFromCompanyService from '../services/DeleteProductFromCompanyService';
import UpdateProductService from '../services/UpdateProductService';

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

    const userId = request.user.id;

    const addProductToCompany = container.resolve(AddProductToCompanyService);

    const newProduct = await addProductToCompany.execute(
        {
            name,
            companyId,
            price,
            brand,
            qrCode,
        },
        userId,
    );

    return response.json(newProduct).status(201);
});

productsRoutes.put('/update', async (request: Request, response: Response) => {
    const { name, price, brand, qrCode, id } = request.body;

    const updateProduct = container.resolve(UpdateProductService);

    const updatedProduct = await updateProduct.execute({
        name,
        price,
        brand,
        qrCode,
        id,
    });

    return response.json(updatedProduct).status(202);
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
