import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/IMailProvider';

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

        await this.mailProvider.sendMail({
            to: {
                name: findedUser?.name,
                email,
            },
            subject: '[Tradelous] Recuperação de senha',
            text: 'ID para recuperar senha',
        });
    }
}
