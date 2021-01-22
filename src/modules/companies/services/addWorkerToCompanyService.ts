import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';

interface Request {
    companyId: string;
    workerEmail: string;
}

@injectable()
export default class addWorkerToCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
    ) {}

    public async execute({ companyId, workerEmail }: Request): Promise<User> {
        const newWorker = await this.companiesRepository.addWorker({
            companyId,
            workerEmail,
        });

        if (!newWorker) {
            throw new AppError('User not found');
        }

        if (newWorker.companyId === companyId && newWorker.isAdmin) {
            throw new AppError(
                'The requested user is already the admin of the company',
            );
        }

        return newWorker;
    }
}
