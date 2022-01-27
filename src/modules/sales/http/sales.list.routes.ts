import ListSalesOnDate from '../services/ListSalesOnDate';

import { classToClass } from 'class-transformer';
import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';

const salesListRoutes = Router();
type searchType = 'day' | 'week' | 'month';

//Pass day-month-year on params.
salesListRoutes.get('/:date', async (request: Request, response: Response) => {
    const userId = request.user.id;
    const type = request.baseUrl.split('/')[2] as searchType;
    const { date } = request.params;

    const [startDay, startMonth, startYear] = date.split('-');
    const searchDate = {
        startDay,
        startMonth,
        startYear,
    };

    const listSalesOnDate = container.resolve(ListSalesOnDate);
    const findedSales = await listSalesOnDate.execute(userId, searchDate, type);

    return response.json(classToClass(findedSales));
});

export default salesListRoutes;
