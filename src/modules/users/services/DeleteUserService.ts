import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';

@injectable()
export default class DeleteUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('StorageProvider') private storageProvider: IStorageProvider,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute(userId: string): Promise<void> {
        const findedUser = await this.usersRepository.findById(userId);

        if (!findedUser) {
            throw new AppError('Requested user does not exist.');
        }

        if (findedUser.avatar) {
            await this.storageProvider.delete(findedUser?.avatar, 'avatar');
        }

        if (findedUser.companyId) {
            await this.cacheProvider.invalidate(
                `employees-list:${findedUser.companyId}`,
            );
        }

        await this.usersRepository.delete(userId);
    }
}
