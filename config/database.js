const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('web_backend_lab', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;