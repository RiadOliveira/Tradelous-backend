import ICompaniesRepository from '../repositories/ICompaniesRepository';
import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';

@injectable()
export default class addWorkerToCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
    ) {}

    public async execute(companyId: string): Promise<User[]> {
        const findedCompany = await this.companiesRepository.listWorkers(
            companyId,
        );

        return findedCompany;
    }
}
