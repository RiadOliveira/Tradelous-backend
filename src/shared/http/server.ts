import express from 'express';
import '../typeorm/createConnection';
import 'express-async-errors';
import 'dotenv/config';
import 'reflect-metadata';
import '../container';

import GlobalErrorHandler from '../errors/GlobalErrorHandler';
import routes from './routes';
import path from 'path';

const app = express();

app.use(express.json());
app.use('/files', express.static(path.resolve('tmp', 'uploads')));
app.use(routes);
app.use(GlobalErrorHandler);
app.listen('3333');
