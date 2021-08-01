import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    phone_no: {
        type: Number,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    is_Admin: {
        type: Boolean,
        required: true,
        default:false
    },
    is_Active: {
        type: Boolean,
        required: true,
        default:true
    }

}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password =await bcrypt.hash(this.password,salt)
})
const User = mongoose.model('User', userSchema)
export default User;