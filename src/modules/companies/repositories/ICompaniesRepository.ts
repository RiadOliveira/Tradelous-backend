import Company from '@shared/typeorm/entities/Company';
import User from '@shared/typeorm/entities/User';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';
import AdminWorkersDTO from './dtos/AdminWorkersDTO';

export default interface ICompaniesRepository {
    create(data: Omit<CompanyRepositoryDTO, 'id'>): Promise<Company>;
    save(company: CompanyRepositoryDTO): Promise<Company>;
    findById(id: string): Promise<Company | undefined>;
    findByCnpj(cnpj: string): Promise<Company | undefined>;
    addWorker({
        companyId,
        workerEmail,
    }: AdminWorkersDTO): Promise<User | undefined>;
    removeWorker({
        companyId,
        workerEmail,
    }: AdminWorkersDTO): Promise<User | undefined>;
    listWorkers(companyId: string): Promise<User[]>;
}
