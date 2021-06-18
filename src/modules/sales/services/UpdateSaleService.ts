import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Sale from '@shared/typeorm/entities/Sale';
import { inject, injectable } from 'tsyringe';
import ISalesRepository from '../repositories/ISalesRepository';

interface UpdateSale {
    id: string;
    employeeId: string;
    productId: string;
    type: string;
    quantity: number;
}

@injectable()
export default class UpdateSaleService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('SalesRepository')
        private salesRepository: ISalesRepository,
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

        const productPrice = verifySale.totalPrice / verifySale.quantity;

        const updatedSale = new Sale();

        Object.assign(updatedSale, {
            ...verifySale,
            ...sale,
            totalPrice: sale.quantity * productPrice,
        });

        return this.salesRepository.save(updatedSale);
    }
}
