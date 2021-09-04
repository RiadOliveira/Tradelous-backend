import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/IMailProvider';
import IHashProvider from '@shared/providers/HashProvider/IHashProvider';

import path from 'path';

import { injectable, inject } from 'tsyringe';

@injectable()
export default class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('MailProvider') private mailProvider: IMailProvider,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute(email: string): Promise<void> {
        const findedUser = await this.usersRepository.findByEmail(email);

        if (!findedUser) {
            throw new AppError('User not found.');
        }

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.njk',
        );

        const token = await this.hashProvider.hash(
            findedUser.id + findedUser.updatedAt,
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
