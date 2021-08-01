import mongoose from 'mongoose'

const settingSchema = mongoose.Schema({
    head_title: {
        type: String,
    },
    head_desc: {
        type: String,
    },
    footer_desc: {
        type: String,
    },
    facebook_url: {
        type: String,
    },
    insta_url: {
        type: String,
    },
    website_logo: {
        type: String,
    },
    support_email: {
        type: String,
    },
    support_contact: {
        type: String,
    },
    about_website: {
        type: String,
    }
}, {
    timestamps: true
})
const Setting = mongoose.model('Setting', settingSchema)
export default Setting;