/*
  Migration que cria uma relação entre as tabelas Files e User
  - Adiciona coluna 'avatar_id' em User, com referencia 'id' de Files
*/

module.exports = {
  up: (queryInterface, Sequelize) => {
    // addColumn: table, key, atributos, opções
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      // Repassar atualização em files para users
      onUpdate: 'CASCADE',
      // Insere Null na coluna do usuario ao deletar arquivo
      onDelete: 'SET NULL',
      // Apesar de ser padrão, foi inserido para forçar a config
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id')
  },
};
