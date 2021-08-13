import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Sale from '@shared/typeorm/entities/Sale';
import { inject, injectable } from 'tsyringe';
import ISalesRepository from '../repositories/ISalesRepository';

@injectable()
export default class ListSalesOnDayService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('SalesRepository')
        private salesRepository: ISalesRepository,
    ) {}

    public async execute(
        userId: string,
        day: string,
        month: string,
    ): Promise<Sale[] | undefined> {
        const verifyUser = await this.usersRepository.findById(userId);

        if (!verifyUser) {
            throw new AppError('Employee not found.');
        }

        if (!verifyUser.companyId) {
            throw new AppError(
                'The requested user is not associated to a company.',
            );
        }

        const parsedDay = day.padStart(2, '0');
        const parsedMonth = month.padStart(2, '0');

        const findedSales = await this.salesRepository.findAllOnDay(
            parsedDay,
            parsedMonth,
        );

        return findedSales;
    }
}
