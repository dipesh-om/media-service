/**
 * We want to start here so we can manage other infrastructure
 * express server
 */

const app_event_consumer = require("../infra/kafka/app_event_consumer")
const app_event_producer = require("../infra/kafka/app_event_producer")

module.exports = ({ masterMysql, redisPubSubClient, constants, server, logger, appEventProducer,  appEventSubscriberService, appEventConsumer }) => {
  return {
    start: () => {
      let p = Promise
        .resolve()
        .then(result => masterMysql.sequelize.authenticate())
        .then(result => redisPubSubClient.subscribe(constants.redisSubscribeChannels))
        .then(result => appEventProducer.init())
        .then(result => appEventSubscriberService.init())
        .then(result => appEventConsumer.init())
        .then(result => appEventProducer.init())
        .then(result => server.start())
      return p
    },
    logger: logger
  }
}
