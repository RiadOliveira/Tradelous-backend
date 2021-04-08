import { getRepository, Repository } from 'typeorm';
import Company from '@shared/typeorm/entities/Company';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';
import ICompaniesRepository from './ICompaniesRepository';
import { classToClass } from 'class-transformer';
import User from '@shared/typeorm/entities/User';

class CompaniesRepository implements ICompaniesRepository {
    private CompaniesRepository: Repository<Company>;
    private UsersRepository: Repository<User>;

    constructor() {
        this.CompaniesRepository = getRepository(Company);
        this.UsersRepository = getRepository(User);
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

    public async listWorkers(companyId: string): Promise<User[] | undefined> {
        const findedCompany = await this.CompaniesRepository.findOne(
            companyId,
            {
                relations: ['workers'],
            },
        );

        return findedCompany ? findedCompany.workers : undefined;
    }

    public async removeWorker(workerId: string): Promise<void> {
        await this.UsersRepository.query(
            `UPDATE users SET "companyId" = NULL WHERE id = '${workerId}'`,
        );
    }
}

export default CompaniesRepository;
