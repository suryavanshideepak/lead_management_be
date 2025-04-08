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
    name:{
        type:String,
        required:true
    },
    role:{
        type: String,
        default:'ADMIN'
    },
    encryptedPassword:{
        type: String
    },
    created_at: {
        type: Date,
        default:Date.now()
    },
    updated_at: {
        type: Date,
        default:Date.now()
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