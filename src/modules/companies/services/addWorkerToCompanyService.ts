import ICompaniesRepository from '../repositories/ICompaniesRepository';
import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface Request {
    companyId: string;
    workerId: string;
    adminId: string;
}

@injectable()
export default class addWorkerToCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({
        companyId,
        workerId,
        adminId,
    }: Request): Promise<User> {
        const findedCompany = await this.companiesRepository.findById(
            companyId,
        );
        const findedWorker = await this.usersRepository.findById(workerId);
        const findedAdmin = await this.usersRepository.findById(adminId);

        if (!findedCompany) {
            throw new AppError('Company not found', 400);
        }

        if (!findedWorker) {
            throw new AppError('Worker not found', 400);
        }

        if (!findedAdmin) {
            throw new AppError('Admin not found', 400);
        }

        if (findedWorker.companyId === findedCompany.id) {
            throw new AppError(
                'The requested worker is already on the company',
                400,
            );
        }

        if (
            findedWorker.companyId &&
            findedWorker.companyId !== findedCompany.id
        ) {
            throw new AppError(
                'The requested user is already associated to another company',
                400,
            );
        }

        if (
            !findedAdmin.isAdmin ||
            (findedAdmin.isAdmin && findedWorker.companyId)
        ) {
            throw new AppError(
                'The user does not have permission to execute this action',
                401,
            );
        }

        findedWorker.companyId = findedCompany.id;

        return this.usersRepository.save(findedWorker);
    }
}
