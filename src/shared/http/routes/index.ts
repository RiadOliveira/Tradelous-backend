import { Router } from 'express';
import companyRoutes from '@modules/companies/http/company.routes';
import userRoutes from '@modules/users/http/user.routes';
import productsRoutes from '@modules/products/http/products.routes';
import EnsureAuthentication from '@modules/users/http/middlewares/EnsureAuthentication';

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/company', EnsureAuthentication, companyRoutes);
routes.use('/products', EnsureAuthentication, productsRoutes);

export default routes;
