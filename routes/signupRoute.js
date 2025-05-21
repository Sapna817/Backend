import express from "express";
import createUser from "../controllers/usersControllers.js";
import upload from '../middlewares/multer.js';
import verifyToken from '../middlewares/verifyToken.js';
import User from "../models/User.js";

const router = express.Router();

router.post('/signup', upload.single('profilePic'), createUser);

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-Password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
