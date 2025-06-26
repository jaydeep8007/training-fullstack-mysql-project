const configCli = {
  development: {
    username: 'root',
    password: 'Admin@123',
    database: 'training-mysql-project',
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: 'admin',
    password: 'Admin@123',
    database: 'production-mysql-project',
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  },
};

module.exports = configCli;
