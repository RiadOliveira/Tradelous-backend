import ICompaniesRepository from '../repositories/ICompaniesRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';

interface Request {
    workerEmail: string;
    companyId: string;
}

@injectable()
export default class removeWorkerFromCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
    ) {}

    public async execute({ workerEmail, companyId }: Request): Promise<User> {
        const removedWorker = await this.companiesRepository.removeWorker({
            workerEmail,
            companyId,
        });

        if (!removedWorker) {
            throw new AppError('User not found');
        }

        return removedWorker;
    }
}
