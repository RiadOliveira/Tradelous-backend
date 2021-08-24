import { getRepository, Repository } from 'typeorm';
import Company from '@shared/typeorm/entities/Company';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';
import ICompaniesRepository from './ICompaniesRepository';
import { classToClass } from 'class-transformer';
import User from '@shared/typeorm/entities/User';
import Product from '@shared/typeorm/entities/Product';

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
        return this.CompaniesRepository.findOne(id);
    }

    public async findByCnpj(cnpj: number): Promise<Company | undefined> {
        const findedCompany = await this.CompaniesRepository.findOne({
            where: { cnpj },
        });

        return findedCompany;
    }

    public async findEmployees(companyId: string): Promise<User[] | undefined> {
        const findedCompany = await this.CompaniesRepository.findOne(
            companyId,
            {
                relations: ['employees'],
            },
        );

        if (findedCompany) {
            findedCompany.employees.forEach((employee, index) => {
                findedCompany.employees[index] = classToClass(employee);
            });
        }

        return findedCompany ? findedCompany.employees : undefined;
    }

    public async findProducts(
        companyId: string,
    ): Promise<Product[] | undefined> {
        const findedCompany = await this.CompaniesRepository.findOne(
            companyId,
            {
                relations: ['products'],
            },
        );

        return findedCompany ? findedCompany.products : undefined;
    }

    public async removeEmployee(employeeId: string): Promise<void> {
        await this.UsersRepository.query(
            `UPDATE users SET "companyId" = NULL WHERE id = '${employeeId}'`,
        );
    }

    public async removeLogo(companyId: string): Promise<void> {
        await this.CompaniesRepository.query(
            `UPDATE companies SET "logo" = NULL WHERE id = '${companyId}'`,
        );
    }

    public async delete(companyId: string): Promise<void> {
        await this.CompaniesRepository.delete(companyId);
    }
}

export default CompaniesRepository;
