import { injectable, inject } from 'tsyringe';
import User from '@shared/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

@injectable()
export default class HireEmployeeService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
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

        if (
            findedEmployee.companyId ||
            findedEmployee.companyId === findedAdmin.companyId
        ) {
            throw new AppError(
                'The requested employee is already on a company.',
            );
        }

        findedEmployee.companyId = findedAdmin.companyId;

        return this.usersRepository.save(findedEmployee);
    }
}
