import { Router, Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import CreateSessionService from '../services/CreateSessionService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

const userRoutes = Router();

userRoutes.post('/sessions', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const createSession = container.resolve(CreateSessionService);

    const { user, token } = await createSession.execute({
        email,
        password,
    });

    return response.json({ user: classToClass(user), token });
});

userRoutes.post('/signUp', async (request: Request, response: Response) => {
    const { name, email, password, isAdmin } = request.body;

    const createUser = container.resolve(CreateUserService);

    const createdUser = await createUser.execute({
        name,
        email,
        password,
        isAdmin,
    });

    return response.json(createdUser);
});

export default userRoutes;
