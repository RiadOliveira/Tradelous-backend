import AppError from '@shared/errors/AppError';
import ICompaniesRepository from '../repositories/ICompaniesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/providers/StorageProvider/IStorageProvider';

import { injectable, inject } from 'tsyringe';

@injectable()
export default class DeleteCompanyService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute(adminId: string): Promise<void> {
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

        if (findedCompany.logo) {
            await this.storageProvider.delete(findedCompany.logo, 'logo');
        }

        await this.usersRepository.save({ ...findedAdmin, isAdmin: false });

        await this.usersRepository.leaveCompany(findedAdmin.id);

        await this.companiesRepository.delete(findedCompany.id);
    }
}
