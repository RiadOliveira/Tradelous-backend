import { Router } from 'express';
import EnsureAuthentication from '@modules/users/http/middlewares/EnsureAuthentication';

import userRoutes from '@modules/users/http/user.routes';
import companyRoutes from '@modules/companies/http/company.routes';
import productsRoutes from '@modules/products/http/products.routes';
import salesRoutes from '@modules/sales/http/sales.routes';

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/company', EnsureAuthentication, companyRoutes);
routes.use('/products', EnsureAuthentication, productsRoutes);
routes.use('/sales', EnsureAuthentication, salesRoutes);

export default routes;
