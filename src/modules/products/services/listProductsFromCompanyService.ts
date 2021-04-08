import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import Product from '@shared/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class listProductsFromCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
    ) {}

    public async execute(companyId: string): Promise<Product[]> {
        const findedCompany = await this.companiesRepository.findById(
            companyId,
        );

        if (!findedCompany) {
            throw new AppError('Company not found', 400);
        }

        return findedCompany.products;
    }
}
