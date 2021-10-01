import DiskProvider from '@shared/providers/StorageProvider/implementations/DiskProvider';
import AppError from './AppError';
import { CelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

function GlobalErrorHandler(
    err: Error,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): Response {
    if (request.file) {
        const diskProvider = new DiskProvider();

        setTimeout(async () => {
            await diskProvider.deleteFileFromTemp(request.file.filename);
        }, 5000);
    }

    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            error: { message: err.message, status: 'error' },
        });
    }

    if (err instanceof CelebrateError) {
        return response.status(400).json({
            error: { message: err.message, status: 'error' },
        });
    }

    console.error(err);

    return response.status(500).json({
        error: { message: 'Internal Server Error.', status: 'error' },
    });
}

export default GlobalErrorHandler;
