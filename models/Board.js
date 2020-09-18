const Sequelize = require('sequelize');
const sequelize = require('../utils/sequelize');

const Board = sequelize.define('board', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Board;