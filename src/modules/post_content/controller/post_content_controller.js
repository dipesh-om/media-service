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
    postContentService,
  } = container.cradle

  router.use(userContextMiddleware)

  router.get('/:id', async (req, res, next) => {
    try{
      const postContent = await postContentService.getPostContentById(req.params.id)
      res.status(200).json(await Success(postContent))
    } catch (e) {
      next(e)
    }
  })

  router.get('/postId/:postId', async (req, res, next) => {
    try{
      const postContent = await postContentService.getPostContentByPostId(req.params.postId)
      res.status(200).json(await Success(postContent))
    } catch (e) {
      next(e)
    }
  })

  router.post('/posts', async (req, res, next) => {
    try{
      const postContent = await postContentService.createPostContent(req.body)
      res.status(200).json(await Success(postContent))
    } catch (e) {
      next(e)
    }
  })
  
  return router
}
