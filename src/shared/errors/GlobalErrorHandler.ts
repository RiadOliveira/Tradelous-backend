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

    const error = {
        error: { message: err.message, status: 'error' },
    };

    if (err instanceof AppError || err instanceof CelebrateError) {
        const status = (err as AppError).statusCode || 400;
        return response.status(status).json(error);
    }

    error.error.message = 'Internal Server Error.';
    return response.status(500).json(error);
}

export default GlobalErrorHandler;
