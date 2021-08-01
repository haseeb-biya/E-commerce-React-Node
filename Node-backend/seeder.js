import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Category from './models/categoryModel.js';
import category from './data/category.js';
import connectDB from './config/db.js';

dotenv.config()

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        const createdCategory = await Category.insertMany(category);
        const createdUser = await User.insertMany(users);
        const adminUser = createdUser[0]._id;

        const sampleProducts = products.map(product => {

            return { ...products, user: adminUser}
        });
        console.log(sampleProducts);
        // await Product.insertMany(sampleProducts);
        console.log('Data Imported ');
    } catch (error) {
        console.error(`${error}`)
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        console.log('Data Destroy ');
    } catch (error) {
        console.error(`${error}`)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}