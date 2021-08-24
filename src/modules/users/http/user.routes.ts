import { Router, Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import CreateSessionService from '../services/CreateSessionService';
import UpdateUserService from '../services/UpdateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import LeaveCompanyService from '../services/LeaveCompanyService';

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

    return response.status(201).json(classToClass(createdUser));
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
    '/',
    EnsureAuthentication,
    async (request: Request, response: Response) => {
        const { name, email, oldPassword, newPassword } = request.body;

        const userId = request.user.id;

        const updateUser = container.resolve(UpdateUserService);

        const updatedUser = await updateUser.execute({
            name,
            email,
            oldPassword,
            newPassword,
            userId,
        });

        return response.status(202).json(classToClass(updatedUser));
    },
);

userRoutes.patch(
    '/update-avatar',
    EnsureAuthentication,
    upload.single('avatar'),
    async (request: Request, response: Response) => {
        const userId = request.user.id;

        const avatar = request.file ? request.file.filename : '';

        const updateUserAvatar = container.resolve(UpdateUserAvatarService);

        const updatedUser = await updateUserAvatar.execute({
            userId,
            avatar,
        });

        return response.status(202).json(classToClass(updatedUser));
    },
);

userRoutes.patch(
    '/leave-company',
    EnsureAuthentication,
    async (request: Request, response: Response) => {
        const userId = request.user.id;

        const leaveCompany = container.resolve(LeaveCompanyService);

        const updatedUser = await leaveCompany.execute(userId);

        return response.status(202).json(classToClass(updatedUser));
    },
);

export default userRoutes;
