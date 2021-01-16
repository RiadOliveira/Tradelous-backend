import User from '../database/entities/User';
import AppError from '../http/errors/AppError';
import { sign } from 'jsonwebtoken';
import jwtConfig from '../config/jwtToken';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../database/repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/IHashProvider';

interface UserData {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
export default class CreateSessionService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: UserData): Promise<IResponse> {
        const findedUser = await this.usersRepository.findByEmail(email);

        if (!findedUser) {
            throw new AppError('Incorrect e-mail or password');
        }

        const verifyHash = await this.hashProvider.compareHash(
            password,
            findedUser.password,
        );

        if (!verifyHash) {
            throw new AppError('Incorrect e-mail or password');
        }

        const token = sign({ name: findedUser.name }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn,
            subject: findedUser.id,
        });

        return { user: findedUser, token };
    }
}
