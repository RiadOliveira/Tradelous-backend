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
export default class updateProductService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
    ) {}

    public async execute(product: UpdateProductData): Promise<Product> {
        //To finish
        const verifyProduct = await this.productsRepository.findById(
            product.id,
        );

        if (!verifyProduct) {
            throw new AppError('Product not found', 400);
        }

        // type keys = 'name' | 'id' | 'price' | 'brand' | 'qrCode';

        // const productKeys = Object.keys(product) as keys[];
        // const productValues = Object.values(product) as string | number[];

        // productKeys.forEach((key, index) => {
        //     verifyProduct[key] = productValues[index];
        // });

        return verifyProduct;
    }
}
