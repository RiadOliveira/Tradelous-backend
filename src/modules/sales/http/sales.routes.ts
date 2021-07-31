import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import ListSalesFromCompanyService from '../services/ListSalesFromCompanyService';
import ListSalesFromEmployeeService from '../services/ListSalesFromEmployeeService';
import CreateSaleService from '../services/CreateSaleService';
import UpdateSaleService from '../services/UpdateSaleService';
import DeleteSaleService from '../services/DeleteSaleService';
import { classToClass } from 'class-transformer';

const salesRoutes = Router();

salesRoutes.get('/', async (request: Request, response: Response) => {
    const userId = request.user.id;

    const listSalesFromCompany = container.resolve(ListSalesFromCompanyService);

    const findedSales = await listSalesFromCompany.execute(userId);

    return response.json(classToClass(findedSales));
});

salesRoutes.get(
    '/:employeeId',
    async (request: Request, response: Response) => {
        const { employeeId } = request.params;

        const listSalesFromEmployee = container.resolve(
            ListSalesFromEmployeeService,
        );

        const findedSales = await listSalesFromEmployee.execute(employeeId);

        return response.json(classToClass(findedSales));
    },
);

salesRoutes.post('/', async (request: Request, response: Response) => {
    const { productId, method, quantity } = request.body;

    const userId = request.user.id;

    const createSale = container.resolve(CreateSaleService);

    const newSale = await createSale.execute({
        employeeId: userId,
        productId,
        method,
        quantity,
    });

    return response.status(201).json(classToClass(newSale));
});

salesRoutes.put('/:saleId', async (request: Request, response: Response) => {
    const { employeeId, productId, method, quantity } = request.body;
    const { saleId } = request.params;

    const userId = request.user.id;

    const updateSale = container.resolve(UpdateSaleService);

    const updatedSale = await updateSale.execute(
        {
            id: saleId,
            employeeId,
            productId,
            method,
            quantity,
        },
        userId,
    );

    return response.status(202).json(classToClass(updatedSale));
});

salesRoutes.delete('/:saleId', async (request: Request, response: Response) => {
    const { saleId } = request.params;

    const userId = request.user.id;

    const deleteSale = container.resolve(DeleteSaleService);

    await deleteSale.execute(saleId, userId);

    return response.status(204).json();
});

export default salesRoutes;
