import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

@injectable()
export default class DeleteProductToCompanyService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(productId: string, userId: string): Promise<void> {
        const verifyProduct = await this.productsRepository.findById(productId);
        const verifyUser = await this.usersRepository.findById(userId);

        if (!verifyProduct) {
            throw new AppError('Product not found.');
        }

        if (!verifyUser) {
            throw new AppError('User not found.');
        }

        if (verifyUser.companyId !== verifyProduct.companyId) {
            throw new AppError(
                'The user does not have permission to execute this action.',
                401,
            );
        }

        if (verifyProduct.image) {
            await this.storageProvider.delete(
                verifyProduct.image,
                'productImage',
            );
        }

        await this.productsRepository.removeProduct(productId);
    }
}
