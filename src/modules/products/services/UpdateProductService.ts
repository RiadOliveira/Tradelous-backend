import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';
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
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute(
        product: UpdateProductData,
        userId: string,
    ): Promise<Product> {
        const verifyProduct = await this.productsRepository.findById(
            product.id,
        );
        if (!verifyProduct) throw new AppError('Product not found.');

        const verifyUser = await this.usersRepository.findById(userId);
        if (!verifyUser) throw new AppError('User not found.');

        if (verifyUser.companyId !== verifyProduct.companyId) {
            throw new AppError(
                'The user does not have permission to execute this action.',
                401,
            );
        }

        if (product.barCode && product.barCode !== verifyProduct.barCode) {
            const verifyProduct = await this.productsRepository.findByBarCode(
                verifyUser.companyId,
                product.barCode,
            );

            if (verifyProduct) {
                throw new AppError(
                    'A product with this barcode already exists.',
                );
            }
        }

        if (verifyProduct.barCode && !product.barCode)
            await this.productsRepository.deleteBarCode(verifyProduct.id);
        else {
            await this.productsRepository.save({
                ...verifyProduct,
                ...product,
            });
        }

        await this.cacheProvider.invalidate(
            `products-list:${verifyUser.companyId}`,
        );

        return { ...verifyProduct, ...product };
    }
}
