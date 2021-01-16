import { Router, Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import CreateSessionService from '../services/CreateSessionService';

const userRoutes = Router();

userRoutes.post('/sessions', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const createSession = new CreateSessionService();

    const loggedUser = await createSession.execute({ email, password });

    const userWithoutPassword = {
        name: loggedUser.name,
        email: loggedUser.email,
        id: loggedUser.id,
        isAdmin: loggedUser.isAdmin,
        createdAt: loggedUser.createdAt,
        companyID: loggedUser.companyID,
        updatedAt: loggedUser.updatedAt,
    };

    return response.json(userWithoutPassword);
});

userRoutes.post('/signUp', async (request: Request, response: Response) => {
    const { name, email, password, isAdmin } = request.body;

    const createUser = new CreateUserService();

    const createdUser = await createUser.execute({
        name,
        email,
        password,
        isAdmin,
    });

    const userWithoutPassword = {
        name: createdUser.name,
        email: createdUser.email,
        id: createdUser.id,
        isAdmin: createdUser.isAdmin,
        createdAt: createdUser.createdAt,
        companyID: createdUser.companyID,
        updatedAt: createdUser.updatedAt,
    };

    return response.json(userWithoutPassword);
});

export default userRoutes;
