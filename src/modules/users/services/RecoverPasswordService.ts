import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import jwtConfig from '@config/jwtToken';

import { verify } from 'jsonwebtoken';

import { injectable, inject } from 'tsyringe';
import IHashProvider from '@shared/providers/HashProvider/IHashProvider';

interface IJWT {
    iat: string;
    exp: string;
    sub: string;
}

interface IRecoverPasswordData {
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
        recoverToken,
        newPassword,
    }: IRecoverPasswordData): Promise<void> {
        try {
            const decoded = verify(recoverToken, jwtConfig.secret) as IJWT;

            const findedUser = await this.usersRepository.findById(decoded.sub);

            if (!findedUser) {
                throw new AppError('Requested user does not exist.');
            }

            const hashedPassword = await this.hashProvider.hash(newPassword);

            findedUser.password = hashedPassword;

            await this.usersRepository.save(findedUser);
        } catch {
            throw new AppError('Invalid Recover Token.', 401);
        }
    }
}
