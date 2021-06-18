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
    type: string;
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

        if (verifyCompany.id !== verifyEmployee.companyId) {
            throw new AppError(
                'The user does not have permission for this action.',
                401,
            );
        }

        const verifyProduct = await this.productsRepository.findById(
            sale.productId,
        );

        if (!verifyProduct) {
            throw new AppError('Product not found.');
        }

        const verifyProductOnCompany = await this.companiesRepository.findProducts(
            verifyCompany.id,
        );

        if (!verifyProductOnCompany) {
            throw new AppError('Requested company has no products.');
        }

        if (
            !verifyProductOnCompany.find(
                product => product.id === verifyProduct.id,
            )
        ) {
            throw new AppError(
                'Requested company does not have the requested product.',
            );
        }

        return this.salesRepository.create({
            ...sale,
            companyId: verifyCompany.id,
            totalPrice: verifyProduct.price * sale.quantity,
        });
    }
}
