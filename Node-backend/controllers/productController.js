import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import SubCategory from '../models/subCategoryModel.js';
import Brand from '../models/brandModel.js';
import mongoose from 'mongoose';
import fs from 'fs';
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});


const getProductsAdmin = asyncHandler(async (req, res) => {
    const productQuery = await Product.aggregate([
        {
            "$lookup": {
                "from": Category.collection.name,
                "localField": "category",
                "foreignField": "_id",
                "as": "category"
            }
        },
        {
            "$unwind": "$category"
        },
        {
            "$lookup": {
                "from": Brand.collection.name,
                "localField": "brand",
                "foreignField": "_id",
                "as": "brand"
            }
        },
        {
            "$unwind": "$brand"
        },
    ]);
    res.render('products/view', {
        title: 'View/Add Products',
        products:productQuery 
    })
});


const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product);
    } else {
        res.status(404)
        throw new Error("Product not Found");
    }
});

const deleteProductFromAdmin = asyncHandler(async (req, res) => {
    const getProduct = await Product.findById({ _id: req.body.Id });
    if (getProduct) {
        await Product.deleteOne({ _id: req.body.Id })
        req.flash('success_msg', 'Product Deleted Successfully');
    } else {
        req.flash('error_msg', 'Product Not Found');   
    }
    res.redirect('/products/view')
});

const addProductFromAdmin = asyncHandler(async(req, res) => {
    const categories = await Category.find({}).lean();
    const brands = await Brand.find({}).lean();
    res.render('products/add', {
        title: 'Add Product',
        categories: categories,
        brands:brands
    });
})
const saveProductFromAdmin = asyncHandler(async (req, res) => {
    let images = []
    req.files.forEach(element => {
        const image = {
            filename: element.filename,
            path:element.path
        }
        images.push(image)
    })
  
    await Product.create({
        name: req.body.name,
        user:'5fdeef4a4f51b66b252139fc',
        description: req.body.description,
        category: req.body.category,
        brand: req.body.brand,
        subcategory: req.body.subcategory,
        price: req.body.price,
        countInStock: req.body.countInStock,
        image: images
    });
    req.flash('success', 'Product Added Successfully');
    res.redirect('/products/view')
})
const getSubCategory = asyncHandler(async (req, res) => {
    let getSubCategory = [];
    if (req.body.id) {
        const getSubCategory = await SubCategory.find({ category: req.body.id }, { _id: 1, name: 1 }).lean();
        res.status(201).jsonp(getSubCategory)
    }
    res.status(201).jsonp(getSubCategory)
})
const updateProductFromAdmin = asyncHandler(async (req, res) => {
   
    const getProduct = await Product.findById(req.params.id)
    console.log(getProduct);
    if (req.files.length > 0) {
        console.log("Files include")
        getProduct.name = req.body.name || getProduct.name
        getProduct.description = req.body.description || getProduct.description
        getProduct.category = req.body.category || getProduct.category
        getProduct.subcategory = req.body.subcategory || getProduct.subcategory
        getProduct.brand = req.body.brand || getProduct.brand
        getProduct.price = req.body.price || getProduct.price
        getProduct.countInStock = req.body.countInStock || getProduct.countInStock
        let images = []
        req.files.forEach(element => {
            const image = {
                filename: element.filename,
                path: element.path
            }
            images.push(image)
        });
        if (getProduct.image.length > 0) {
            getProduct.image.forEach(element => {
                const path='./public/img/uploads/' + element.filename
                fs.unlinkSync(path);
            })
        }
        getProduct.image = images;
         await getProduct.save();
    } else {
        console.log("files exclude");
        getProduct.name = req.body.name || getProduct.name
        getProduct.description = req.body.description || getProduct.description
        getProduct.category = req.body.category || getProduct.category
        getProduct.subcategory = req.body.subcategory || getProduct.subcategory
        getProduct.brand = req.body.brand || getProduct.brand
        getProduct.price = req.body.price || getProduct.price
        getProduct.countInStock = req.body.countInStock || getProduct.countInStock
        await getProduct.save();
    }
    req.flash('success_msg', 'Product Details Updated')
    res.redirect('/products/view');
});
const editProductFromAdmin = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const productQuery = await Product.aggregate([
        {
            "$match": {
            '_id':mongoose.Types.ObjectId(id)      
            },
        },
        {
            "$lookup": {
                "from": Category.collection.name,
                "localField": "category",
                "foreignField": "_id",
                "as": "category"
            }
        },
        {
            "$unwind": "$category"
        },
        {
            "$lookup": {
                "from": Brand.collection.name,
                "localField": "brand",
                "foreignField": "_id",
                "as": "brand"
            }
        },
        {
            "$unwind": "$brand"
        },
        {
            "$lookup": {
                "from": SubCategory.collection.name,
                "localField": "subcategory",
                "foreignField": "_id",
                "as": "subcategory"
            }
        },
        {
            "$unwind": "$subcategory"
        },
    ]);
    
    const categories = await Category.find({}).lean();
    const brands = await Brand.find({}).lean();
    const subcategory = await SubCategory.find({}).lean();
        res.render('products/edit', {
        title: 'Edit Product',
        id:id,
        categories: categories,
        brand: brands,
        subcategory: subcategory,
        product:productQuery,
    });
})

const createProductReview = asyncHandler(async (req, res) => {
    const {
        rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        const alreadyReview = products.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyReview) {
            res.status(400)
            throw new Error('Product Already Review')
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user:req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.review.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)
            / product.reviews.length
        await product.save();
        res.status(201).json({message:'Review Added'})
    } else {
        res.status(400)
        throw new Error('Product not Found');
    }
})


export {
    getProducts,
    updateProductFromAdmin,
    editProductFromAdmin,
    getSubCategory,
    getProductById,
    getProductsAdmin,
    deleteProductFromAdmin,
    addProductFromAdmin,
    saveProductFromAdmin,
    createProductReview
}