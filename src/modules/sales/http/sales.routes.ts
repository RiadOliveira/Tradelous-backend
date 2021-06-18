import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSaleService from '../services/CreateSaleService';

const salesRoutes = Router();

salesRoutes.get('/', async (request: Request, response: Response) => {});

salesRoutes.get(
    '/from-employee/:employeeId',
    async (request: Request, response: Response) => {},
);

salesRoutes.post('/', async (request: Request, response: Response) => {
    const { productId, type, quantity } = request.body;

    const userId = request.user.id;

    const createSale = container.resolve(CreateSaleService);

    const newSale = await createSale.execute({
        employeeId: userId,
        productId,
        type,
        quantity,
    });

    return response.json(newSale);
});

salesRoutes.put(
    '/update/:saleId',
    async (request: Request, response: Response) => {},
);

salesRoutes.delete('/:saleId', async (request: Request, response: Response) => {
    return response.status(204).json();
});

export default salesRoutes;
