// config/config.cjs -- where Sequelize finds the database.
// Session 7 wrote development. Session 12 adds production.
require('dotenv').config();

module.exports = {
  // Your laptop: five separate values, read from .env
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  // Render: one connection string, read from DATABASE_URL
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }
};
