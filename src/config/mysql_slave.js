import { resolve } from 'path'
const dotEnvPath = resolve('.env')
const path = require('path')
const join = path.join
require('dotenv').config({ path: dotEnvPath })

const baseProperties = {
  username: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_SLAVE_DB_PASSWORD,
  database: process.env.MYSQL_DB_DATABASE,
  host: process.env.MYSQL_SLAVE_DB_HOST,
  port: process.env.MYSQL_DB_PORT,
  dialect: 'mysql',
  basePath: __dirname,
  modulesPath: join(__dirname, './../modules'),
  dbModelPath: join(__dirname, '/../infra/sequelize/db_exposed_models'),
  define: {
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    debug: false
  },
  logging: true,
  benchmark: true
}
module.exports = {
  development: {
    ...baseProperties,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 1000
    },
    sync: true
  },
  stage: {
    ...baseProperties,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 1000
    },
    sync: false
  },
  production: {
    ...baseProperties,
    pool: {
      max: 60,
      min: 1,
      acquire: 30000,
      idle: 10000
    },
    sync: false
  }
}
