import { define } from '../../../containerHelper'

module.exports = define('postContentAnalysisRepository', ({ masterMysql, slaveMysql, constants, BaseRepository }) => {

  const postContentAnalysisMasterModel = masterMysql['post_content_analysis']
  const postContentAnalysisModel = slaveMysql['post_content_analysis']

  const createPostContentAnalysis = (postContentAnalysis) =>
    postContentAnalysisMasterModel.create(postContentAnalysis)

  const updatePostContentAnalysis = (postContentAnalysis, postContentAnalysisId) =>
    postContentAnalysisMasterModel.update(postContentAnalysis, {
      where: { id: postContentAnalysisId, recordStatus : 1 }
    })

  const getPostContentAnalysisById = (postContentAnalysisId) =>
    postContentAnalysisModel.findOne({
      where: {
        id: postContentAnalysisId,
        recordStatus : 1
      }
    })

  const getPostContentAnalysisByPostId = (postId) =>
    postContentAnalysisModel.findOne({ 
      where: { 
        postId: postId,
        recordStatus : 1
      }
    })



  return {
    createPostContentAnalysis,
    getPostContentAnalysisById,
    getPostContentAnalysisByPostId,
    updatePostContentAnalysis
  }
})
