import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import RegisterCompanyService from '../services/RegisterCompanyService';
import addWorkerToCompanyService from '../services/AddWorkerToCompanyService';
import removeWorkerFromCompanyService from '../services/RemoveWorkerFromCompanyService';
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

        let logo;
        if (request.file) {
            logo = request.file.filename;
        }

        const registerCompany = container.resolve(RegisterCompanyService);

        const newCompany = await registerCompany.execute({
            name,
            cnpj,
            adress,
            adminID,
            logo,
        });

        return response.json(newCompany).status(201);
    },
);

companyRoutes.patch(
    '/add-worker',
    async (request: Request, response: Response) => {
        const { companyId, workerId } = request.body;

        const adminId = request.user.id;

        const addWorkerToCompany = container.resolve(addWorkerToCompanyService);

        const newWorker = await addWorkerToCompany.execute({
            companyId,
            workerId,
            adminId,
        });

        return response.json(newWorker);
    },
);

companyRoutes.patch(
    '/remove-worker/:workerId',
    async (request: Request, response: Response) => {
        const { workerId } = request.params;

        const adminId = request.user.id;

        const removeWorkerFromCompany = container.resolve(
            removeWorkerFromCompanyService,
        );

        await removeWorkerFromCompany.execute({
            adminId,
            workerId,
        });

        return response.json();
    },
);

companyRoutes.get(
    '/list-workers/:companyId',
    async (request: Request, response: Response) => {
        const { companyId } = request.params;
        const userId = request.user.id;

        const listWorkers = container.resolve(ListWorkersFromCompanyService);

        const workers = await listWorkers.execute(companyId, userId);

        return response.json(workers);
    },
);

export default companyRoutes;
