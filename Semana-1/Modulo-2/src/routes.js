import { Router } from 'express';

// Criação da estrutura de rotas importadas do express
const routes = new Router();
  routes.get('/', (req, res) => {
    console.log(res);
    
    res.json({message: 'Hello Bila'})

  });

export default routes;  