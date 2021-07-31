import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Sale from '@shared/typeorm/entities/Sale';
import { inject, injectable } from 'tsyringe';
import ISalesRepository from '../repositories/ISalesRepository';

interface UpdateSale {
    id: string;
    employeeId: string;
    productId: string;
    method: 'money' | 'card';
    quantity: number;
}

@injectable()
export default class UpdateSaleService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('SalesRepository')
        private salesRepository: ISalesRepository,
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
    ) {}

    public async execute(sale: UpdateSale, userId: string): Promise<Sale> {
        const verifySale = await this.salesRepository.findById(sale.id);

        if (!verifySale) {
            throw new AppError('Sale not found.');
        }

        const verifyUser = await this.usersRepository.findById(userId);

        if (!verifyUser) {
            throw new AppError('User not found.');
        }

        if (!verifyUser.companyId) {
            throw new AppError('The user is not associated to a company.');
        }

        if (verifyUser.companyId !== verifySale.companyId) {
            throw new AppError(
                'The user does not have permission to execute this action.',
                401,
            );
        }

        if (verifyUser.id !== sale.employeeId && !verifyUser.isAdmin) {
            throw new AppError(
                'The user does not have permission to execute this action.',
                401,
            );
        }

        const verifyProduct = await this.productsRepository.findById(
            verifySale.id,
        );

        if (!verifyProduct) {
            throw new AppError('Product not found.');
        }

        if (
            sale.quantity > verifySale.quantity &&
            verifyProduct.quantity + verifySale.quantity - sale.quantity < 0
        ) {
            throw new AppError(
                'Requested sale has a quantity bigger than available on stock.',
            );
        }

        if (sale.method != 'card' && sale.method != 'money') {
            throw new AppError('Invalid sale method.');
        }

        const productPrice = verifySale.totalPrice / verifySale.quantity;

        const updatedSale: Sale = await this.salesRepository.save({
            ...verifySale,
            ...sale,
            totalPrice: sale.quantity * productPrice,
        });

        if (sale.quantity > verifySale.quantity) {
            await this.productsRepository.save({
                ...verifyProduct,
                quantity:
                    verifyProduct.quantity -
                    (sale.quantity - verifySale.quantity),
            });
        } else if (sale.quantity < verifySale.quantity) {
            await this.productsRepository.save({
                ...verifyProduct,
                quantity:
                    verifyProduct.quantity +
                    (verifySale.quantity - sale.quantity),
            });
        }

        return updatedSale;
    }
}
