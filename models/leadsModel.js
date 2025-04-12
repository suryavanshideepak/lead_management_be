const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leadsSchema = new Schema({
    email: {
        type: String,
        trim: true
    },
    phone:{
        type: String,
        trim: true
    },
    altPhone:{
        type: String,
        trim: true
    },
    name:{
        type:String,
        required:true,
        trim: true
    },
    address:{
        type: String,
        trim: true
    },
    city:{
        type:String,
        trim: true
    },
    State:{
        type:String,
        trim: true
    },
    pincode:{
        type:String,
        trim: true
    },
    product:{
        type:String,
        trim:true
    },
    price:{
        type:String,
        trim:true,
        default:'2499'
    },
    quantity:{
        type:String,
        trim:true,
        default:'1'
    },
    desposition:{
        type: String,
        enum: ['New','Order Placed', 'Delivered', 'Callback', 'Ringing', 'Not Connected', 'Switch off'],   
        default: 'New'     
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
})
module.exports = mongoose.model('leads',leadsSchema)