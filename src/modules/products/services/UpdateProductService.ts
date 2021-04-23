import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

interface UpdateProductData {
    name: string;
    id: string;
    price: number;
    quantity: number;
    brand: string;
    qrCode?: string;
    image?: string;
}

@injectable()
export default class UpdateProductService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(
        product: UpdateProductData,
        userId: string,
    ): Promise<Product> {
        const verifyProduct = await this.productsRepository.findById(
            product.id,
        );
        const verifyUser = await this.usersRepository.findById(userId);

        if (!verifyProduct) {
            throw new AppError('Product not found.');
        }

        if (!verifyUser) {
            throw new AppError('User not found.');
        }

        if (!verifyUser.companyId) {
            throw new AppError('The user is not associated to a company.');
        }

        if (verifyUser.companyId !== verifyProduct.companyId) {
            throw new AppError(
                'The user does not have permission to execute this action.',
                401,
            );
        }

        if (verifyProduct.image && product.image) {
            await this.storageProvider.delete(
                verifyProduct.image,
                'productImage',
            );

            await this.storageProvider.save(product.image, 'productImage');
        } else if (product.image) {
            await this.storageProvider.save(product.image, 'productImage');
        }

        if (verifyProduct.image && !product.image) {
            //If not receive the image name, indicates that the product's image was removed by the user.
            await this.storageProvider.delete(
                verifyProduct.image,
                'productImage',
            );

            await this.productsRepository.removeImageFromProduct(
                verifyProduct.id,
            );
        }

        const updatedProduct: Product = {
            ...verifyProduct,
            ...product,
        };

        return this.productsRepository.save(updatedProduct);
    }
}
