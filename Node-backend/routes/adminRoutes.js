import express from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler';
import Setting from '../models/settingModel.js';
import { getCategories, editCategory, deleteCategory, updateEditCategory, addCategory } from '../controllers/categoryController.js'
import { getSubCategories, editSubCategory, deleteSubCategory, updateSubCategory, addSubCategory,saveSubCategory } from '../controllers/subCategoryController.js'
import { getBrands, editBrand, deleteBrand, updateEditBrand, addBrand } from '../controllers/brandController.js'
import {
  getAllAdminUser,
  getEditUser,
  updateUser,
  deleteUser,
  addAdminUser,
  saveAdminUser,
  getAdminProfile,
  updateAdminProfilePassword,
  updateAdminProfile,
  changeUserStatus,
  getActiveUsers,
  getInactiveUsers
} from '../controllers/userAdminController.js';
import { getProductsAdmin,deleteProductFromAdmin,updateProductFromAdmin,editProductFromAdmin,addProductFromAdmin,saveProductFromAdmin,getSubCategory} from '../controllers/productController.js'
import { viewSettings,updateSettings  } from '../controllers/adminSettingsController.js';
import {
  getAdminOrders,
  getSingleOrderDetails,
  // getProcessingOrderDetails,
  // getShippingOrderDetails,
  getDeliveredOrderDetails,
  getFailedOrderDetails,
  getCancelledOrderDetails,
  cancelOrderAdmin,
  saveOrderStatus,
  editOrderStatus,
  assignTrackingOrder,
  saveTrackingOrder,
  viewTrackingOrder
} from '../controllers/orderController.js'
import ensureAuthentication from '../utils/auth.js'
import User from '../models/userModel.js'
import Category from '../models/categoryModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'

const router = express.Router();
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'public/img/uploads');
  },
  filename: function (request, file, callback) {
    console.log(file);
    callback(null, file.originalname)
  }
});
const upload = multer({ storage: storage })
//Middleware to get Admin Panel Website image
router.use(asyncHandler(async (req, res, next) => {
  const admin_image = await Setting.findOne().lean();
  res.locals.admin_image = admin_image.website_logo;
  if (req.user){
    res.locals.username = req.user.name
 }
  next();
}))

//Dashboard Route
const dashboard = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const productCount = await Product.countDocuments();
  const categoryCount = await Category.countDocuments();
  const orderCount = await Order.countDocuments();
  const activeCount = await User.countDocuments({ is_Active: true });
  const inactiveCount = await User.countDocuments({ is_Active: false });
      res.render('home', {
        title: 'Dashboard',
        userCount: userCount,
        productCount: productCount,
        categoryCount: categoryCount,
        orderCount: orderCount,
        activeCount: activeCount,
        inactiveCount: inactiveCount,
        
    });
});
router.get('/',ensureAuthentication,dashboard);



//CRUD for Category
router.get('/category/view', ensureAuthentication,getCategories);
router.post('/add/category',ensureAuthentication,addCategory)
router.get('/edit/category/:id',ensureAuthentication, editCategory);
router.post('/edit/category/:id',ensureAuthentication,updateEditCategory);
router.post('/delete/category', ensureAuthentication,deleteCategory);

//CRUD for sub category
router.get('/subcategory/view', ensureAuthentication,getSubCategories);
router.get('/subcategory/add', ensureAuthentication,addSubCategory);
router.post('/subcategory/add', ensureAuthentication,saveSubCategory);
router.get('/subcategory/edit/:id', ensureAuthentication,editSubCategory);
router.post('/subcategory/edit/:id', ensureAuthentication,updateSubCategory);
router.post('/subcategory/delete', ensureAuthentication,deleteSubCategory);

//CRUD for users
router.get('/users/view',ensureAuthentication, getAllAdminUser);
router.get('/users/add',ensureAuthentication, addAdminUser)
router.post('/users/add',ensureAuthentication,saveAdminUser)
router.get('/users/edit/:id', ensureAuthentication,getEditUser);
router.post('/users/edit/:id', ensureAuthentication,updateUser);
router.post('/users/delete',ensureAuthentication, deleteUser);
router.get('/users/status/:id?',ensureAuthentication, changeUserStatus);
router.get('/users/active',ensureAuthentication, getActiveUsers);
router.get('/user/inactive',ensureAuthentication, getInactiveUsers);

//CRUD for products
router.get('/products/view',ensureAuthentication, getProductsAdmin);
router.post('/delete/product', ensureAuthentication,deleteProductFromAdmin);
router.get('/product/add', ensureAuthentication,addProductFromAdmin);
router.post('/product/get-sub-category',ensureAuthentication, getSubCategory);
router.post('/product/add',ensureAuthentication,upload.array('product_image',10),saveProductFromAdmin)
router.get('/product/edit/:id',ensureAuthentication, editProductFromAdmin);
router.post('/product/edit/:id',ensureAuthentication,upload.array('product_image',10),updateProductFromAdmin)

//Website CRUD Settings
router.get('/admin/settings', ensureAuthentication,viewSettings)
router.post('/admin/settings', ensureAuthentication,upload.single('website_logo'), updateSettings)

//Admin Profile
router.get('/admin/profile', ensureAuthentication,getAdminProfile);
router.post('/users/admin/edit/password/:id', ensureAuthentication,updateAdminProfilePassword);
router.post('/users/admin/edit/:id', ensureAuthentication,updateAdminProfile);


//CRUD for Brand
router.get('/brand/view', ensureAuthentication,getBrands);
router.post('/add/brand',ensureAuthentication,addBrand)
router.get('/edit/brand/:id',ensureAuthentication, editBrand);
router.post('/edit/brand/:id',ensureAuthentication,updateEditBrand);
router.post('/delete/brand', ensureAuthentication,deleteBrand);

//Routes for Products
router.get('/orders/view',ensureAuthentication, getAdminOrders);
router.get('/order/view/details/:id',ensureAuthentication, getSingleOrderDetails);
// router.get('/order/processing/view', getProcessingOrderDetails);
// router.get('/order/shipping/view', getShippingOrderDetails);
router.get('/order/delivered/view',ensureAuthentication, getDeliveredOrderDetails);
router.get('/order/failed/view',ensureAuthentication, getFailedOrderDetails);
router.get('/order/cancel/view',ensureAuthentication, getCancelledOrderDetails);
router.get('/order/cancel/:id',ensureAuthentication, cancelOrderAdmin);
router.get('/order/status/:id', ensureAuthentication,editOrderStatus);
router.post('/order/status/:id', ensureAuthentication,saveOrderStatus);
router.get('/order/assign/tracking/:id',ensureAuthentication, assignTrackingOrder);
router.post('/order/assign/tracking/:id',ensureAuthentication, saveTrackingOrder);
router.get('/order/view/tracking', ensureAuthentication,viewTrackingOrder);

router.get('/logout',ensureAuthentication, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged Out!');
  res.redirect('/login');
})

export default router