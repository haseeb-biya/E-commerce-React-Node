import express from 'express'
const router = express.Router();
import { authUser, getUserProfile,registerUser,updateUserProfile,getAllUsers } from '../controllers/userController.js'
import protect  from '../middleware/authMiddleware.js';
router.post('/login', authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.post('/', registerUser)
router.get('/get/all', getAllUsers);

export default router;