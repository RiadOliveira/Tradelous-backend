import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
export default class DeleteUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('StorageProvider') private storageProvider: IStorageProvider,
    ) {}

    public async execute(userId: string): Promise<void> {
        const findedUser = await this.usersRepository.findById(userId);

        if (!findedUser) {
            throw new AppError('Requested user does not exist.');
        }

        if (findedUser.avatar) {
            await this.storageProvider.delete(findedUser?.avatar, 'avatar');
        }

        await this.usersRepository.delete(userId);
    }
}
