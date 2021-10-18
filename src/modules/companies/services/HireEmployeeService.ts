import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/ICacheProvider';

@injectable()
export default class HireEmployeeService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute(adminId: string, employeeId: string): Promise<User> {
        const findedAdmin = await this.usersRepository.findById(adminId);

        if (!findedAdmin) {
            throw new AppError('Admin not found.');
        }

        if (!findedAdmin.companyId) {
            throw new AppError(
                'The requested admin is not associated to a company.',
            );
        }

        if (!findedAdmin.isAdmin) {
            throw new AppError(
                'The user does not have permission for this action.',
                401,
            );
        }

        const findedEmployee = await this.usersRepository.findById(employeeId);

        if (!findedEmployee) {
            throw new AppError('Requested employee not found.');
        }

        if (findedEmployee.isAdmin) {
            throw new AppError('The requested employee has an admin account.');
        }

        if (
            findedEmployee.companyId ||
            findedEmployee.companyId === findedAdmin.companyId
        ) {
            throw new AppError(
                'The requested employee is already associated to a company.',
            );
        }

        findedEmployee.companyId = findedAdmin.companyId;

        await this.usersRepository.save(findedEmployee);

        await this.cacheProvider.invalidate(
            `employees-list:${findedAdmin.companyId}`,
        );

        return findedEmployee;
    }
}
