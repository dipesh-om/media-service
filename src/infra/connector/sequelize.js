'use strict'

const path = require('path')
const fs = require('fs')
const Sequelize = require('sequelize')

const decamelize = require('decamelize')
const join = path.join
const cls = require('../httpContext/cls')
const namespace = cls.getNs()
Sequelize.useCLS(namespace)

const _basename = path.basename
const basename = _basename(__filename)

module.exports = ({ logger, config }) => {

    const sequelize = ({ config, cls, basePath, logger, modulesPath, dbModelPath }) => {
    
        let sequelize
        const db = {}
        db.models = {}

        if (config.use_env_variable) {
          sequelize = new Sequelize(process.env[config.use_env_variable], config)
        } else {
          sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config
          )
        }
              
        sequelize.addHook('beforeDefine', (attributes) => {
          Object.keys(attributes).forEach((key) => {
            if (typeof attributes[key] !== 'function' && attributes[key]) {
              attributes[key].field = decamelize(key)
            }
          })
        })
      
        const dirs = []
        const moduleNames = require(dbModelPath)
        moduleNames.forEach(m => {
          dirs.push(join(modulesPath, m, '/dbmodel'))
        })
      
        for (const i in dirs) {
          const dir = dirs[i]
          fs
            .readdirSync(dir)
            .filter(file => {
              return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js' && file.slice(-7, -3) === '_sql')
            })
            .forEach(file => {
              const model = require(path.join(dir, file))(sequelize, Sequelize.DataTypes)
              db[model.name] = model
            })
        }
      
        Object.keys(db).forEach(modelName => {
          if (db[modelName].associate) {
            db[modelName].associate(db)
          }
        })
      
        let errorHandler = (err) => {
          if (err.message == "Query was empty") {
            logger.info("Query was empty, probably due to no fields updated:", err)
            return
          }
          throw err
        }
      
        sequelize.query = function() {
          return Sequelize.prototype.query.apply(this, arguments).catch(errorHandler)
        }
        db.sequelize = sequelize
        db.Sequelize = Sequelize
        return db
    }
      
    const dbLogger = function (msg) {
        logger.infoMap({ message: msg })
    }

    const ENV = process.env.NODE_ENV || 'development'
    const getConfig = (databaseName, databaseType) => {
        const configPath = path.join(config.sqlConfigPath, `./mysql_${databaseType.toLowerCase()}.js`)
        logger.info(`path -> ${configPath}`)
        if (fs.existsSync(configPath)) {
            const dbEnvConfig = require(configPath)[ENV]
            const logHandler = process.env.DB_LOGGING_ENABLED == true ? dbLogger : false

            if (databaseType.toLowerCase() === 'master') {
                const seqConfig = Object.assign({}, dbEnvConfig, {
                    logging: logHandler
                })
                return  seqConfig
            }
            return dbEnvConfig
        }
        throw new Error('Database configuration is required')
    }
    const databaseNamesConfig = process.env.DATABASE || undefined
    const databaseTypesConfig = process.env.DATABASE_CATEGORY || undefined
    if (!databaseNamesConfig || !databaseTypesConfig) {
        /* eslint-disable no-console */
        logger.error('Database env not found, disabling database.')
        /* eslint-enable no-console */
        return false
    }

    const databaseNames = databaseNamesConfig.toUpperCase().split(',')
    const databaseTypes = databaseTypesConfig.toUpperCase().split(',')
    logger.info(`${databaseNames} ${databaseTypes}`)
    const databaseConnectionObject = {}
    databaseNames.forEach((dbName) => {
        databaseConnectionObject[dbName.toLowerCase()] = {}
        databaseTypes.forEach((dbType) => {
            const dbConfig = getConfig(dbName, dbType)
            databaseConnectionObject[dbName.toLowerCase()][dbType.toLowerCase()] = sequelize({ config: dbConfig, basePath: dbConfig.basePath, modulesPath: dbConfig.modulesPath, dbModelPath: dbConfig.dbModelPath, logger: logger})
        })
    })
    return databaseConnectionObject
}
