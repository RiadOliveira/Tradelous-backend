import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class ListProductsFromCompanyService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
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

        const cacheKey = `products-list:${findedUser.companyId}`;

        let findedProducts = await this.cacheProvider.recover<Product[]>(
            cacheKey,
        );

        if (!findedProducts) {
            findedProducts = await this.companiesRepository.findProducts(
                findedUser.companyId,
            );

            if (!findedProducts) {
                throw new AppError('No products found.');
            }

            await this.cacheProvider.save(
                cacheKey,
                JSON.stringify(findedProducts),
            );
        }

        return findedProducts;
    }
}
