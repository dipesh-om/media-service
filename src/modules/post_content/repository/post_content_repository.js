import { define } from '../../../containerHelper'

module.exports = define('postContentRepository', ({ mongoose }) => {

    const postContentInfoModel = mongoose.models['post_content']

    const createPostContent = async (query) => {
        query.recordStatus = 1
        return postContentInfoModel.create(query)
    }

    const getPostContentById = async (id) => {
        return postContentInfoModel.findOne({ _id: id, recordStatus: 1 })
    }

    const getPostContentByPostId = async (postId) => {
        return postContentInfoModel.findOne({ postId: postId, recordStatus: 1 })
    }

    const getPostContent = async (query) => {
        return postContentInfoModel.find(query)
    }

    return {
        createPostContent,
        getPostContentById,
        getPostContentByPostId,
        getPostContent
    }
})

