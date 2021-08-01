import mongoose from 'mongoose'

const trackingSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Order'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    name: {
        type: String,
        required : true
    },
    trackingId: {
        type: String,
        required:true
    }
}, {
    timestamps: true
})

const Tracking = mongoose.model('Tracking', trackingSchema)
export default Tracking;