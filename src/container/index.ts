import { container } from 'tsyringe';
import UsersRepository from '../database/repositories/UsersRepository';
import BCryptProvider from '../providers/HashProvider/implementations/BCryptProvider';

container.registerSingleton('UsersRepository', UsersRepository);
container.registerSingleton('HashProvider', BCryptProvider);
