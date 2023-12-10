'use strict'

const { Router } = require('express')
const container = require('../../../container')

module.exports = () => {
  const router = Router()
  const {
    response: {
      Success
    },
    userContextMiddleware,
    postContentAnalysisService,
  } = container.cradle

  router.use(userContextMiddleware)

  router.get('/:id', async (req, res, next) => {
    try{
      const postContent = await postContentAnalysisService.getPostContentAnalysisById(req.params.id)
      res.status(200).json(await Success(postContent))
    } catch (e) {
      next(e)
    }
  })

  router.get('/postId/:postId', async (req, res, next) => {
    try{
      const postContent = await postContentAnalysisService.getPostContentAnalysisByPostId(req.params.postId)
      res.status(200).json(await Success(postContent))
    } catch (e) {
      next(e)
    }
  })

  router.post('/computeAndStore', async (req, res, next) => {
    try{
      const postContent = await postContentAnalysisService.computeAndStorePostContentAnalysis(req.body.postId)
      res.status(200).json(await Success(postContent))
    } catch (e) {
      next(e)
    }
  })
  
  return router
}
