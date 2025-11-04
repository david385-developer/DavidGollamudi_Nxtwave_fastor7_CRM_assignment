const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './crm_db.sqlite',
  logging: console.log // Enable logging to debug database operations
});

module.exports = sequelize;