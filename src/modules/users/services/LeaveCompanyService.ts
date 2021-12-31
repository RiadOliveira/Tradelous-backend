import IUsersRepository from '../repositories/IUsersRepository';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

@injectable()
export default class LeaveCompanyService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute(userId: string): Promise<void> {
        const findedUser = await this.usersRepository.findById(userId);

        if (!findedUser) {
            throw new AppError('Requested user does not exist.');
        }

        if (!findedUser.companyId) {
            throw new AppError(
                'Requested user is not associated to a company.',
            );
        }

        await this.usersRepository.leaveCompany(findedUser.id);

        await this.cacheProvider.invalidate(
            `employees-list:${findedUser.companyId}`,
        );
    }
}
