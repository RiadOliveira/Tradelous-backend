import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

interface Request {
    adminId: string;
    workerId: string;
}

@injectable()
export default class removeWorkerFromCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ adminId, workerId }: Request): Promise<void> {
        const findedWorker = await this.usersRepository.findById(workerId);
        const findedAdmin = await this.usersRepository.findById(adminId);

        if (!findedWorker) {
            throw new AppError('Worker not found', 400);
        }

        if (!findedAdmin) {
            throw new AppError('Admin not found', 400);
        }

        if (
            !findedAdmin.isAdmin ||
            (findedAdmin.isAdmin &&
                findedWorker.companyId !== findedAdmin.companyId)
        ) {
            throw new AppError(
                'The indicated user does not have the permission to execute this action',
                401,
            );
        }

        await this.companiesRepository.removeWorker(findedWorker.id);
    }
}
