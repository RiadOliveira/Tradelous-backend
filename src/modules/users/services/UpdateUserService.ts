import User from '@shared/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '@shared/providers/HashProvider/IHashProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';

interface UserData {
    name: string;
    email: string;
    avatar?: string;
    oldPassword?: string;
    newPassword?: string;
    userID: string;
}

@injectable()
export default class UpdateUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
        @inject('StorageProvider') private storageProvider: IStorageProvider,
    ) {}

    public async execute({
        name,
        email,
        avatar,
        oldPassword,
        newPassword,
        userID,
    }: UserData): Promise<User> {
        const findedUser = await this.usersRepository.findById(userID);

        if (!findedUser) {
            throw new AppError('Informed user does not exist', 400);
        }

        if (email !== findedUser.email) {
            const verifyEmail = await this.usersRepository.findByEmail(email);

            if (verifyEmail) {
                throw new AppError(
                    'A user with the informed email already exists',
                    400,
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
                    "Informed old password is not equal to user's original password",
                    400,
                );
            }

            const hashedPassword = await this.hashProvider.hash(newPassword);

            findedUser.password = hashedPassword;
        }

        if (findedUser.avatar && avatar) {
            await this.storageProvider.delete(findedUser.avatar, 'avatar');

            await this.storageProvider.save(avatar, 'avatar');

            findedUser.avatar = avatar;
        } else if (avatar) {
            await this.storageProvider.save(avatar, 'avatar');

            findedUser.avatar = avatar;
        }

        findedUser.name = name;

        const newUser = await this.usersRepository.save(findedUser);

        return newUser;
    }
}
