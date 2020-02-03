import Sequelize from 'sequelize';

// Models import
import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  // Método para conexão com a base de dados e carregar os models
  init() {
    this.connection = new Sequelize(databaseConfig);

    // Percorre todos os models e inicia todos com a conexão feita acima
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
