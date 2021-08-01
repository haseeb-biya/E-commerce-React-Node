import express from 'express'
const router = express.Router();
import {getProducts,getProductById, createProductReview} from '../controllers/productController.js'
router.route('/').get(getProducts);
router.route('/:id').get(getProductById)
router.route('/:id/reviews').post(createProductReview)
export default router;