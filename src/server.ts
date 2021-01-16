import express from 'express';
import './database/createConnection';
import 'express-async-errors';
import GlobalErrorHandler from './errors/GlobalErrorHandler';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);
app.use(GlobalErrorHandler);
app.listen('3333');
