import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import Product from '@shared/typeorm/entities/Product';
import { inject } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

export default class addProductToCompanyService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
    ) {}

    public async execute(
        product: Product,
        companyId: string,
    ): Promise<Product> {
        const findedCompany = await this.companiesRepository.findById(
            companyId,
        );
        const verifyProduct = await this.productsRepository.findById(
            product.id,
        );

        if (!findedCompany) {
            throw new AppError('Company not found', 400);
        }

        if (verifyProduct) {
            throw new AppError('The informed product already exists');
        }

        return this.productsRepository.save({ ...product, companyId });
    }
}
