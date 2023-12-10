require('dotenv').load()

const path = require('path')
const fs = require('fs')
const ENV = process.env.NODE_ENV || 'development'

function loadPrimaryRedisConfig() {
  if (fs.existsSync(path.join(__dirname, './redis_primary.js'))) {
    return require('./redis_primary')[ENV]
  }
  throw new Error('Redis Config path is configuration is required')
}
function loadPrimaryMongoConfig() {
  if (fs.existsSync(path.join(__dirname, './mongo_primary.js'))) {
    return require('./mongo_primary')[ENV]
  }
  throw new Error('Mongo Config path is configuration is required')
}

const envConfig = require(path.join(__dirname, 'environments', ENV))
const primaryRedisConfig = loadPrimaryRedisConfig()
const primaryMongoConfig = loadPrimaryMongoConfig()
const config = Object.assign({
  env: ENV,
  ... primaryRedisConfig,
  ... primaryMongoConfig,
  databaseConfigPath: `${__dirname}/`,
  redisConfigPath: `${__dirname}/`
}, envConfig)

module.exports = config
