import { NextFunction, Request, Response } from 'express';
import AppError from './AppError';

function GlobalErrorHandler(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction,
): Response {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            error: { message: err.message, status: 'error' },
        });
    }

    console.error(err);

    return response.status(500).json({
        error: { message: 'Internal Server Error', status: 'error' },
    });
}

export default GlobalErrorHandler;
