const baseProperties = {
  redisCluster: [
    {
      port: 6379,
      host: process.env.REDIS_HOST
    }
  ],
  redisConfig: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    DEFAULT_REDIS_EXPIRY_TIME: process.env.DEFAULT_REDIS_EXPIRY_TIME,
    IS_REDIS_CLUSTER : process.env.IS_REDIS_CLUSTER || false,
  }
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
