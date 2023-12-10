const ramda = require('ramda')
const assoc = ramda.assoc
const httpContext = require('../httpContext/cls')

module.exports = ({ config, InMemoryCaching, cachingService, redisClient }) => {
  const metaCache = new InMemoryCaching(36000, cachingService, redisClient)

  const getClientMeta = async () => {
    const clientKey = httpContext.get('client')
    if (clientKey) {
      return {
        name: clientKey,
      }
    }
    return null
  }

  const defaultResponse = async (success = true) => {
    return {
      success,
      version: config.version,
      date: new Date(),
      clientMeta: await getClientMeta()
    }
  }

  const Success = async (data) => {
    return assoc(
      'data',
      data,
      await defaultResponse(true)
    )
  }

  const Fail = async (data) => {
    return assoc(
      'error',
      data,
      await defaultResponse(false)
    )
  }

  return {
    Success,
    Fail
  }
}
