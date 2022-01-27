import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import Company from '@shared/typeorm/entities/Company';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
export default class ShowCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute(userId: string): Promise<Company> {
        const findedUser = await this.usersRepository.findById(userId);
        if (!findedUser) throw new AppError('User not found.');

        if (!findedUser.companyId) {
            throw new AppError(
                'The requested user is not associated to a company.',
            );
        }

        const verifyCompany = await this.companiesRepository.findById(
            findedUser.companyId,
        );
        if (!verifyCompany) throw new AppError('Company not found.');

        return verifyCompany;
    }
}
