import express from 'express';
import routes from './routes';
import path from 'path';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    // Método para arquivos estáticos (img, css, html), usados diratemente no navegador
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
  }

  routes() {
    this.server.use(routes);
  }
}
process.on('uncaughtException', function (err) {
  console.log(err);
});
// OLD: module.exports = new App().server;
export default new App().server;
