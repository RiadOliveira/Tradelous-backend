import Sale from '@shared/typeorm/entities/Sale';
import CreateSaleDTO from './dtos/CreateSaleDTO';
import DateToSearchDTO from './dtos/SearchDateDTO';

export default interface ISalesRepository {
    create(sale: CreateSaleDTO): Promise<Sale>;
    save(sale: Sale): Promise<Sale>;
    delete(saleId: string): Promise<void>;
    findById(saleId: string): Promise<Sale | undefined>;
    findAllFromCompany(companyId: string): Promise<Sale[] | undefined>;
    findAllFromEmployee(employeeId: string): Promise<Sale[] | undefined>;
    findAllOnDay(searchDate: DateToSearchDTO): Promise<Sale[] | undefined>;
    findAllOnWeek(searchDate: DateToSearchDTO): Promise<Sale[] | undefined>;
    findAllOnMonth(searchDate: DateToSearchDTO): Promise<Sale[] | undefined>;
}
