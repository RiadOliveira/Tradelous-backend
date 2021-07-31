import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Sale from '@shared/typeorm/entities/Sale';
import { inject, injectable } from 'tsyringe';
import ISalesRepository from '../repositories/ISalesRepository';

interface CreateSale {
    employeeId: string;
    productId: string;
    method: 'money' | 'card';
    quantity: number;
}

@injectable()
export default class CreateSaleService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('SalesRepository')
        private salesRepository: ISalesRepository,
    ) {}

    public async execute(sale: CreateSale): Promise<Sale> {
        const verifyEmployee = await this.usersRepository.findById(
            sale.employeeId,
        );

        if (!verifyEmployee) {
            throw new AppError('Employee not found.');
        }

        if (!verifyEmployee.companyId) {
            throw new AppError(
                'The requested user is not associated to a company.',
            );
        }

        const verifyCompany = await this.companiesRepository.findById(
            verifyEmployee.companyId,
        );

        if (!verifyCompany) {
            throw new AppError('Company not found.');
        }

        const verifyProduct = await this.productsRepository.findById(
            sale.productId,
        );

        if (!verifyProduct) {
            throw new AppError('Product not found.');
        }

        if (verifyProduct.companyId != verifyCompany.id) {
            throw new AppError(
                'The company does not have this product registered.',
            );
        }

        if (sale.quantity > verifyProduct.quantity) {
            throw new AppError(
                'Requested quantity is more than available on stock.',
            );
        }

        if (sale.method != 'card' && sale.method != 'money') {
            throw new AppError('Invalid sale method.');
        }

        const newSale = await this.salesRepository.create({
            ...sale,
            companyId: verifyCompany.id,
            totalPrice: verifyProduct.price * sale.quantity,
        });

        await this.productsRepository.save({
            ...verifyProduct,
            quantity: verifyProduct.quantity - sale.quantity,
        });

        return newSale;
    }
}
