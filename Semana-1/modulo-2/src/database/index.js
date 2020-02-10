import Sequelize from 'sequelize';

// Models import
import User from '../app/models/User';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  // Método para conexão com a base de dados e carregar os models
  init() {
    this.connection = new Sequelize(databaseConfig);

    // Percorre todos os models e inicia todos com a conexão feita acima
    // Também faz o map de todas as relações, caso existam


    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));


  }
}

export default new Database();
