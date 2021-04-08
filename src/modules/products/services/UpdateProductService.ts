import AppError from '@shared/errors/AppError';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

interface UpdateProductData {
    name: string;
    id: string;
    price: number;
    brand: string;
    qrCode?: string;
}

@injectable()
export default class UpdateProductService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
    ) {}

    public async execute(product: UpdateProductData): Promise<Product> {
        const verifyProduct = await this.productsRepository.findById(
            product.id,
        );

        if (!verifyProduct) {
            throw new AppError('Product not found', 400);
        }

        const updatedProduct: Product = {
            ...verifyProduct,
            ...product,
        };

        await this.productsRepository.save(updatedProduct);

        return updatedProduct;
    }
}
