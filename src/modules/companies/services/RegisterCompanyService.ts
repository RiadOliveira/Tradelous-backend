import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Company from '@shared/typeorm/entities/Company';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';

interface CompanyData {
    name: string;
    cnpj: number;
    adress: string;
    adminId: string;
    logo?: string;
}

@injectable()
export default class RegisterCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider') private storageProvider: IStorageProvider,
    ) {}

    public async execute(company: CompanyData): Promise<Company> {
        const findedCompany = await this.companiesRepository.findByCnpj(
            company.cnpj,
        );
        const findedUser = await this.usersRepository.findById(company.adminId);

        if (findedCompany) {
            throw new AppError("Company's cnpj already exists.");
        }

        if (!findedUser) {
            throw new AppError('User not found.');
        }

        if (findedUser.companyId) {
            throw new AppError(
                'The requested user already is associated to a company.',
            );
        }

        if (company.logo) {
            await this.storageProvider.save(company.logo, 'logo');
        }

        const newCompany = await this.companiesRepository.create(company);

        findedUser.companyId = newCompany.id;

        await this.usersRepository.save(findedUser);

        return newCompany;
    }
}
