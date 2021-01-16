import User from '../database/entities/User';
import IUsersRepository from '../database/repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/IHashProvider';
import AppError from '../http/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface UserData {
    name: string;
    password: string;
    email: string;
    isAdmin: boolean;
}

@injectable()
export default class CreateUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({
        name,
        password,
        email,
        isAdmin,
    }: UserData): Promise<User> {
        const findedUser = await this.usersRepository.findByEmail(email);

        if (findedUser) {
            throw new AppError("User's email already exists");
        }

        console.log('TESTE');

        const hashedPassword = await this.hashProvider.hash(password);

        const newUser = await this.usersRepository.create({
            name,
            password: hashedPassword,
            isAdmin,
            email,
        });

        return newUser;
    }
}
