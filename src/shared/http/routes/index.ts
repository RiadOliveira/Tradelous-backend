import { Router } from 'express';
import companyRoutes from '@modules/companies/http/company.routes';
import userRoutes from '@modules/users/http/user.routes';

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/company', companyRoutes);

export default routes;
