import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

// Criação da estrutura de rotas importadas do express
const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// A partir desse middlware, demais middlewares só serão executados se o usuário for autenticado
routes.use(authMiddleware);

routes.put('/sessions', UserController.update);

export default routes;
