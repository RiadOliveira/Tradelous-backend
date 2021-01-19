import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import RegisterCompanyService from '../services/RegisterCompanyService';
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

export default companyRoutes;
