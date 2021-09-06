import Company from '@shared/typeorm/entities/Company';
import User from '@shared/typeorm/entities/User';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';

export default interface ICompaniesRepository {
    create(data: Omit<CompanyRepositoryDTO, 'id'>): Promise<Company>;
    save(company: Company): Promise<Company>;
    findById(id: string): Promise<Company | undefined>;
    findByCnpj(cnpj: number): Promise<Company | undefined>;
    findEmployees(companyId: string): Promise<User[] | undefined>;
    removeEmployee(employeeId: string): Promise<void>;
    removeLogo(companyId: string): Promise<void>;
    delete(companyId: string): Promise<void>;
}
