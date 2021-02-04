import { Router } from 'express';
import companyRoutes from '@modules/companies/http/company.routes';
import userRoutes from '@modules/users/http/user.routes';
import EnsureAuthentication from '@modules/users/http/middlewares/EnsureAuthentication';

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/company', EnsureAuthentication, companyRoutes);

export default routes;
