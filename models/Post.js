const Sequelize = require('sequelize');
const sequelize = require('../utils/sequelize');
const User = require('./User');
const Board = require('./Board');

const Post = sequelize.define('post', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(30),
    allowNull: true
  },
  content: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  thread: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  threadNum: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

Post.belongsTo(User);
User.hasMany(Post);

Post.belongsTo(Board);
Board.hasMany(Post);

module.exports = Post;