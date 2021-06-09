import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class ListProductsFromCompanyService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
    ) {}

    public async execute(userId: string): Promise<Product[]> {
        const findedUser = await this.usersRepository.findById(userId);

        if (!findedUser) {
            throw new AppError('User not found.');
        }

        if (!findedUser.companyId) {
            throw new AppError(
                'The requested user is not associated to a company.',
            );
        }

        const findedCompany = await this.companiesRepository.findById(
            findedUser.companyId,
        );

        if (!findedCompany) {
            throw new AppError('Company not found.');
        }

        return findedCompany.products;
    }
}
