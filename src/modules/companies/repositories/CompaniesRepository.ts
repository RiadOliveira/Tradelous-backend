import { getRepository, Repository } from 'typeorm';
import Company from '@shared/typeorm/entities/Company';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';
import ICompaniesRepository from './ICompaniesRepository';
import { classToClass } from 'class-transformer';

class CompaniesRepository implements ICompaniesRepository {
    private CompaniesRepository: Repository<Company>;

    constructor() {
        this.CompaniesRepository = getRepository(Company);
    }

    public async create(company: CompanyRepositoryDTO): Promise<Company> {
        const newCompany = this.CompaniesRepository.create(company);

        await this.CompaniesRepository.save(newCompany);

        return newCompany;
    }

    public async save(company: CompanyRepositoryDTO): Promise<Company> {
        const updatedCompany = await this.CompaniesRepository.save(company);

        return updatedCompany;
    }

    public async findById(id: string): Promise<Company | undefined> {
        const findedCompany = await this.CompaniesRepository.findOne(id, {
            relations: ['workers'],
        });

        if (findedCompany) {
            findedCompany.workers.forEach((worker, index) => {
                findedCompany.workers[index] = classToClass(worker);
            });
        }

        return findedCompany;
    }

    public async findByCnpj(cnpj: string): Promise<Company | undefined> {
        const findedCompany = await this.CompaniesRepository.findOne({
            where: { cnpj },
            relations: ['workers'],
        });

        if (findedCompany) {
            findedCompany.workers.forEach((worker, index) => {
                findedCompany.workers[index] = classToClass(worker);
            });
        }

        return findedCompany;
    }
}

export default CompaniesRepository;
