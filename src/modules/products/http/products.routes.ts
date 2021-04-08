import { Router, Request, Response } from 'express';

const productsRoutes = Router();

productsRoutes.get(
    '/products/:companyId',
    (request: Request, response: Response) => {
        return response.json();
    },
);
