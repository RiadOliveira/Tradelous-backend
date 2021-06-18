import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

interface UpdateProductData {
    name: string;
    id: string;
    price: number;
    quantity: number;
    brand: string;
    barCode?: string;
}

@injectable()
export default class UpdateProductService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
    ) {}

    public async execute(
        product: UpdateProductData,
        userId: string,
    ): Promise<Product> {
        const verifyProduct = await this.productsRepository.findById(
            product.id,
        );

        if (!verifyProduct) {
            throw new AppError('Product not found.');
        }

        const verifyUser = await this.usersRepository.findById(userId);

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

        const updatedProduct: Product = {
            ...verifyProduct,
            ...product,
        };

        return this.productsRepository.save(updatedProduct);
    }
}
