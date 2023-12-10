const express = require('express')
const pkg = require('../../../package.json')
module.exports = ({ config, router, logger, healthCheckService }) => {
  const app = express()
  // Add headers
  app.disable('x-powered-by')
  app.use(express.json({limit: '50mb'}));
  app.use(router)
  app.use(express.static('public'))
  function handleShutdown(signal) {
    logger.info(`Received ${signal}`);
    logger.info(healthCheckService.getState())
    process.exit(1)
  }

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);

  return {
    app,
    start: () =>
        new Promise(resolve => {
          const http = app.listen(config.port, () => {
            const { port } = http.address()
            logger.info(`🤘 API === Port ${port}`)
            // process.send('ready')
          })
          //logger.info(`🤘 API === Timeout ${http.keepAliveTimeout}`)
          http.keepAliveTimeout = 100000
          //logger.info(`🤘 API === Timeout ${http.keepAliveTimeout}`)
          return resolve(http)
        })
  }
}
