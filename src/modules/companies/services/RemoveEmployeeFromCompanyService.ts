import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

@injectable()
export default class RemoveEmployeeFromCompanyService {
    constructor(
        @inject('CompaniesRepository')
        private companiesRepository: ICompaniesRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute(adminId: string, employeeId: string): Promise<void> {
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
            throw new AppError('Employee not found.');
        }

        if (!findedEmployee.companyId) {
            throw new AppError(
                'Requested employee is not associated to this company.',
            );
        }

        if (
            !findedEmployee.companyId ||
            findedEmployee.companyId !== findedAdmin.companyId
        ) {
            throw new AppError(
                'Requested employee is not associated to this company.',
            );
        }

        await this.companiesRepository.removeEmployee(findedEmployee.id);
    }
}
