import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Company from '@shared/typeorm/entities/Company';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';

interface CompanyData {
    id: string;
    name: string;
    cnpj: number;
    adress: string;
    adminId: string;
    logo?: string;
}

@injectable()
export default class UpdateCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(
        company: CompanyData,
        userId: string,
    ): Promise<Company> {
        const verifyCompany = await this.companiesRepository.findById(
            company.id,
        );

        if (!verifyCompany) {
            throw new AppError('Company not found.');
        }

        const verifyCnpj = await this.companiesRepository.findByCnpj(
            company.cnpj,
        );

        if (verifyCnpj && verifyCnpj.id !== company.id) {
            throw new AppError(
                'A company with the informed cnpj already exists.',
            );
        }

        if (
            company.adminId !== verifyCompany.adminId &&
            userId !== company.adminId
        ) {
            throw new AppError(
                'The user does not have permission to execute this action.',
                401,
            );
        }

        if (verifyCompany.logo && company.logo) {
            await this.storageProvider.delete(verifyCompany.logo, 'logo');

            await this.storageProvider.save(company.logo, 'logo');
        } else if (company.logo) {
            await this.storageProvider.save(company.logo, 'logo');
        }

        if (verifyCompany.logo && !company.logo) {
            //If not receive the logo name, indicates that the company's logo was removed by the user.
            await this.storageProvider.delete(verifyCompany.logo, 'logo');

            await this.companiesRepository.removeCompanyLogo(verifyCompany.id);
        }

        const updatedCompany = { ...verifyCompany, ...company };

        return this.companiesRepository.save(updatedCompany);
    }
}
