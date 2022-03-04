import mongoose from 'mongoose'
import { JWT_REFRESH_EXPIRATION_TIME } from '../config/auth.config'
import {v4 as uuidv4} from 'uuid'

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    expiryDate: {
        type: Date,
        required: true
    }
})

refreshTokenSchema.statics.createToken = async function(user) {
    const expiredAt = new Date()
    expiredAt.setSeconds(
        expiredAt.getSeconds() + JWT_REFRESH_EXPIRATION_TIME
    )
    const token = uuidv4()
    const object = new this({
        token,
        user: user._id,
        expiryDate: expiredAt.getTime()
    })
    return await object.save()
}

refreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < (new Date).getTime()
}

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

module.exports = RefreshToken