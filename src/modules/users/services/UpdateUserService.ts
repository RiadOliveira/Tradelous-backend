import User from '@shared/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '@shared/providers/HashProvider/IHashProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface UserData {
    name: string;
    email: string;
    oldPassword?: string;
    newPassword?: string;
    userId: string;
}

@injectable()
export default class UpdateUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({
        name,
        email,
        oldPassword,
        newPassword,
        userId,
    }: UserData): Promise<User> {
        const findedUser = await this.usersRepository.findById(userId);

        if (!findedUser) {
            throw new AppError('Requested user does not exist.');
        }

        if (email !== findedUser.email) {
            const verifyEmail = await this.usersRepository.findByEmail(email);

            if (verifyEmail) {
                throw new AppError(
                    'A user with the informed email already exists.',
                );
            }
            findedUser.email = email;
        }

        if (oldPassword && newPassword) {
            const verifyPassword = await this.hashProvider.compareHash(
                oldPassword,
                findedUser.password,
            );

            if (!verifyPassword) {
                throw new AppError(
                    "Informed old password is not equal to user's original password.",
                );
            }

            const hashedPassword = await this.hashProvider.hash(newPassword);

            findedUser.password = hashedPassword;
        }

        findedUser.name = name;

        return this.usersRepository.save(findedUser);
    }
}
