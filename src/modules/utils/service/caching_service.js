import { define } from '../../../containerHelper'

module.exports = define('cachingService', ({ redisClient, logger }) => {
  const clearLocalCache = () => {
    return clearCache('GLOBAL_CACHE', 'VERSION')
  }

  const clearCache = async (cacheName, entityName) => {
    let obj = await redisClient.getKey(cacheName, entityName)
    if (!obj) {
      obj = { 'version': 'v1' }
    } else {
      let version = parseInt(obj.version.replace('v', ''))
      obj.version = `v${version + 1}`
    }
    await redisClient.setKey(cacheName, entityName, obj, 10 * 24 * 60 * 60) // 10 days
    return {
      message: 'Cache has been cleared successfully'
    }
  }

  const getLatestVersion = async (cacheName, entityName) => {
    const version = await redisClient.getKey(cacheName, entityName)
    if (!version) {
      return 'v1'
    } else {
      return version.version
    }
  }

  return {
    clearLocalCache,
    clearCache,
    getLatestVersion
  }
})
