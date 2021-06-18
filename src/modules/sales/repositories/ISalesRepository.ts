import Sale from '@shared/typeorm/entities/Sale';
import CreateSaleDTO from './dtos/CreateSaleDTO';

export default interface ISalesRepository {
    create(sale: CreateSaleDTO): Promise<Sale>;
    save(sale: Sale): Promise<Sale>;
    delete(saleId: string): Promise<void>;
    findAllFromCompany(companyId: string): Promise<Sale[] | undefined>;
    findAllOfEmployee(employeeId: string): Promise<Sale[] | undefined>;
    findAllOnDay(day: number, month: number): Promise<Sale[] | undefined>;
    findAllOnMonth(month: number): Promise<Sale[] | undefined>;
}
