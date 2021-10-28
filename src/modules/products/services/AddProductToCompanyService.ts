import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import Product from '@shared/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';
import { inject, injectable } from 'tsyringe';

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
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
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
            await this.storageProvider.save(product.image, 'product-image');
        }

        if (!product.quantity) {
            product.quantity = 0;
        }

        const newProduct = await this.productsRepository.create({
            ...product,
            companyId: verifyUser.companyId,
        });

        await this.cacheProvider.invalidate(
            `products-list:${verifyUser.companyId}`,
        );

        return newProduct;
    }
}
