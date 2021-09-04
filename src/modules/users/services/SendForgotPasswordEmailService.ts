import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/IMailProvider';

import path from 'path';
import jwtConfig from '@config/jwtToken';
import { sign } from 'jsonwebtoken';

import { injectable, inject } from 'tsyringe';

@injectable()
export default class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('MailProvider') private mailProvider: IMailProvider,
    ) {}

    public async execute(email: string): Promise<void> {
        const findedUser = await this.usersRepository.findByEmail(email);

        if (!findedUser) {
            throw new AppError('User not found.');
        }

        const token = sign({ email: findedUser.email }, jwtConfig.secret, {
            expiresIn: '1200s',
            subject: findedUser.id,
        });

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: findedUser.name,
                email,
            },
            subject: '[Tradelous] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: findedUser.name,
                    token,
                },
            },
        });
    }
}
