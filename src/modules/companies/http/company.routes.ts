import RegisterCompanyService from '../services/RegisterCompanyService';
import HireEmployeeService from '../services/HireEmployeeService';
import FireEmployeeService from '../services/FireEmployeeService';
import ListEmployeesFromCompanyService from '../services/ListEmployeesFromCompanyService';
import UpdateCompanyService from '../services/UpdateCompanyService';
import UpdateCompanyLogoService from '../services/UpdateCompanyLogoService';
import ShowCompanyService from '../services/ShowCompanyService';
import DeleteCompanyService from '../services/DeleteCompanyService';

import multerConfig from '@config/upload';
import multer from 'multer';

import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import { celebrate, Joi, Segments } from 'celebrate';

const companyRoutes = Router();

const upload = multer(multerConfig);

companyRoutes.get('/', async (request: Request, response: Response) => {
    const userId = request.user.id;

    const showCompany = container.resolve(ShowCompanyService);

    const company = await showCompany.execute(userId);

    return response.status(200).json(company);
});

companyRoutes.post(
    '/',
    upload.single('logo'),
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            cnpj: Joi.number().required(),
            address: Joi.string().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { name, cnpj, address } = request.body;

        const logo = request.file ? request.file.filename : '';

        const adminId = request.user.id;

        const registerCompany = container.resolve(RegisterCompanyService);

        const newCompany = await registerCompany.execute({
            name,
            cnpj,
            address,
            adminId,
            logo,
        });

        return response.status(201).json(newCompany);
    },
);

companyRoutes.patch(
    '/hire-employee/:employeeId',
    celebrate({
        [Segments.PARAMS]: {
            employeeId: Joi.string().uuid().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { employeeId } = request.params;

        const adminId = request.user.id;

        const hireEmployee = container.resolve(HireEmployeeService);

        const newEmployee = await hireEmployee.execute(adminId, employeeId);

        return response.status(202).json(classToClass(newEmployee));
    },
);

companyRoutes.patch(
    '/fire-employee/:employeeId',
    celebrate({
        [Segments.PARAMS]: {
            employeeId: Joi.string().uuid().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { employeeId } = request.params;
        const adminId = request.user.id;

        const fireEmployee = container.resolve(FireEmployeeService);

        await fireEmployee.execute(adminId, employeeId);

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
    '/',
    upload.single('logo'),
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            cnpj: Joi.number().required(),
            address: Joi.string().required(),
        },
    }),
    async (request: Request, response: Response) => {
        const { name, cnpj, address } = request.body;

        const adminId = request.user.id;

        const updateCompany = container.resolve(UpdateCompanyService);

        const updatedCompany = await updateCompany.execute(
            { name, cnpj, address, adminId },
            adminId,
        );

        return response.status(202).json(updatedCompany);
    },
);

companyRoutes.patch(
    '/updateLogo',
    upload.single('logo'),
    async (request: Request, response: Response) => {
        const logo = request.file ? request.file.filename : '';

        const adminId = request.user.id;

        const updateCompanyLogo = container.resolve(UpdateCompanyLogoService);

        const updatedCompany = await updateCompanyLogo.execute(logo, adminId);

        return response.status(202).json(updatedCompany);
    },
);

companyRoutes.delete('/', async (request: Request, response: Response) => {
    const adminId = request.user.id;

    const deleteCompany = container.resolve(DeleteCompanyService);

    await deleteCompany.execute(adminId);

    return response.status(204).json();
});

export default companyRoutes;
