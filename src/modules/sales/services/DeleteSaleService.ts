import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';
import { inject, injectable } from 'tsyringe';
import ISalesRepository from '../repositories/ISalesRepository';

@injectable()
export default class DeleteSaleService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('SalesRepository')
        private salesRepository: ISalesRepository,
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute(saleId: string, userId: string): Promise<void> {
        const verifySale = await this.salesRepository.findById(saleId);
        if (!verifySale) throw new AppError('Sale not found.');

        const verifyUser = await this.usersRepository.findById(userId);
        if (!verifyUser) throw new AppError('User not found.');

        if (!verifyUser.isAdmin) {
            throw new AppError(
                'The user does not have permission to execute this action.',
                401,
            );
        }

        if (verifyUser.companyId !== verifySale.companyId) {
            throw new AppError(
                'The user does not have permission to execute this action.',
                401,
            );
        }

        const productOfSale = await this.productsRepository.findById(
            verifySale.productId,
        );

        //Just for typescript.
        if (!productOfSale) throw new AppError('Product of sale not found.');

        await this.salesRepository.delete(saleId);

        await this.productsRepository.save({
            ...productOfSale,
            quantity: productOfSale?.quantity + verifySale.quantity,
        });

        await this.cacheProvider.invalidate(
            `products-list:${verifyUser.companyId}`,
        );
    }
}
