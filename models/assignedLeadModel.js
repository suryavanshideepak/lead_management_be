const mongoose = require('mongoose')
const Schema = mongoose.Schema

const assignedLeadSchema = new Schema({
    leadIds: [
        {
            type:mongoose.Schema.ObjectId,
            ref:'lead',
            require:true
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default:Date.now()
    },
    updated_at: {
        type: Date,
        default:Date.now()
    },
})
module.exports = mongoose.model('assignedLead',assignedLeadSchema)