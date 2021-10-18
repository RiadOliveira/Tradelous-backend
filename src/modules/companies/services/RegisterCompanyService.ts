import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import Company from '@shared/typeorm/entities/Company';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

interface CompanyData {
    name: string;
    cnpj: number;
    address: string;
    adminId: string;
}

@injectable()
export default class RegisterCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute(company: CompanyData): Promise<Company> {
        const findedCompany = await this.companiesRepository.findByCnpj(
            company.cnpj,
        );

        if (findedCompany) {
            throw new AppError("Company's cnpj already exists.");
        }

        const findedUser = await this.usersRepository.findById(company.adminId);

        if (!findedUser) {
            throw new AppError('User not found.');
        }

        if (findedUser.companyId) {
            throw new AppError(
                'The requested user already is associated to a company.',
            );
        }

        const newCompany = await this.companiesRepository.create(company);

        findedUser.companyId = newCompany.id;
        findedUser.isAdmin = true;

        await this.usersRepository.save(findedUser);

        return newCompany;
    }
}
