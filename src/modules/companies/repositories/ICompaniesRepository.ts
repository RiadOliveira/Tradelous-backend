import Company from '@shared/typeorm/entities/Company';
import Product from '@shared/typeorm/entities/Product';
import User from '@shared/typeorm/entities/User';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';

export default interface ICompaniesRepository {
    create(data: Omit<CompanyRepositoryDTO, 'id'>): Promise<Company>;
    save(company: Company): Promise<Company>;
    findById(id: string): Promise<Company | undefined>;
    findByCnpj(cnpj: number): Promise<Company | undefined>;
    listEmployees(companyId: string): Promise<User[] | undefined>;
    listProducts(companyId: string): Promise<Product[] | undefined>;
    removeEmployee(employeeId: string): Promise<void>;
    removeCompanyLogo(companyId: string): Promise<void>;
}
