import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

//Route to get all category
const getCategories = asyncHandler(async (req, res) => {
    const createdCategory = await Category.find({}, { _id: 1, name: 1 }).lean()
    res.render('category/view', {
        title: 'View Category',
        categories: createdCategory,
    });
}); 

//Edit Category
const editCategory=asyncHandler(async (req, res) => {
    const getCategory = await Category.findById({ _id: req.params.id }).lean()
    if (getCategory) {
        res.render('category/edit', {
            title: 'Edit Category',
            category: getCategory,
        });
    } else {
        req.flash('error_msg', 'Category Doesn\'t exist');
        res.redirect('/category/view');
    }
})

//Update Edited Category
const updateEditCategory=asyncHandler(async (req, res) => {
     const getCategory = await Category.findById( req.params.id)
    if (getCategory) {
        getCategory.name = req.body.name
        const saveCategory = await getCategory.save();
        req.flash('success_msg','Category Updated')
        res.redirect('/category/view')
    }
    else {
        res.status(400);
        req.flash('error_msg', 'Something wrong happened')
        res.redirect('/category/view')
        
    }
})

//Delete Category
const deleteCategory=asyncHandler(async (req, res) => {
    const category = await Category.findById({ _id: req.body.Id });
    const products = await Product.find({ category: req.body.Id });
    if (category) {
        if (products) {
            await Product.deleteMany({ category: req.body.Id })
        }
        await Category.deleteOne({ _id: req.body.Id })
        req.flash('success_msg','Category Deleted')
        res.redirect('/category/view')
    } else {
        res.status(400);
        req.flash('error_msg', 'Something wrong happened')
        res.redirect('/category/view')
    }
})
const addCategory = asyncHandler(async (req, res) => {
    let errors = []
    if (!req.body.name) {
        errors.push({text:'Please add a title'})
    }
    if (errors.length>0) {
            req.flash('error_msg', 'Please add a title')
            res.render('category/view', {
                errors: errors,
                title:'View/Add Category'
            })
    } else {
        const isExist = await Category.findOne({ name: req.body.name })
        if (!isExist) {
            await Category.create({ name: req.body.name })
            res.status(201)
            req.flash('success_msg', 'Category created Successfully')
            res.redirect('/category/view');
        } else {
            req.flash('error_msg', 'Category Already exist')
            res.redirect('/category/view')
        }
    }
});
export {getCategories,editCategory,deleteCategory,updateEditCategory,addCategory}