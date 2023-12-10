import statusMonitor from 'express-status-monitor'
import { Router } from 'express'
import controller from '../utils/create_controller'
import cors from 'cors'
import cls from '../../infra/httpContext/cls'

module.exports = ({
  config, errorHandlerMiddleware, loggerMiddleware, appAuthoriser
}) => {
  const router = Router()
  if (config.env === 'development') {
    router.use(statusMonitor())
  }
  router.use(cls.middleware)
  router.use(appAuthoriser)
  router.use(
    cors({
      origin: [config.clientEndPoint],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'whjr-segment-anonymousid',
        'whjr-amplitude-sessionid',
        'whjr-ws-request-id',
        'whjr-ws-name',
        'x-app-name',
        'cjevent'
      ]
    })
  )
  const apiRouter = Router()
  apiRouter.use('/healthCheck', controller('health_check', 'health_check_controller'))
  apiRouter.use('/postContent', controller('post_content', 'post_content_controller'))
  apiRouter.use('/postContentAnalysis', controller('post_content', 'post_content_analysis_controller'))
  router.use(`/mediaService/api/v1`, apiRouter)

  router.use(`/health`, controller('health_check', 'health_check_controller'))

  router.use(loggerMiddleware)
  router.use(errorHandlerMiddleware)
  return router
}
