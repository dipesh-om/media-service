const NodeCache = require('node-cache')
class InMemoryCaching {
  // TODO : Fix this and remove use of container here
  constructor(ttlSeconds, cachingService, redisClient) {
    this.cache = new NodeCache({stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false})
    this.reloading = false
    this.cachingService = cachingService
    this.redisClient = redisClient
  }
  async checkVersion() {
    if (this.latestVersion == null || (this.lastTimeVersionChecked + 60 * 1000) < new Date().getTime()) {
      const version = await this.cachingService.getLatestVersion('GLOBAL_CACHE', 'VERSION')
      this.lastTimeVersionChecked = new Date().getTime()
      if (version !== this.latestVersion) {
        this.latestVersion = version
        return false
      }
    }
    return true
  }
  async getFromTieredCache(cacheName, key, storeFunction, redisExpiry) {
    const finalKey = this.redisClient.constructKey(cacheName, key)
    return this.get(finalKey, async () => {
      let result = await this.redisClient.getKey(cacheName, key)
      if (!result && storeFunction) {
        result = await storeFunction()
        result = result && result.dataValues ? result.get({ plain: true }) : result
        this.cache.set(finalKey, result)
        this.redisClient.setKey(cacheName, key, result, redisExpiry)
      }
      return result
    })
  }
  async populateTieredCache(cacheName, key, storeFunction, redisExpiry) {
    const finalKey = this.redisClient.constructKey(cacheName, key)
    storeFunction().then((result) => {
      this.cache.set(finalKey, result)
      this.redisClient.setkey(cacheName, key, result, redisExpiry)
      return result
    })
    return result
  }
  async get(key, storeFunction) {
    const versionCheck = await this.checkVersion()
    if (!versionCheck) {
      await this.flush()
    }
    const value = this.cache.get(key)
    if (value !== undefined) {
      if (value === 'NULL') {
        return Promise.resolve(null)
      }
      return Promise.resolve(value)
    }
    return storeFunction().then((result) => {
      this.cache.set(key, (result !== undefined)? result : 'NULL')
      return result
    })
  }
  runStoreFnIfReloadingTrue(storeFunction) {
    return storeFunction().then((result) => {
      this.cache.set(key, (result !== undefined)? result : 'NULL')
      return result
    })
  }
  put(key, value) {
    this.cache.set(key, value)
  }
  del(keys) {
    this.cache.del(keys)
  }
  delStartWith(startStr = '') {
    if (!startStr) {
      return
    }
    const keys = this.cache.keys()
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key)
      }
    }
  }
  flush() {
    return this.cache.flushAll()
  }
}
module.exports = InMemoryCaching
