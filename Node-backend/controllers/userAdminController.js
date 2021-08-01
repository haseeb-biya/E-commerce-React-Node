import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import url from 'url';
//Routes to get all users from admin panel
const getAllAdminUser = asyncHandler(async (req, res) => {
    const getUser = await User.find({}).lean();
    res.render('users/view', {
        title: 'View/Add User',
        users:getUser
    })
});

//Route to edit user from admin Panel
const getEditUser = asyncHandler(async (req, res) => {
    const getUserById = await User.findById(req.params.id).lean();
    if (getUserById) {
        res.render('users/edit', {
            title: 'Edit User',
            user: getUserById
        })
    } else {
        req.flash("error_msg", "Invalid User Id")
        res.redirect('/user/view')
    }
})

//Post request to updare user from admin Panel
const updateUser = asyncHandler(async (req, res) => {
    let errors=[]
    if (!req.body.name) {
        errors.push({ text: "Please enter user name" });
    }
    if (!req.body.email) {
        errors.push({ text: "Please enter user email" });
    }
    if (!req.body.phone_no) {
        errors.push({text:"Please enter user phone Number"});
    }
    if (errors.length > 0) {
        res.render('users/edit', {
            title: 'Edit User',
            errors: errors,
            _id:req.params.id,
            name: req.body.name,
            email: req.body.email,
            phone_no:req.body.phone_no
        })
    } else {
        const getUser = await User.findById({ _id: req.params.id });
        if (getUser) {
            getUser.name = req.body.name || getUser.name
            getUser.email = req.body.email || getUser.email
            getUser.phone_no = req.body.phone_no || getUser.phone_no
            getUser.password = getUser.password
            await getUser.save();
            req.flash("success_msg", "User Details Update")
            res.redirect("/users/view")
        }
    }
})

//Post Request to delete user from admin Panel
const deleteUser = asyncHandler(async (req, res) => {
    const getUser = await User.findById({ _id: req.body.Id });
    if (getUser) {
        await getUser.deleteOne();
        req.flash("success_msg", "User deleted")
        res.redirect("/users/view")
    }
    else {
        req.flash("error_msg", "User not Found")
        res.redirect("/users/view")
    }
})
//Get Request to show add User Form
const addAdminUser = (req, res) => {
    res.render('users/add', {
        title: "Add User"
    });
}
const saveAdminUser = asyncHandler(async (req, res) => {

    const isExist = await User.findOne({ email:req.body.email });
    if (isExist) {
            //req.flash('error_msg', 'email already exist')
        let errors = []
        errors.push({text:"Email already Exists"})
        res.render('users/add', {
            title: "Add User",
                errors:errors,
                name: req.body.name,
                email: req.body.email,
                phone_no:req.body.phone_no
        });
    } else {
        const newUser = await User.create({
            name:req.body.name,
            email:req.body.email,
            phone_no:req.body.phone_no,
            password:req.body.password
        })
        
        req.flash("success_msg","User Added Successfully")
        res.redirect("/users/view")
    } 
});

const getAdminProfile = asyncHandler(async (req, res) => {
    const adminUser = await User.findOne({ is_Admin: true }).lean();
    res.render('users/profile', {
        title: "Edit Admin Profile",
        adminUser :adminUser 
    })
});

const updateAdminProfilePassword = asyncHandler(async (req, res) => {
    let errors = [];
    if (!req.body.opassword);
    {
        errors.push({text:"Please enter Admin Old Password"})
    }
    if (!req.body.password);
    {
        errors.push({text:"Please enter new Password"})
    }
    if (!req.body.cnpassword);
    {
        errors.push({text:"Please enter Confirm Password"})
    }
    if (req.body.password !== req.body.cnpassword) {
        errors.push({text:"Password and Confirm Password Doesn\t Match"})
    }
    
    if (errors.count > 0) {
        const user = await User.findOne({ is_Admin: true }).lean();
        res.render('admin/profile', {
            title: 'Edit Admin Details',
            errors: errors,
            adminUser:user,
        });
    } else {
        const user = await User.findOne({ is_Admin: true });
        const hashed = await bcrypt.compare(req.body.opassword, user.password)
        if(user && hashed) {
            user.password = req.body.password
            await user.save();
            req.flash('success_msg', 'Admin Password Updated');
            res.redirect('/admin/profile')
        } else {
         req.flash('error_msg', 'Old Password Doesn\'t Match');
        res.redirect('/admin/profile')
        }        
    }
    
});
const updateAdminProfile= asyncHandler(async (req, res) => {
    let errors = [];
    if (!req.body.name);
    {
        errors.push({text:"Please enter user name"})
    }
    if (!req.body.email);
    {
        errors.push({text:"Please enter user name"})
    }
    if (!req.body.phone_no);
    {
        errors.push({text:"Please enter user name"})
    }
    if (errors.count > 0) {
        res.render('admin/profile', {
            title: 'Edit Admin Details',
            errors: errors,
            _id: req.params.id,
            name: req.body.id,
            email: req.body.email,
            phone_no:req.body.phone_no
        })
    } else {
        const user = await User.findOne({ is_Admin: true });
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.phone_no = req.body.phone_no || user.phone_no
        user.password = user.password
        await user.save();
        req.flash('success_msg', 'Admin User Details Updated');
        res.redirect('/admin/profile')
    }
});
const changeUserStatus = asyncHandler(async (req, res) => {
    const queryParams = url.parse(req.url, true).query;
    const getUser = await User.findOne({ _id: req.params.id });
    if (getUser) {
        getUser.is_Active = queryParams.status;
        await getUser.save();
        if (queryParams.status) {
            req.flash("success_msg", "User Activated");
        } else {
             req.flash("success_msg", "User Deactivated");
        }
    } else {
        req.flash("error_msg", "User Not Found");
    }
    res.redirect('/users/view');
});

const getActiveUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ is_Active: true }).lean();
    res.render('users/active', {
        title: 'Active Users',
        users:users
    })
});
const getInactiveUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ is_Active: false }).lean();
    res.render('users/active', {
        title: 'Inactive Users',
        users:users
    })
});
export {
    getInactiveUsers,
    getActiveUsers,
    getAllAdminUser,
    getEditUser,
    updateUser,
    deleteUser,
    addAdminUser,
    saveAdminUser,
    getAdminProfile,
    updateAdminProfile,
    updateAdminProfilePassword,
    changeUserStatus
}