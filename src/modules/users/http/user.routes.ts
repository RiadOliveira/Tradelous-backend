import { Router, Request, Response } from 'express';
import CreateUserService from '../services/createUserService';
import CreateSessionService from '../services/createSessionService';
import UpdateUserService from '../services/updateUserService';

import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';
import multerConfig from '@config/upload';
import multer from 'multer';
import EnsureAuthentication from './middlewares/EnsureAuthentication';

const userRoutes = Router();
const upload = multer(multerConfig);

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

userRoutes.post('/sessions', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const createSession = container.resolve(CreateSessionService);

    const { user, token } = await createSession.execute({
        email,
        password,
    });

    return response.json({ user: classToClass(user), token });
});

userRoutes.put(
    '/update',
    EnsureAuthentication,
    upload.single('avatar'),
    async (request: Request, response: Response) => {
        const { name, email, oldPassword, newPassword } = request.body;

        const userID = request.user.id;

        let avatar;

        if (request.file) {
            avatar = request.file.filename;
        }

        const updateUserService = container.resolve(UpdateUserService);

        const updatedUser = await updateUserService.execute({
            name,
            email,
            avatar,
            oldPassword,
            newPassword,
            userID,
        });

        return response.json(updatedUser);
    },
);

export default userRoutes;
