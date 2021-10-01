import ListSalesFromEmployeeService from '../services/ListSalesFromEmployeeService';
import CreateSaleService from '../services/CreateSaleService';
import UpdateSaleService from '../services/UpdateSaleService';
import DeleteSaleService from '../services/DeleteSaleService';
import ListSalesOnMonthService from '../services/ListSalesOnMonth';
import ListSalesOnDayService from '../services/ListSalesOnDay';
import ListSalesOnWeekService from '../services/ListSalesOnWeek';

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

//Pass day-month on params.
salesRoutes.get('/day/:date', async (request: Request, response: Response) => {
    const userId = request.user.id;

    const { date } = request.params;

    const [day, month, year] = date.split('-');

    const listSalesOnDay = container.resolve(ListSalesOnDayService);

    const findedSales = await listSalesOnDay.execute(userId, day, month, year);

    return response.json(classToClass(findedSales));
});

//Pass day-month-year on params.
salesRoutes.get('/week/:date', async (request: Request, response: Response) => {
    const userId = request.user.id;

    const { date } = request.params;

    const [day, month, year] = date.split('-');

    const listSalesOnWeek = container.resolve(ListSalesOnWeekService);

    const findedSales = await listSalesOnWeek.execute(userId, day, month, year);

    return response.json(classToClass(findedSales));
});

//Pass month-year on params.
salesRoutes.get(
    '/month/:date',
    async (request: Request, response: Response) => {
        const userId = request.user.id;

        const { date } = request.params;

        const [month, year] = date.split('-');

        const listSalesOnMonth = container.resolve(ListSalesOnMonthService);

        const findedSales = await listSalesOnMonth.execute(userId, month, year);

        return response.json(classToClass(findedSales));
    },
);

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
            productId: Joi.string().uuid().required(),
            method: Joi.string().valid('money', 'card').required(),
            quantity: Joi.number().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { productId, method, quantity } = request.body;
        const { saleId } = request.params;

        const userId = request.user.id;

        const updateSale = container.resolve(UpdateSaleService);

        const updatedSale = await updateSale.execute(
            {
                id: saleId,
                productId,
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
