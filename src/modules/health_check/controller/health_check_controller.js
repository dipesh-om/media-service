import { getService } from '../../../containerHelper'

const { Router } = require('express')
const Status = require('http-status')
const container = require('../../../container')

module.exports = () => {
  const router = Router()
  router.get('/getStatus', async (req, res, next) => {
    try {
      res.status(Status.OK).json(true)
    } catch (e) {
      next(e)
    }
  })
  return router
}
