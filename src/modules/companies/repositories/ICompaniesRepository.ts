import Company from '@shared/typeorm/entities/Company';
import User from '@shared/typeorm/entities/User';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';

export default interface ICompaniesRepository {
    create(data: Omit<CompanyRepositoryDTO, 'id'>): Promise<Company>;
    save(company: CompanyRepositoryDTO): Promise<Company>;
    findById(id: string): Promise<Company | undefined>;
    findByCnpj(cnpj: string): Promise<Company | undefined>;
    listWorkers(companyId: string): Promise<User[] | undefined>;
    removeWorker(workerId: string): Promise<void>;
    removeCompanyLogo(companyId: string): Promise<void>;
}
