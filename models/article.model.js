import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: [3, 'Le titre doit comporter au moins 3 caractères'],
        maxLength: [50, 'Le titre doit comporter au plus 50 caractères'],
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'Un article doit comporter au moins 10 caractères'],
        maxLength: [3000, 'Un article doit comporter au plus 3000 caractères'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: [
        {
            type: String,
            required: false,
            minLength: [2, 'Un tag doit comporter au moins 2 caractères'],
            maxLength: [20, 'Le titre doit comporter au plus 20 caractères'],
        }
    ],
    publicationDate: {
        type: Date,
        required: false
    },
    revisionDate: {
        type: Date,
        required: false
    }
})

articleSchema.set('toJSON', {transform: function (doc, ret) {
    delete ret.__v
    return ret
}})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article