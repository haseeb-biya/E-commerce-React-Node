import asyncHandler from 'express-async-handler';
import SubCategory from '../models/subCategoryModel.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
//Route to get all category
const getSubCategories = asyncHandler(async (req, res) => {
    const createdSubCategory = await SubCategory.find({}, { _id: 1, name: 1 })
        .populate('category', 'name', Category).lean()
    res.render('subcategory/view', {
        title: 'View SubCategory',
        subcategories: createdSubCategory,
    });
}); 

//Edit Category
const editSubCategory=asyncHandler(async (req, res) => {
    const getSubCategory = await SubCategory.findById({ _id: req.params.id })
        .populate('category', 'name', Category).lean()
    const getCategories = await Category.find({}).lean();
    if (getSubCategory) {
        res.render('subcategory/edit', {
            title: 'Edit Sub Category',
            subcategory: getSubCategory,
            categories:getCategories
        });
    } else {
        req.flash('error_msg', 'Sub-Category Doesn\'t exist');
        res.redirect('/subcategory/view');
    }
})

//Update Edited Category
const updateSubCategory=asyncHandler(async (req, res) => {
     const getSubCategory = await SubCategory.findById( req.params.id)
    if (getSubCategory) {
        getSubCategory.category = req.body.parent_category||getSubCategory.category
        getSubCategory.name = req.body.name
        await getSubCategory.save();
        req.flash('success_msg','Sub-Category Updated')
        res.redirect('/subcategory/view')
    }
    else {
        res.status(400);
        req.flash('error_msg', 'Something wrong happened')
        res.redirect('/subcategory/view')
        
    }
})

//Delete Category
const deleteSubCategory=asyncHandler(async (req, res) => {
    const subCategory = await SubCategory.findById({ _id: req.body.Id });
    const products = await Product.find({ subcategory: req.body.Id });
    if (subCategory) {
        if (products) {
            await Product.deleteMany({ subcategory: req.body.Id })
        }
        await subCategory.deleteOne({ _id: req.body.Id })
        req.flash('success_msg','Sub Category Deleted')
        res.redirect('/subcategory/view')
    } else {
        res.status(400);
        req.flash('error_msg', 'Something wrong happened')
        res.redirect('/subcategory/view')
    }
})
const saveSubCategory = asyncHandler(async (req, res) => {
    let errors = []
    if (!req.body.name) {
        errors.push({text:'Please add a title'})
    }
    if (!req.body.parent_category) {
        errors.push({text:'Please Select a valid Parent Category'})
    }
    if (errors.length>0) {
            req.flash('error_msg', 'Please add a title')
            res.render('subcategory/add', {
                errors: errors,
                title:'Add Sub Category'
            })
    } else {
        const isExist = await SubCategory.findOne({ name: req.body.name })
        if (!isExist) {
            await SubCategory.create({
                name: req.body.name,
                category: req.body.parent_category
            })
            res.status(201)
            req.flash('success_msg', 'Sub Category created Successfully')
            res.redirect('/subcategory/view');
        } else {
            req.flash('error_msg', 'Sub Category Already exist')
            res.redirect('/subcategory/view')
        }
    }
});
const addSubCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).lean();
    //console.log(categories);
    res.render('subcategory/add', {
        title: 'Add Sub Category',
        categories:categories
    })
});
export {getSubCategories,addSubCategory,editSubCategory,deleteSubCategory,updateSubCategory,saveSubCategory}