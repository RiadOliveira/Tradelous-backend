import { container } from 'tsyringe';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import CompaniesRepository from '@modules/companies/repositories/CompaniesRepository';
import ProductsRepository from '@modules/products/repositories/ProductsRepository';
import SalesRepository from '@modules/sales/repositories/SalesRepository';

import BCryptProvider from '../providers/HashProvider/implementations/BCryptProvider';
import DiskProvider from '../providers/StorageProvider/implementations/DiskProvider';
import EtherealMailProvider from '../providers/MailProvider/implementations/EtherealMailProvider';
import NunJucksMailTemplateProvider from '@shared/providers/MailTemplateProvider/implementations/NunjucksMailTemplateProvider';
import RedisCacheProvider from '@shared/providers/CacheProvider/implementations/RedisCacheProvider';

container.registerSingleton('UsersRepository', UsersRepository);
container.registerSingleton('CompaniesRepository', CompaniesRepository);
container.registerSingleton('ProductsRepository', ProductsRepository);
container.registerSingleton('SalesRepository', SalesRepository);

container.registerSingleton('HashProvider', BCryptProvider);
container.registerSingleton('StorageProvider', DiskProvider);
container.registerSingleton('CacheProvider', RedisCacheProvider);

container.registerSingleton(
    'MailTemplateProvider',
    NunJucksMailTemplateProvider,
);

container.registerInstance(
    'MailProvider',
    container.resolve(EtherealMailProvider),
);
