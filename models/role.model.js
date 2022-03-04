import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: {
            values: ['user', 'admin'],
            message: "Le rôle {VALUE} n'existe pas"
        }
    }
})

roleSchema.set('toJSON', {transform: function (doc, ret) {
    return ret.name;
}})

const Role = mongoose.model('Role', roleSchema)

module.exports = Role