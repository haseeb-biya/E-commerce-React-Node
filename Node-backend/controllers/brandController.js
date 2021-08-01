import asyncHandler from 'express-async-handler';
import Brand from '../models/brandModel.js';
import Product from '../models/productModel.js';

//Route to get all Brand
const getBrands = asyncHandler(async (req, res) => {
    const createdBrand = await Brand.find({}, { _id: 1, name: 1 }).lean()
    res.render('brand/view', {
        title: 'View Brand',
        brands: createdBrand,
    });
}); 

//Edit Brand
const editBrand=asyncHandler(async (req, res) => {
    const getBrand = await Brand.findById({ _id: req.params.id }).lean()
    if (getBrand) {
        res.render('brand/edit', {
            title: 'Edit Brand',
            brand: getBrand,
        });
    } else {
        req.flash('error_msg', 'Brand Doesn\'t exist');
        res.redirect('/brand/view');
    }
})

//Update Edited Brand
const updateEditBrand=asyncHandler(async (req, res) => {
     const getBrand = await Brand.findById( req.params.id)
    if (getBrand) {
        getBrand.name = req.body.name
        await getBrand.save();
        req.flash('success_msg','Brand Updated')
        res.redirect('/brand/view')
    }
    else {
        res.status(400);
        req.flash('error_msg', 'Something wrong happened')
        res.redirect('/brand/view')
        
    }
})

//Delete Brand
const deleteBrand=asyncHandler(async (req, res) => {
    const brand = await Brand.findById({ _id: req.body.Id });
    const products = await Product.find({ brand: req.body.Id });
    console.log(products)
    if (brand) {
        if (products) {
             await Product.deleteMany({ brand: req.body.Id })
        }
        await Brand.deleteOne({ _id: req.body.Id })
        req.flash('success_msg','Brand Deleted')
        res.redirect('/brand/view')
    } else {
        res.status(400);
        req.flash('error_msg', 'Something wrong happened')
        res.redirect('/brand/view')
    }
})
const addBrand = asyncHandler(async (req, res) => {
    let errors = []
    if (!req.body.name) {
        errors.push({text:'Please add a title'})
    }
    if (errors.length>0) {
            req.flash('error_msg', 'Please add a title')
            res.render('brand/view', {
                errors: errors,
                title:'View/Add Brand'
            })
    } else {
        const isExist = await Brand.findOne({ name: req.body.name })
        if (!isExist) {
            await Brand.create({ name: req.body.name })
            res.status(201)
            req.flash('success_msg', 'Brand created Successfully')
            res.redirect('/brand/view');
        } else {
            req.flash('error_msg', 'Brand Already exist')
            res.redirect('/brand/view')
        }
    }
});
export {getBrands,editBrand,deleteBrand,updateEditBrand,addBrand}