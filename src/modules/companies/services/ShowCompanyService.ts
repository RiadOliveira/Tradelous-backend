import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Company from '@shared/typeorm/entities/Company';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';

@injectable()
export default class ShowCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute(userId: string): Promise<Company> {
        const findedUser = await this.usersRepository.findById(userId);

        if (!findedUser) {
            throw new AppError('User not found.');
        }

        if (!findedUser.companyId) {
            throw new AppError(
                'The requested user is not associated to a company.',
            );
        }

        const cacheKey = `company:${findedUser.companyId}`;

        let findedCompany = await this.cacheProvider.recover<Company>(cacheKey);

        if (!findedCompany) {
            findedCompany = await this.companiesRepository.findById(
                findedUser.companyId,
            );

            if (!findedCompany) {
                throw new AppError('Company not found.');
            }

            await this.cacheProvider.save(
                cacheKey,
                JSON.stringify(findedCompany),
            );
        }

        return findedCompany;
    }
}
