import express from 'express'
const router = express.Router();

import { getCategories} from '../controllers/categoryController.js'
import protect  from '../middleware/authMiddleware.js';
router.route('/get').get(getCategories)

export default router