import ListSalesFromEmployeeService from '../services/ListSalesFromEmployeeService';
import CreateSaleService from '../services/CreateSaleService';
import UpdateSaleService from '../services/UpdateSaleService';
import DeleteSaleService from '../services/DeleteSaleService';
import salesListRoutes from './sales.list.routes';

import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

const salesRoutes = Router();

salesRoutes.get(
    '/employee/:employeeId',
    celebrate({
        [Segments.PARAMS]: {
            employeeId: Joi.string().uuid().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { employeeId } = request.params;

        const listSalesFromEmployee = container.resolve(
            ListSalesFromEmployeeService,
        );
        const findedSales = await listSalesFromEmployee.execute(employeeId);

        return response.json(classToClass(findedSales));
    },
);

//Pass day-month-year on params.
salesRoutes.use('/day', salesListRoutes);
salesRoutes.use('/week', salesListRoutes);
salesRoutes.use('/month', salesListRoutes);

salesRoutes.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            productId: Joi.string().uuid().required(),
            method: Joi.string().valid('money', 'card').required(),
            quantity: Joi.number().required(),
        },
    }),
    async (request: Request, response: Response) => {
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
    },
);

salesRoutes.put(
    '/:saleId',
    celebrate({
        [Segments.BODY]: {
            method: Joi.string().valid('money', 'card').required(),
            quantity: Joi.number().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { method, quantity } = request.body;
        const { saleId } = request.params;

        const userId = request.user.id;

        const updateSale = container.resolve(UpdateSaleService);
        const updatedSale = await updateSale.execute(
            {
                id: saleId,
                method,
                quantity,
            },
            userId,
        );

        return response.status(202).json(classToClass(updatedSale));
    },
);

salesRoutes.delete(
    '/:saleId',
    celebrate({
        [Segments.PARAMS]: {
            saleId: Joi.string().uuid().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { saleId } = request.params;
        const userId = request.user.id;

        const deleteSale = container.resolve(DeleteSaleService);
        await deleteSale.execute(saleId, userId);

        return response.status(204).json();
    },
);

export default salesRoutes;
