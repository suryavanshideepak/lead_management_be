const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required:true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    role:{
        type: String,
        default:'ADMIN'
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
    isStatus:{
        type:Boolean,
        default:true
    },
    status:{
        type: String
    }
})
module.exports = mongoose.model('User',userSchema)