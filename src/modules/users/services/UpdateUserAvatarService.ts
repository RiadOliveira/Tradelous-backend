import User from '@shared/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';

interface UserData {
    avatar: string;
    userId: string;
}

@injectable()
export default class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('StorageProvider') private storageProvider: IStorageProvider,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute(userData: UserData): Promise<User> {
        const findedUser = await this.usersRepository.findById(userData.userId);

        if (!findedUser) {
            throw new AppError('Informed user does not exist.');
        }

        if (findedUser.avatar && !userData.avatar) {
            //If not receive the avatar name, indicates that the user's avatar was removed.
            await this.storageProvider.delete(findedUser.avatar, 'avatar');

            await this.usersRepository.deleteAvatar(findedUser.id);

            findedUser.avatar = undefined;

            return findedUser;
        }

        if (findedUser.avatar) {
            await this.storageProvider.delete(findedUser.avatar, 'avatar');
        }

        await this.storageProvider.save(userData.avatar, 'avatar');

        findedUser.avatar = userData.avatar;

        const updatedUser = this.usersRepository.save(findedUser);

        if (findedUser.companyId) {
            await this.cacheProvider.invalidate(
                `employees-list:${findedUser.companyId}`,
            );
        }

        return updatedUser;
    }
}
