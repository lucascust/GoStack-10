import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
// Middleware
import authMiddleware from './app/middlewares/auth';

// Criação da estrutura de rotas importadas do express
const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/providers', ProviderController.index);

// A partir desse middlware, demais middlewares só serão executados se o usuário for autenticado
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);


export default routes;
