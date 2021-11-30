import { getRepository, Raw, Repository } from 'typeorm';
import { addDays, addMonths } from 'date-fns';

import Sale from '@shared/typeorm/entities/Sale';
import ISalesRepository from './ISalesRepository';
import CreateSaleDTO from './dtos/CreateSaleDTO';

class SalesRepository implements ISalesRepository {
    private SalesRepository: Repository<Sale>;

    constructor() {
        this.SalesRepository = getRepository(Sale);
    }

    public async create(sale: CreateSaleDTO): Promise<Sale> {
        const newSale = this.SalesRepository.create(sale);

        return this.SalesRepository.save(newSale);
    }

    public async save(sale: Sale): Promise<Sale> {
        return this.SalesRepository.save(sale);
    }

    public async delete(saleId: string): Promise<void> {
        await this.SalesRepository.delete(saleId);
    }

    public async findById(saleId: string): Promise<Sale | undefined> {
        return this.SalesRepository.findOne(saleId);
    }

    public async findAllFromCompany(
        companyId: string,
    ): Promise<Sale[] | undefined> {
        const findedSales = await this.SalesRepository.find({
            where: {
                companyId,
            },
            relations: ['employee', 'product'],
            order: {
                date: 'ASC',
            },
        });

        return findedSales;
    }

    public async findAllFromEmployee(
        employeeId: string,
    ): Promise<Sale[] | undefined> {
        const findedSales = await this.SalesRepository.find({
            where: {
                employeeId,
            },
            relations: ['employee', 'product'],
            order: {
                date: 'ASC',
            },
        });

        return findedSales;
    }

    public async findAllOnDay(
        day: number,
        month: number,
        year: number,
    ): Promise<Sale[] | undefined> {
        const nextDate = addDays(new Date(year, month - 1, day), 1);

        const findedSales = await this.SalesRepository.find({
            where: {
                date: Raw(
                    dateFieldName =>
                        `
                        ${dateFieldName} >= '${year}-${month}-${day}'::date AND
                        ${dateFieldName} < '${nextDate.toDateString()}'
                        `,
                ),
            },
            relations: ['employee', 'product'],
            order: {
                date: 'ASC',
            },
        });

        return findedSales;
    }

    public async findAllOnWeek(
        startDay: string,
        startMonth: string,
        year: string,
    ): Promise<Sale[] | undefined> {
        const findedSales = await this.SalesRepository.find({
            where: {
                date: Raw(
                    dateFieldName =>
                        `
                         ${dateFieldName} >= '${year}-${startMonth}-${startDay}'::date AND
                         ${dateFieldName} <= ('${year}-${startMonth}-${startDay}'::date +
                         '7 days'::interval)
                        `,
                ),
            },
            relations: ['employee', 'product'],
            order: {
                date: 'ASC',
            },
        });

        return findedSales;
    }

    public async findAllOnMonth(
        month: number,
        year: number,
    ): Promise<Sale[] | undefined> {
        const findedSales = await this.SalesRepository.find({
            where: {
                date: Raw(
                    dateFieldName =>
                        `
                    ${dateFieldName} >= '${year}-${month}-1'::date AND
                    ${dateFieldName} < '${addMonths(
                            new Date(year, month - 1),
                            1,
                        ).toDateString()}'
                `,
                ),
            },
            relations: ['employee', 'product'],
            order: {
                date: 'ASC',
            },
        });

        return findedSales;
    }
}

export default SalesRepository;
