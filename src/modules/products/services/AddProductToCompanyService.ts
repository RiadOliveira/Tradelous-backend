import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

interface ProductData {
    name: string;
    price: number;
    quantity: number;
    brand: string;
    barCode?: string;
    image?: string;
}

@injectable()
export default class AddProductToCompanyService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(
        product: ProductData,
        userId: string,
    ): Promise<Product> {
        const verifyUser = await this.usersRepository.findById(userId);

        if (!verifyUser) {
            throw new AppError('User not found.');
        }

        if (!verifyUser.companyId) {
            throw new AppError('The user is not associated to a company.');
        }

        if (product.image) {
            await this.storageProvider.save(product.image, 'productImage');
        }

        if (!product.quantity) {
            product.quantity = 0;
        }

        return this.productsRepository.create({
            ...product,
            companyId: verifyUser.companyId,
        });
    }
}
