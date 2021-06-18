import { getRepository, Raw, Repository } from 'typeorm';
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

    public async findAllFromCompany(
        companyId: string,
    ): Promise<Sale[] | undefined> {
        const findedSales = await this.SalesRepository.find({
            where: {
                companyId,
            },
        });

        return findedSales;
    }

    public async findAllOfEmployee(
        employeeId: string,
    ): Promise<Sale[] | undefined> {
        const findedSales = await this.SalesRepository.find({
            where: {
                employeeId,
            },
        });

        return findedSales;
    }

    public async findAllOnDay(
        day: number,
        month: number,
    ): Promise<Sale[] | undefined> {
        const parsedDay = day.toString().padStart(2, '0');
        const parsedMonth = month.toString().padStart(2, '0');

        const findedSales = await this.SalesRepository.find({
            where: {
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM') = '${parsedDay}-${parsedMonth}'`,
                ),
            },
        });

        return findedSales;
    }
    public async findAllOnMonth(month: number): Promise<Sale[] | undefined> {
        const parsedMonth = month.toString().padStart(2, '0');

        const findedSales = await this.SalesRepository.find({
            where: {
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM') = '${parsedMonth}'`,
                ),
            },
        });

        return findedSales;
    }
}

export default SalesRepository;
