import { define } from '../../../containerHelper'

module.exports = define( 'postContentAnalysisService', ({ postContentAnalysisRepository, constants, InMemoryCaching, cachingService, redisClient, CustomError, postContentService, generalUtil }) => {
    const postContentAnalysisCache = new InMemoryCaching(12000, cachingService, redisClient)

    const _computePostContentAnalysis = (postContent) => {
        let wordsLengthSum = 0
        let words = postContent.content.split(" ");
        words.map(word => { wordsLengthSum += word.length })
        return { postId: postContent.postId, noOfWords: words.length, averageWordLength: wordsLengthSum/words.length }
    }

    const computeAndStorePostContentAnalysis = async (postId) => {
        const postContent = await postContentService.getPostContentByPostId(postId)
        if (!postContent) {  throw new CustomError(constants.INVALID_KEY.code, constants.INVALID_KEY.status, `Post Content Missing ! postId : ${postId}`) }

        let postContentAnalysis = _computePostContentAnalysis(postContent)
        let existingPostContentAnalysisByPostId = await getPostContentAnalysisByPostId(postId) || {}

        if (existingPostContentAnalysisByPostId?.id) {
            await postContentAnalysisRepository.updatePostContentAnalysis(postContentAnalysis, existingPostContentAnalysisByPostId?.id)
        } else {
            await postContentAnalysisRepository.createPostContentAnalysis(postContentAnalysis)
        }
        return getPostContentAnalysisByPostId(postId, true)
    }

    const getPostContentAnalysisByPostId = async (postId, forceSet = false) => {
        return redisClient.getOrSetRedis('POST_CONTENT_ANALSYS', `POST_ID_${postId}`, async () => {
            return generalUtil.getPlainObject(postContentAnalysisRepository.getPostContentAnalysisByPostId( postId ))
        }, 60*60*24, forceSet)
    }

    const getPostContentAnalysisById = async (id) => {
        return generalUtil.getPlainObject(postContentAnalysisRepository.getPostContentAnalysisById(id))
    }

    const handleEventPostContentChanged = async (eventName, data) => {
        await computeAndStorePostContentAnalysis(data.postId)
    }
    
    return {
        getPostContentAnalysisById,
        getPostContentAnalysisByPostId,
        computeAndStorePostContentAnalysis,
        handleEventPostContentChanged
    }
})
