import CreateUserService from '../services/CreateUserService';
import CreateSessionService from '../services/CreateSessionService';
import UpdateUserService from '../services/UpdateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import LeaveCompanyService from '../services/LeaveCompanyService';
import DeleteUserService from '../services/DeleteUserService';
import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';
import RecoverPasswordService from '../services/RecoverPasswordService';

import multerConfig from '@config/upload';
import multer from 'multer';
import EnsureAuthentication from './middlewares/EnsureAuthentication';

import { Router, Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

const userRoutes = Router();
const upload = multer(multerConfig);

userRoutes.post(
    '/sign-up',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required().valid(Joi.ref('password')),
        },
    }),
    async (request: Request, response: Response) => {
        const { name, email, password } = request.body;

        const createUser = container.resolve(CreateUserService);
        const createdUser = await createUser.execute({
            name,
            email,
            password,
        });

        return response.status(201).json(classToClass(createdUser));
    },
);

userRoutes.post(
    '/sessions',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { email, password } = request.body;

        const createSession = container.resolve(CreateSessionService);
        const { user, token } = await createSession.execute({
            email,
            password,
        });

        return response.json({ user: classToClass(user), token });
    },
);

userRoutes.post(
    '/forgot-password',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { email } = request.body;

        const sendForgotPasswordEmail = container.resolve(
            SendForgotPasswordEmailService,
        );
        await sendForgotPasswordEmail.execute(email);

        return response.status(204).json();
    },
);

userRoutes.post(
    '/recover-password',
    celebrate({
        [Segments.BODY]: {
            confirmEmail: Joi.string().email().required(),
            recoverToken: Joi.string().required(),
            newPassword: Joi.string().required(),
            confirmPassword: Joi.string()
                .required()
                .valid(Joi.ref('newPassword')),
        },
    }),
    async (request: Request, response: Response) => {
        const { confirmEmail, recoverToken, newPassword } = request.body;

        const recoverPassword = container.resolve(RecoverPasswordService);
        await recoverPassword.execute({
            confirmEmail,
            recoverToken,
            newPassword,
        });

        return response.status(204).json();
    },
);

userRoutes.put(
    '/',
    EnsureAuthentication,
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            oldPassword: Joi.string().optional(),
            newPassword: Joi.string().optional(),
            confirmPassword: Joi.string()
                .when('newPassword', {
                    is: Joi.exist(),
                    then: Joi.required(),
                    otherwise: Joi.optional(),
                })
                .valid(Joi.ref('newPassword')),
        },
    }),
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
        await leaveCompany.execute(userId);

        return response.status(204).json();
    },
);

userRoutes.delete(
    '/',
    EnsureAuthentication,
    async (request: Request, response: Response) => {
        const userId = request.user.id;

        const deleteUser = container.resolve(DeleteUserService);
        await deleteUser.execute(userId);

        return response.status(204).json();
    },
);

export default userRoutes;
