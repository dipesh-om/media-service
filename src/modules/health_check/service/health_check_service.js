import { define } from '../../../containerHelper'
const _ = require('lodash')
const ip = require('ip')
const HEALTH_CHECK = 'healthCheck'

module.exports = define('healthCheckService', ({ redisClient }) => {
  let serverState = 'ACTIVE'
  let cacheKey = ip.address()
  redisClient.setKey(HEALTH_CHECK, cacheKey, { serverState: serverState }, 600000)
  const pkg = require('../../../../package.json')
  const getState = async () => {
    let currentServerStatus = await redisClient.getKey(HEALTH_CHECK, cacheKey)
    if (_.isEmpty(currentServerStatus)) {
      currentServerStatus = { serverState: serverState }
      redisClient.setKey(HEALTH_CHECK, cacheKey, currentServerStatus, 600000)
    }
    let healthCheckResponse = {
      status: currentServerStatus.serverState,
      version: pkg.version
    }
    return healthCheckResponse
  }
  return {
    getState
  }
})
