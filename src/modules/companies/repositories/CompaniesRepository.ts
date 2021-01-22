import { getRepository, Repository } from 'typeorm';
import Company from '@shared/typeorm/entities/Company';
import CompanyRepositoryDTO from './dtos/CompanyRepositoryDTO';
import ICompaniesRepository from './ICompaniesRepository';
import { classToClass } from 'class-transformer';
import User from '@shared/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface AdminWorkers {
    companyId: string;
    workerEmail: string;
}

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

    public async addWorker({
        companyId,
        workerEmail,
    }: AdminWorkers): Promise<User | undefined> {
        const findedUser = await this.UsersRepository.findOne({
            where: { email: workerEmail },
        });

        if (!findedUser) {
            return findedUser;
        }

        if (findedUser.companyId === companyId) {
            throw new AppError(
                'The requested user is already a worker of this company',
            );
        }

        findedUser.companyId = companyId;

        await this.UsersRepository.save(findedUser);

        return findedUser;
    }

    public async removeWorker({
        companyId,
        workerEmail,
    }: AdminWorkers): Promise<User | undefined> {
        const findedUser = await this.UsersRepository.findOne({
            where: { email: workerEmail },
        });

        if (!findedUser) {
            return findedUser;
        }

        if (findedUser.companyId !== companyId) {
            throw new AppError(
                'The requested user does not work on the indicated company',
            );
        }

        if (findedUser.companyId === companyId && findedUser.isAdmin) {
            throw new AppError(
                'The requested user can not be removed because he is the admin of the company',
            );
        }

        findedUser.companyId = undefined;

        await this.UsersRepository.save(findedUser);

        return findedUser;
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

    public async listWorkers(companyId: string): Promise<User[]> {
        const findedCompany = await this.CompaniesRepository.findOne(
            companyId,
            {
                relations: ['workers'],
            },
        );

        if (!findedCompany) {
            throw new AppError('Invalid company id');
        }

        return findedCompany.workers;
    }
}

export default CompaniesRepository;
