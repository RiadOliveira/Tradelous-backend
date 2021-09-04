import ICompaniesRepository from '../repositories/ICompaniesRepository';
import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';

@injectable()
export default class ListEmployeesFromCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute(userId: string): Promise<User[]> {
        const findedUser = await this.usersRepository.findById(userId);

        if (!findedUser) {
            throw new AppError('User not found.');
        }

        if (!findedUser.companyId) {
            throw new AppError(
                'The requested user is not associated to any company.',
            );
        }

        const cacheKey = `employees-list:${findedUser.companyId}`;

        let findedEmployees = await this.cacheProvider.recover<User[]>(
            cacheKey,
        );

        if (!findedEmployees) {
            findedEmployees = await this.companiesRepository.findEmployees(
                findedUser.companyId,
            );

            if (!findedEmployees) {
                throw new AppError('This company has no employees.');
            }

            await this.cacheProvider.save(
                `employees-list:${findedUser.companyId}`,
                JSON.stringify(findedEmployees),
            );
        }

        return findedEmployees;
    }
}
