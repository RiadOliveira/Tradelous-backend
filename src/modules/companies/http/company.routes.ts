import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import RegisterCompanyService from '../services/RegisterCompanyService';
import AddEmployeeToCompanyService from '../services/AddEmployeeToCompanyService';
import RemoveEmployeeFromCompanyService from '../services/RemoveEmployeeFromCompanyService';
import ListEmployeesFromCompanyService from '../services/ListEmployeesFromCompanyService';
import UpdateCompanyService from '../services/UpdateCompanyService';
import GetCompanyService from '../services/GetCompanyService';

import multerConfig from '@config/upload';
import multer from 'multer';

const companyRoutes = Router();

const upload = multer(multerConfig);

companyRoutes.get('/', async (request: Request, response: Response) => {
    const userId = request.user.id;

    const getCompany = container.resolve(GetCompanyService);

    const company = await getCompany.execute(userId);

    return response.status(200).json(company);
});

companyRoutes.post(
    '/',
    upload.single('logo'),
    async (request: Request, response: Response) => {
        const { name, cnpj, adress } = request.body;

        const logo = request.file ? request.file.filename : '';

        const adminId = request.user.id;

        const registerCompany = container.resolve(RegisterCompanyService);

        const newCompany = await registerCompany.execute({
            name,
            cnpj,
            adress,
            adminId,
            logo,
        });

        return response.status(201).json(newCompany);
    },
);

companyRoutes.patch(
    '/add-employee',
    async (request: Request, response: Response) => {
        const { employeeId } = request.body;

        const adminId = request.user.id;

        const addEmployeeToCompany = container.resolve(
            AddEmployeeToCompanyService,
        );

        const newEmployee = await addEmployeeToCompany.execute(
            adminId,
            employeeId,
        );

        return response.status(202).json(newEmployee);
    },
);

companyRoutes.patch(
    '/remove-employee/:employeeId',
    async (request: Request, response: Response) => {
        const { employeeId } = request.params;
        const adminId = request.user.id;

        const removeEmployeeFromCompany = container.resolve(
            RemoveEmployeeFromCompanyService,
        );

        await removeEmployeeFromCompany.execute(adminId, employeeId);

        return response.status(204).json();
    },
);

companyRoutes.get(
    '/list-employees',
    async (request: Request, response: Response) => {
        const userId = request.user.id;

        const listEmployees = container.resolve(
            ListEmployeesFromCompanyService,
        );

        const employees = await listEmployees.execute(userId);

        return response.json(employees);
    },
);

companyRoutes.put(
    '/update',
    upload.single('logo'),
    async (request: Request, response: Response) => {
        const { name, cnpj, adress } = request.body;

        const logo = request.file ? request.file.filename : '';

        const adminId = request.user.id;

        const updateCompany = container.resolve(UpdateCompanyService);

        const updatedCompany = await updateCompany.execute(
            { name, cnpj, adress, adminId, logo },
            adminId,
        );

        return response.status(202).json(updatedCompany);
    },
);

export default companyRoutes;
