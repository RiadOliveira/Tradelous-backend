import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Company from '@shared/typeorm/entities/Company';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';

interface CompanyData {
    name: string;
    cnpj: string;
    adress: string;
    adminID: string;
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

    public async execute({
        name,
        cnpj,
        adress,
        adminID,
        logo,
    }: CompanyData): Promise<Company> {
        const findedCompany = await this.companiesRepository.findByCnpj(cnpj);

        if (findedCompany) {
            throw new AppError("Company's cnpj already exists");
        }

        const newCompany = await this.companiesRepository.create({
            name,
            cnpj,
            adress,
            adminID,
            logo,
        });

        const findedUser = await this.usersRepository.findById(adminID);

        if (!findedUser) {
            throw new AppError('Inexisting user');
        }

        if (logo) {
            await this.storageProvider.save(logo);
        }

        findedUser.companyId = newCompany.id;

        await this.usersRepository.save(findedUser);

        return newCompany;
    }
}
