'use strict'
import {define} from '../../../containerHelper'

module.exports = define('postContentService', ({ constants, postContentRepository, appEventProducer, generalUtil, CustomError }) => {
 
  const createPostContent = async (postContent) => {

    let exitingPostContent = await getPostContentByPostId(postContent?.postId)
    
    if (!postContent || !postContent.postId || !postContent.content ) {  throw new CustomError(constants.INVALID_KEY.code, constants.INVALID_KEY.status, `Post Or Content Missing ! postId : ${postContent?.postId},  constent : ${postContent?.content}`) }
    if (exitingPostContent) {  throw new CustomError(constants.INVALID_KEY.code, constants.INVALID_KEY.status, 'PostId already exits or invalid ') }
    
    postContent = generalUtil.getMongoosePlainObject(await postContentRepository.createPostContent(postContent))
    await appEventProducer.publishEvent(constants.events.postContent.postContentChanged, postContent)
    return postContent
  }

  const getPostContentById = async (id) => {
    return generalUtil.getMongoosePlainObjects(postContentRepository.getPostContentById(id))
  }

  const getPostContentByPostId = async (postId) => {
    return generalUtil.getMongoosePlainObjects(postContentRepository.getPostContentByPostId( postId ))
  }

  return {
    createPostContent,
    getPostContentById,
    getPostContentByPostId
  }
  
})
