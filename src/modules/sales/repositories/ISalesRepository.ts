import Sale from '@shared/typeorm/entities/Sale';
import CreateSaleDTO from './dtos/CreateSaleDTO';

export default interface ISalesRepository {
    create(sale: CreateSaleDTO): Promise<Sale>;
    save(sale: Sale): Promise<Sale>;
    delete(saleId: string): Promise<void>;
    findById(saleId: string): Promise<Sale | undefined>;
    findAllFromCompany(companyId: string): Promise<Sale[] | undefined>;
    findAllFromEmployee(employeeId: string): Promise<Sale[] | undefined>;
    findAllOnDay(day: number, month: number): Promise<Sale[] | undefined>;
    findAllOnMonth(month: number): Promise<Sale[] | undefined>;
}
