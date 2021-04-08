import ICompaniesRepository from '../repositories/ICompaniesRepository';
import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
export default class ListWorkersFromCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute(companyId: string, userId: string): Promise<User[]> {
        const findedUser = await this.usersRepository.findById(userId);

        if (!findedUser) {
            throw new AppError('User not found', 400);
        }

        if (findedUser.companyId !== companyId) {
            throw new AppError(
                'The user does not have permission to execute this action',
                401,
            );
        }

        const findedCompany = await this.companiesRepository.listWorkers(
            companyId,
        );

        if (!findedCompany) {
            throw new AppError('Company not found', 400);
        }

        return findedCompany;
    }
}
