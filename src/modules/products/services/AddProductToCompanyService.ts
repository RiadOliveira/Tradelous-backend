import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

interface ProductData {
    name: string;
    companyId: string;
    price: number;
    brand: string;
    qrCode?: string;
    image?: string;
}

@injectable()
export default class AddProductToCompanyService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(
        product: ProductData,
        userId: string,
    ): Promise<Product> {
        const findedCompany = await this.companiesRepository.findById(
            product.companyId,
        );
        const verifyUser = await this.usersRepository.findById(userId);

        if (!findedCompany) {
            throw new AppError('Company not found', 400);
        }

        if (!verifyUser) {
            throw new AppError('User not found');
        }

        if (verifyUser.companyId !== product.companyId) {
            throw new AppError(
                'The user does not have permission to execute this action',
                401,
            );
        }

        if (product.image) {
            await this.storageProvider.save(product.image, 'productImage');
        }

        return this.productsRepository.create(product);
    }
}
