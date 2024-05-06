const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const join = path.join

const _basename = path.basename
const basename = _basename(__filename)

module.exports = ({ config, logger }) => {
    try {

        const { MongoDB, modulesPath, dbModelPath } = config
        if (!MongoDB || !MongoDB.host) {
            throw new Error('Log Mongo DB config not found, disabling Log DB.')
        }
        const { host, password, user, database, poolSize, authStrategy } = MongoDB
        const protocolString = authStrategy === 'LOCAL' ? 'mongodb' : 'mongodb+srv'
        let queryString = 'retryWrites=true&w=majority&readPreference=secondaryPreferred'
        const url = `${protocolString}://${host}/${database}?${queryString}`

        const connObj = {
            url: url,
            options: {
                bufferCommands: true,
                autoIndex: false,
                dbName: database,
                useUnifiedTopology : true,
                // user: user || null,
                // pass: password || null,
                maxPoolSize: poolSize,
            }
        }

        const dirs = []
        const moduleNames = require(dbModelPath)
        moduleNames.forEach(m => {
            dirs.push(join(modulesPath, m, '/dbmodel'))
        })
    
        const mongooseConn = mongoose.createConnection(connObj.url, connObj.options)
        mongooseConn.mongoose = mongoose

        const db = {}
        for (const i in dirs) {
            const dir = dirs[i]
            fs.readdirSync(dir)
                .filter(file => {
                    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') && (file.slice(-9, -3) === '_nosql')
                })
                .forEach(file => {
                    const model = require(path.join(dir, file))(mongooseConn)
                    mongooseConn.models[model.modelName] = model
                })
        }
        
        
        // mongooseConn.models = db
        return mongooseConn

    } catch (e) {
        logger.error('Unable to connect to Log Mongo DB :  ', e)
        process.exit(0)
    }
}
