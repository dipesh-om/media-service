'use strict'

module.exports = (mongoose) => {

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

    const postContentModel = mongoose.model('post_content', postContentSchema)

  return postContentModel

}
