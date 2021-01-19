import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import jwtConfig from '@config/jwtToken';

interface IJWT {
    iat: string;
    exp: string;
    sub: string;
}

function EnsureAuthentication(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
        throw new AppError('Invalid JWT token');
    }

    const [, token] = bearerToken.split(' ');

    try {
        const decoded = verify(token, jwtConfig.secret) as IJWT;

        request.user = {
            id: decoded.sub,
        };

        next();
    } catch {
        throw new AppError('Invalid JWT token');
    }
}

export default EnsureAuthentication;
