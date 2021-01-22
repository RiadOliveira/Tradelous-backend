import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import RegisterCompanyService from '../services/RegisterCompanyService';
import addWorkerToCompanyService from '../services/addWorkerToCompanyService';
import removeWorkerFromCompanyService from '../services/removeWorkerFromCompanyService';
import ListWorkersFromCompanyService from '../services/ListWorkersFromCompanyService';
import multerConfig from '@config/upload';
import multer from 'multer';

const companyRoutes = Router();

const upload = multer(multerConfig);

companyRoutes.post(
    '/register',
    upload.single('logo'),
    async (request: Request, response: Response) => {
        const { name, cnpj, adress, adminID } = request.body;
        const logo = request.file.originalname;

        const registerCompany = container.resolve(RegisterCompanyService);

        const newCompany = await registerCompany.execute({
            name,
            cnpj,
            adress,
            adminID,
            logo,
        });

        return response.json(newCompany);
    },
);

companyRoutes.post(
    '/add-worker',
    async (request: Request, response: Response) => {
        const { companyId, workerEmail } = request.body;

        const addWorkerToCompany = container.resolve(addWorkerToCompanyService);

        const newWorker = await addWorkerToCompany.execute({
            companyId,
            workerEmail,
        });

        return response.json(newWorker);
    },
);

companyRoutes.post(
    '/remove-worker',
    async (request: Request, response: Response) => {
        const { companyId, workerEmail } = request.body;

        const removeWorkerFromCompany = container.resolve(
            removeWorkerFromCompanyService,
        );

        const removedWorker = await removeWorkerFromCompany.execute({
            companyId,
            workerEmail,
        });

        return response.json(removedWorker);
    },
);

companyRoutes.get(
    '/list-workers/:companyId',
    async (request: Request, response: Response) => {
        const { companyId } = request.params;

        const listWorkers = container.resolve(ListWorkersFromCompanyService);

        const workers = await listWorkers.execute(companyId);

        return response.json(workers);
    },
);

export default companyRoutes;
