import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        if (user.is_Active) {
           res.json({
            _id:user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token:generateToken(user._id)
         }) 
        } else {
            res.status(401)
        throw new Error("User Account is Block. Contact Support!!")
        }
        
    } else {
        res.status(401)
        throw new Error("Invalid Email or Password")
     }
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id:user.id,
            name: user.name,
            email: user.email,
            phone_no:user.phone_no,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404);
        throw new Error('User Not Found');
    }
});
const registerUser = asyncHandler(async (req, res) => {
    const { email, name, password, phone_no } = req.body
    const isExist = await User.findOne({ email });
    if (isExist){
        res.status(400)
        throw new Error('User already exist')
    }
    const user = await User.create({
        name,
        email,
        password,
        phone_no
    });
    
    if (user) {
        res.status(201).json({
            _id:user.id,
            name: user.name,
            email: user.email,
            phone_no:user.phone_no,
            isAdmin: user.isAdmin,
            token:generateToken(user._id)
         })
    } else {
        res.status(400);
        throw new Error("Invalid user data")
    }
});
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.phone_no = req.body.phone_no || user.phone
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
            _id:updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone_no:updatedUser.phone_no,
            isAdmin: updatedUser.isAdmin,
            token:generateToken(updatedUser._id)
         })

    } else {
        res.status(404);
        throw new Error('User Not Found');
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    const getUsers = await User.find({});
    if (getUsers) {
        res.status(201).json(getUsers)
    }
    else {
        res.status(400);
        throw new Error('No User Found');
    }
})

const getAllUsersAdmin = asyncHandler(async (req, res) => {
    const getUsers = await User.find({}).lean();
    if (getUsers) {
        res.render('users/view', {
            title:'View/Add Users',
            users:getUsers
        })
    }
    else {
        res.status(400);
        throw new Error('No User Found');
    }
})
export {authUser,getUserProfile,getAllUsersAdmin,registerUser,updateUserProfile,getAllUsers}