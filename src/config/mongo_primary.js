const path = require('path')
const join = path.join
const baseProperties = {
  MongoDB: {
    host: process.env.MONGO_DB_HOST,
    port: process.env.MONGO_DB_PORT,
    user: process.env.MONGO_DB_USER,
    database: process.env.MONGO_DB_DATABASE,
    poolSize: process.env.MONGO_DB_POOL_SIZE ? parseInt(process.env.MONGO_DB_POOL_SIZE, 10) : 5,
    authStrategy: process.env.MONGO_DB_AUTH_STRATEGY || null,
    password: process.env.MONGO_DB_PASSWORD
  },
  modulesPath: join(__dirname, './../modules/'),
  dbModelPath: join(__dirname, '/../infra/mongoose/db_exposed_models')
}

module.exports = {
  development: {
    ...baseProperties
  },
  stage: {
    ...baseProperties
  },
  production: {
    ...baseProperties
  }
}
