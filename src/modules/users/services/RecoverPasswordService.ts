import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

import { injectable, inject } from 'tsyringe';
import IHashProvider from '@shared/providers/HashProvider/IHashProvider';

interface IRecoverPasswordData {
    confirmEmail: string;
    recoverToken: string;
    newPassword: string;
}

@injectable()
export default class RecoverPasswordService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({
        confirmEmail,
        recoverToken,
        newPassword,
    }: IRecoverPasswordData): Promise<void> {
        const findedUser = await this.usersRepository.findByEmail(confirmEmail);

        if (!findedUser) {
            throw new AppError('Requested user does not exist.');
        }

        const verifyToken = await this.hashProvider.compareHash(
            findedUser.id + findedUser.updatedAt,
            recoverToken,
        );

        if (!verifyToken) {
            throw new AppError('Invalid Recover Token.', 401);
        }

        const hashedPassword = await this.hashProvider.hash(newPassword);

        findedUser.password = hashedPassword;

        await this.usersRepository.save(findedUser);
    }
}
