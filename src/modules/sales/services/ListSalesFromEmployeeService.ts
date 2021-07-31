import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Sale from '@shared/typeorm/entities/Sale';
import { inject, injectable } from 'tsyringe';
import ISalesRepository from '../repositories/ISalesRepository';

@injectable()
export default class ListSalesFromEmployeeService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('SalesRepository')
        private salesRepository: ISalesRepository,
    ) {}

    public async execute(employeeId: string): Promise<Sale[] | undefined> {
        const verifyEmployee = await this.usersRepository.findById(employeeId);

        if (!verifyEmployee) {
            throw new AppError('Employee not found.');
        }

        if (!verifyEmployee.companyId) {
            throw new AppError(
                'The requested user is not associated to a company.',
            );
        }

        const findedSales = await this.salesRepository.findAllFromEmployee(
            employeeId,
        );

        if (!findedSales) {
            throw new AppError(
                'The requested employee does not make any sales.',
            );
        }

        return findedSales;
    }
}
