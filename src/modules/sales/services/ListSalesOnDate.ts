import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Sale from '@shared/typeorm/entities/Sale';
import SearchDateDTO from '../repositories/dtos/SearchDateDTO';
import ISalesRepository from '../repositories/ISalesRepository';
import { inject, injectable } from 'tsyringe';

type searchType = 'day' | 'week' | 'month';

@injectable()
export default class ListSalesOnWeekService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('SalesRepository')
        private salesRepository: ISalesRepository,
    ) {}

    public async execute(
        userId: string,
        { startDay, startMonth, startYear }: SearchDateDTO,
        type: searchType,
    ): Promise<Sale[] | undefined> {
        const verifyUser = await this.usersRepository.findById(userId);
        if (!verifyUser) throw new AppError('Employee not found.');

        if (!verifyUser.companyId) {
            throw new AppError(
                'The requested user is not associated to a company.',
            );
        }

        if (!Number(startDay + startMonth + startYear)) {
            throw new AppError('Invalid date to search.');
        }

        const parsedDay = startDay.padStart(2, '0');
        const parsedMonth = startMonth.padStart(2, '0');

        const searchDate: SearchDateDTO = {
            startDay: parsedDay,
            startMonth: parsedMonth,
            startYear,
        };

        return (() => {
            switch (type) {
                case 'day':
                    return this.salesRepository.findAllOnDay(searchDate);
                case 'week':
                    return this.salesRepository.findAllOnWeek(searchDate);
                default:
                    return this.salesRepository.findAllOnMonth(searchDate);
            }
        })();
    }
}
