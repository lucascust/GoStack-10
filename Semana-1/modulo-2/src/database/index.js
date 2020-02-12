import Sequelize from 'sequelize';
import mongoose from 'mongoose';

// Models import
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
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

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
