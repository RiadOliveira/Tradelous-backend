import Company from '@shared/typeorm/entities/Company';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';

export default interface ICompaniesRepository {
    create(data: Omit<CompanyRepositoryDTO, 'id'>): Promise<Company>;
    save(company: CompanyRepositoryDTO): Promise<Company>;
    findById(id: string): Promise<Company | undefined>;
    findByCnpj(cnpj: string): Promise<Company | undefined>;
}
