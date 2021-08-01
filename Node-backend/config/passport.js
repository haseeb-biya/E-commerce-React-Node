import LocalStrategy from 'passport-local'
import mongoose from 'mongoose'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import connectDB from '../config/db.js'
import passport from 'passport'

export default function Passport (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email,
        password, done) => {
        //connectDB();
        const user = User.findOne({ email, is_Admin: true })
            .then(user => {
               
                if (!user) {
                    return done(null, false, { message: "No user Found" });
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (isMatch) {
                        return done(null, user)
                    }
                    else {
                        return done(err, false, { message: "Incorrect Password" });
                    }
                })
            })
    }));
    passport.serializeUser(function (user, done) {
       done(null,user.id) 
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
           done(err,user)
       }) 
    });
}
passport