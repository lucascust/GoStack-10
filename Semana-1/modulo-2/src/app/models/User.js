import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // Parâmetro de entrada é a conexão do model
  static init(sequelize) {
    // Iniciando classe pai de user (Model)
    super.init(
      {
        // definição das colunas (sem PK, FK e Create/Update)
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Método para criptografia da senha
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  // Método para decriptografar a senha
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  // Relações
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default User;
