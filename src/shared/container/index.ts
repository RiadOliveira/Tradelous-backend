import { container } from 'tsyringe';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import BCryptProvider from '../providers/HashProvider/implementations/BCryptProvider';
import CompaniesRepository from '@modules/companies/repositories/CompaniesRepository';

container.registerSingleton('UsersRepository', UsersRepository);
container.registerSingleton('CompaniesRepository', CompaniesRepository);
container.registerSingleton('HashProvider', BCryptProvider);
