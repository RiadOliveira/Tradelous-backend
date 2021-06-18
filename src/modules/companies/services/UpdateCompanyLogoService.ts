import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Company from '@shared/typeorm/entities/Company';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
export default class UpdateCompanyLogoService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(logo: string, adminId: string): Promise<Company> {
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

        if (findedCompany.logo && !logo) {
            //If not receive the image name, indicates that the product's image was removed by the user.
            await this.storageProvider.delete(findedCompany.logo, 'logo');

            await this.companiesRepository.removeLogo(findedCompany.id);

            findedCompany.logo = undefined;

            return findedCompany;
        }

        if (findedCompany.logo) {
            await this.storageProvider.delete(findedCompany.logo, 'logo');
        }

        await this.storageProvider.save(logo, 'logo');

        findedCompany.logo = logo;

        return this.companiesRepository.save(findedCompany);
    }
}
