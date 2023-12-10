import { define } from '../../../containerHelper'

module.exports = define('postContentRepository', ({ mongoose }) => {

    const postContentSchema = mongoose.base.Schema({
        content: {
            type: String,
            required: true
        },
        postId: {
            type: String,
            allowNull: false,
            unique: true
        },
        recordStatus: { // 1 or 0
            type: Number,
            defaultValue: 1
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
    }, { timestamps: true })

    postContentSchema.index({ _id: 1 }, { unique: true, name: 'primary_id' })
    postContentSchema.index({ postId: 1 }, { unique: true, name: 'post_id' })

    const postContentInfoModel = mongoose.model('post_content', postContentSchema)
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

