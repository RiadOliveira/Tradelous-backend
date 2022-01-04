import User from '@shared/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '@shared/providers/HashProvider/IHashProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface UserData {
    name: string;
    email: string;
    password: string;
}

@injectable()
export default class CreateUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({ name, password, email }: UserData): Promise<User> {
        const findedUser = await this.usersRepository.findByEmail(email);

        if (findedUser) {
            throw new AppError("User's email already exists.");
        }

        const hashedPassword = await this.hashProvider.hash(password);

        const newUser = await this.usersRepository.create({
            name,
            password: hashedPassword,
            email,
        });

        return newUser;
    }
}
