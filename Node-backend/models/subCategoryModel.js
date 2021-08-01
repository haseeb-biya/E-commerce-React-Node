import mongoose from 'mongoose'

const subCategorySchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Category'
    },
    name: {
        type: String,
        required : true
    }
}, {
    timestamps: true
})

const SubCategory = mongoose.model('SubCategory', subCategorySchema)
export default SubCategory;