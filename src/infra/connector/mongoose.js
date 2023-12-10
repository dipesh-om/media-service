const mongoose = require('mongoose')

module.exports = ({config, logger}) => {
    try {
        
        const { MongoDB } = config
        if (!MongoDB || !MongoDB.host) {
            throw new Error('Log Mongo DB config not found, disabling Log DB.')
        }

        const { host, password, user, database, poolSize, authStrategy } = config.MongoDB
        const protocolString = authStrategy === 'LOCAL' ? 'mongodb' : 'mongodb+srv'
        let queryString = 'retryWrites=true&w=majority&readPreference=secondaryPreferred'
        const url = `${protocolString}://${host}/${database}?${queryString}`

        const connObj = {
            url: url,
            options: {
                bufferCommands: true,
                autoIndex: false,
                dbName: database,
                user: user || null,
                pass: password || null,
                maxPoolSize: poolSize,
            }
        }
        
        return mongoose.createConnection(connObj.url, connObj.options)
    } catch (e) {
        logger.error('Unable to connect to Log Mongo DB :  ', e)
        process.exit(0)
    }
}
