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
export default class UpdateCompanyService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
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

        const updatedCompany = { ...findedCompany, ...company };

        return this.companiesRepository.save(updatedCompany);
    }
}
