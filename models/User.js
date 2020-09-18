const Sequelize = require('sequelize');
const sequelize = require('../utils/sequelize');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(30),
    allowNull: false
  }
});

module.exports = User;