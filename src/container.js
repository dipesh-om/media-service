import { createContainer, asFunction, asValue, Lifetime, InjectionMode } from 'awilix'

import app from './app'
import server from './interfaces/http/server'
import config from './config'
import router from './interfaces/http/router'
import constants from './constants'
import RuntimeError from './infra/support/runtimeError'
import CustomError from './infra/support/customError'
import response  from './infra/support/response'
import logger  from './infra/logging'

import errorHandlerMiddleware from './interfaces/http/middlewares/error_handler'
import userContextMiddleware from './interfaces/http/middlewares/usercontext_handler'
import loggerMiddleware from './interfaces/http/middlewares/http_logger'
import appAuthoriser from './interfaces/http/middlewares/app_authoriser'

import sequelize from './infra/connector/sequelize'
import mongoose from './infra/connector/mongoose'
const redis = require('./infra/connector/redisCaching')(config)
const InMemoryCaching = require('./infra/connector/nodeCaching')
const BaseRepository = require('./infra/sequelize/base_repository')

import appEventConsumer from './infra/kafka/app_event_consumer'
import appEventProducer from './infra/kafka/app_event_producer'
import appEventSubscriberService from './infra/kafka/app_event_subscriber_service'

const container = createContainer({
  injectionMode: InjectionMode.PROXY
})

// System
container
  .register({
    app: asFunction(app).singleton(),
    server: asFunction(server).singleton()
  })
  .register({
    logger: asFunction(logger).singleton(),
    router: asFunction(router).singleton()
  })
  .register({
    config: asValue(config),
    constants: asValue(constants)
  })

container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton(),
    errorHandlerMiddleware: asFunction(errorHandlerMiddleware),
    userContextMiddleware: asFunction(userContextMiddleware).singleton(),
    appAuthoriser: asFunction(appAuthoriser).singleton(),
  })

container
  .register({
    sequelize: asFunction(sequelize).singleton(),
    redisClient: asFunction(redis).singleton(),
    redisPubSubClient: asFunction(redis).singleton(),
    mongoose: asFunction(mongoose).singleton(),
    InMemoryCaching: asValue(InMemoryCaching),
    BaseRepository: asValue(BaseRepository),
  })

container
  .register({
    masterMysql: asValue(container.cradle['sequelize'].mysql.master),
    slaveMysql: asValue(container.cradle['sequelize'].mysql.slave),
    analysisMysql: asValue(container.cradle['sequelize'].mysql.analysis)
  })

container
  .register({
    appEventConsumer: asFunction(appEventConsumer).singleton(),
    appEventProducer: asFunction(appEventProducer).singleton(),
    appEventSubscriberService: asFunction(appEventSubscriberService).singleton(),
  })

container
  .register({
    CustomError: asFunction(CustomError).singleton(),
    RuntimeError: asFunction(RuntimeError).singleton(),
    response: asFunction(response).singleton(),
  })

container.loadModules(['modules/**/service/*.js'], {
  resolverOptions: {
    register: asFunction,
    lifetime: Lifetime.SINGLETON
  },
  cwd: __dirname
})

container.loadModules(['modules/**/repository/*.js'], {
  resolverOptions: {
    register: asFunction,
    lifetime: Lifetime.SINGLETON
  },
  cwd: __dirname
})

module.exports = container

