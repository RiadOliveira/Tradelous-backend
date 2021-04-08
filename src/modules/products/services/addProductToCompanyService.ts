import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

interface ProductData {
    name: string;
    companyId: string;
    price: number;
    brand: string;
    qrCode?: string;
}

@injectable()
export default class addProductToCompanyService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
    ) {}

    public async execute(product: ProductData): Promise<Product> {
        const findedCompany = await this.companiesRepository.findById(
            product.companyId,
        );

        if (!findedCompany) {
            throw new AppError('Company not found', 400);
        }

        return this.productsRepository.create(product);
    }
}
