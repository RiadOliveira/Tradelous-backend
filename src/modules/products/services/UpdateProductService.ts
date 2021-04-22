import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

interface UpdateProductData {
    name: string;
    id: string;
    price: number;
    brand: string;
    qrCode?: string;
    image?: string;
}

@injectable()
export default class UpdateProductService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(product: UpdateProductData): Promise<Product> {
        const verifyProduct = await this.productsRepository.findById(
            product.id,
        );

        if (!verifyProduct) {
            throw new AppError('Product not found', 400);
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

        const updatedProduct: Product = {
            ...verifyProduct,
            ...product,
        };

        await this.productsRepository.save(updatedProduct);

        return updatedProduct;
    }
}
