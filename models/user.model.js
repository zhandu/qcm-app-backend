import mongoose from 'mongoose'
import { isEmail, isAlphanumeric } from 'validator'
import bcrypt from 'bcryptjs'

const SALT_WORK_FACTOR = 10

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: [3, 'Le nom doit comporter au moins 3 caractères'],
        maxLength: [20, 'Le nom doit comporter au plus 20 caractères'],
        validate: [isAlphanumeric, 'Format incorrect']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Format incorrect']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'Le mot de passe doit comporter au moins 6 caractères'],
        maxLength: [20, 'Le mot de passe doit comporter au plus 20 caractères']
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
})

userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next()

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
        const hash = await bcrypt.hash(this.password, salt)
        this.password = hash
        return next()
    } catch (e) {
        return next(e)
    }
})

userSchema.methods.comparePasswords = function(candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return next(err, null)

        next(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = User