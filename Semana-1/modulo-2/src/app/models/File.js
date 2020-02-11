import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          // comando get insere qualquer valor no atributo
          get() {
            return `http://localhost:3333/files/${this.path}`;
          }
        }
      },
      {
        sequelize,
      }
    );
    return this;
  };
}

export default File;
