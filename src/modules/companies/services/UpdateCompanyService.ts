import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Company from '@shared/typeorm/entities/Company';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface CompanyData {
    name: string;
    cnpj: number;
    adress: string;
    adminId: string;
    logo?: string;
}

@injectable()
export default class UpdateCompanyService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(
        company: CompanyData,
        adminId: string,
    ): Promise<Company> {
        const findedAdmin = await this.usersRepository.findById(adminId);

        if (!findedAdmin) {
            throw new AppError('Admin not found.');
        }

        if (!findedAdmin.companyId) {
            throw new AppError(
                'The requested admin is not associated to a company.',
            );
        }

        if (!findedAdmin.isAdmin) {
            throw new AppError(
                'The user does not have permission for this action.',
                401,
            );
        }

        const findedCompany = await this.companiesRepository.findById(
            findedAdmin.companyId,
        );

        if (!findedCompany) {
            throw new AppError('Company not found.');
        }

        const verifyCnpj = await this.companiesRepository.findByCnpj(
            company.cnpj,
        );

        if (verifyCnpj && verifyCnpj.id !== findedCompany.id) {
            throw new AppError(
                'A company with the informed cnpj already exists.',
            );
        }

        if (findedCompany.logo && company.logo) {
            await this.storageProvider.delete(findedCompany.logo, 'logo');

            await this.storageProvider.save(company.logo, 'logo');
        } else if (company.logo) {
            await this.storageProvider.save(company.logo, 'logo');
        }

        if (findedCompany.logo && !company.logo) {
            //If not receive the logo name, indicates that the company's logo was removed by the user.
            await this.storageProvider.delete(findedCompany.logo, 'logo');

            await this.companiesRepository.removeCompanyLogo(findedCompany.id);
        }

        const updatedCompany = { ...findedCompany, ...company };

        return this.companiesRepository.save(updatedCompany);
    }
}
