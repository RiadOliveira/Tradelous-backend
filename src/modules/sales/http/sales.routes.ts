import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import ListSalesFromCompanyService from '../services/ListSalesFromCompanyService';
import ListSalesFromEmployeeService from '../services/ListSalesFromEmployeeService';
import CreateSaleService from '../services/CreateSaleService';
import UpdateSaleService from '../services/UpdateSaleService';
import DeleteSaleService from '../services/DeleteSaleService';

const salesRoutes = Router();

salesRoutes.get('/', async (request: Request, response: Response) => {
    const userId = request.user.id;

    const listSalesFromCompany = container.resolve(ListSalesFromCompanyService);

    const findedSales = await listSalesFromCompany.execute(userId);

    return response.json(findedSales);
});

salesRoutes.get(
    '/:employeeId',
    async (request: Request, response: Response) => {
        const { employeeId } = request.params;

        const listSalesFromEmployee = container.resolve(
            ListSalesFromEmployeeService,
        );

        const findedSales = await listSalesFromEmployee.execute(employeeId);

        return response.json(findedSales);
    },
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

    return response.status(201).json(newSale);
});

salesRoutes.put('/:saleId', async (request: Request, response: Response) => {
    const { id, employeeId, productId, type, quantity } = request.body;

    const userId = request.user.id;

    const updateSale = container.resolve(UpdateSaleService);

    const updatedSale = await updateSale.execute(
        {
            id,
            employeeId,
            productId,
            type,
            quantity,
        },
        userId,
    );

    return response.status(202).json(updatedSale);
});

salesRoutes.delete('/:saleId', async (request: Request, response: Response) => {
    const { saleId } = request.params;

    const userId = request.user.id;

    const deleteSale = container.resolve(DeleteSaleService);

    await deleteSale.execute(saleId, userId);

    return response.status(204).json();
});

export default salesRoutes;
