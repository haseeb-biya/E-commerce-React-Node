import express from 'express'
const router = express.Router();
import { saveOrderItems,getOrderById,updateOrderToPaid,getMyOrders} from '../controllers/orderController.js'
import protect  from '../middleware/authMiddleware.js';
router.route('/').post(protect,saveOrderItems);
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/get/myorders').get(protect,getMyOrders)

export default router