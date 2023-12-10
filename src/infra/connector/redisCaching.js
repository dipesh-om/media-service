var Redis = require('ioredis')
var _ = require('lodash')

module.exports = (config) => ({ logger, generalUtil }) => {

    if (!config.redisConfig) {
        logger.error('Redis config file log not found, disabling Redis.')
        return false
    }

    let client = null
    let defaultExpiryInSeconds = 60 * 60

    if (config.DEFAULT_REDIS_EXPIRY_TIME) {
        defaultExpiryInSeconds = config.DEFAULT_REDIS_EXPIRY_TIME
    }

    if (config.IS_REDIS_CLUSTER === true || config.IS_REDIS_CLUSTER === "true") {
        client = new Redis.Cluster(config.redisCluster, { slotsRefreshInterval: slotsRefreshInterval, scaleReads: 'slave' })
    } else {
        client = new Redis(config.redisConfig)
    }

    client.on('error', function (err) {
        logger.error('Redis Connection Error ', err)
    })

    const getKey = async (cacheName, key) => {
        const res = await client.get(constructKey(cacheName, key))
        if (!res || res.length === 0) {
            return null
        }
        try {
            return JSON.parse(res)
        } catch (e) {
            return null
        }
    }

    const setKey = (cacheName, key, json, expiryInSeconds) => {
        if (expiryInSeconds) {
            client.set(constructKey(cacheName, key), JSON.stringify(json), 'EX', expiryInSeconds)
        } else {
            client.set(constructKey(cacheName, key), JSON.stringify(json), 'EX', defaultExpiryInSeconds)
        }
    }

    const constructKey = (cacheName, key) =>
        (process.env.CACHE_NS) ? process.env.CACHE_NS + '_' + cacheName + '_' + key : cacheName + '_' + key

    const publish = (channel, message) => {
        client.publish(channel, message)
    }

    const subscribe = async (channels) => {
        const subscribeAuxFunction = (err, count) => {
            if (err) {
                logger.info(`Could not subscribe to redis channel`)
            } else {
                logger.info(`Successfully subscribed to channel`)
                logger.info(`Total subscribed channels on redis count ::: ${count}`)
            }
        }
        for (let i in channels) {
            await client.subscribe(channels[i], subscribeAuxFunction)
        }
    }


    const getOrSetRedis = async (cacheName, key, storeFunction, redisExpiry, forceSet) => {
        let result = forceSet ? null : await getKey(cacheName, key)
        if (result === null && storeFunction) {
            result = await storeFunction()
            if (result === null || result === undefined || _.isEmpty(result)) {
                return result
            }
            result = await generalUtil.getPlainObjects(result)
            await setKey(cacheName, key, result, redisExpiry)
        }
        return result
    }

    const getFromCache = async (cacheName, key) => {
        return getKey(cacheName, key)
    }

    const setRedisCache = async (cacheName, key, storeFunction, redisExpiry) => {
        let result = null
        if (storeFunction) {
            result = await storeFunction()
            result = await generalUtil.getPlainObjects(result)
            await setKey(cacheName, key, result, redisExpiry)
        }
        return result
    }

    const clearCache = async (cacheKey, key) => {
        return deleteKey(cacheKey, key)
    }

    return {
        constructKey,
        getKey,
        setKey,
        getFromCache,
        setRedisCache,
        clearCache,
        getOrSetRedis,
        publish,
        subscribe
    }

}