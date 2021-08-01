import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const verify = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(verify.id).select("-password");
            
            next();
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized, token failed')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not Authorized')
    }
})
export default protect;