import { errorCodes } from './errorCodes'
import { events } from './events'

const redisSubscribeChannels = ['REFRESH_INMEMORY_CACHE']
const errorTypesKafka = [] // 'unhandledRejection', 'uncaughtException'
const signalTrapsKafka = ['SIGTERM', 'SIGINT', 'SIGUSR2']

module.exports = {
  ...errorCodes,
  redisSubscribeChannels,
  errorTypesKafka,
  signalTrapsKafka,
  events
}
