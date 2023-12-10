import httpStatus, { INTERNAL_SERVER_ERROR } from 'http-status'

module.exports = ({
  logger,
  config,
  CustomError,
  constants,
  response: { Fail }
}) => async (err, req, res, next) => {

  if (err) {
    const errorMesage = err.message
    if (err instanceof CustomError) {
      if (err.code === constants.SSO_ERROR.code) {
        return res.status(err.status).send(
          Object.assign(
            {
              ...errorMesage
            }
          )
        )
      }
      if (err.code === constants.INTERNAL_SERVER_ERROR.code) {
        logger.error(`Error in API ${req.url} ${JSON.stringify(req.body)}`, err)
      } else {
        logger.info(`Error in API ${req.url} ${JSON.stringify(req.body)}`, err)
      }
      return res.status(err.status).send(
        await Fail(
          Object.assign(
            {
              code: err.code,
              message: errorMesage,
              data: err.data
            },
            (config.env === 'development' || config.env === 'stage') && {
              message: errorMesage,
              stack: err.stack
            }
          )
        )
      )
    } else {
      logger.error(`Error in API ${req.url} ${JSON.stringify(req.body)}`, err)
      const response = Object.assign(
        {
          code: httpStatus.INTERNAL_SERVER_ERROR,
          type: 'InternalServerError'
        },
        (config.env === 'development' || config.env === 'stage') && {
          message: errorMesage,
          stack: err.stack
        }
      )

      res.status(INTERNAL_SERVER_ERROR).json(await Fail(response))
    }
  }
}
