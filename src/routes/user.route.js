import express from 'express';
import * as UserControllers from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/getUser', verifyToken, UserControllers.getUser);
router.get('/getUserWithReviews', verifyToken, UserControllers.getUserWithReviews);
router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);
router.post('/logout', UserControllers.logout);
router.put('/updateUser', verifyToken, UserControllers.updateUser);
router.get('/location', verifyToken, UserControllers.getUserLocation);
router.get('/getUserByEmail', UserControllers.getUserByEmail);
router.get('/usersLocations', UserControllers.getUserLocations);
router.get('/auth/check', verifyToken, (req, res) => {
    res.status(200).json({ userId: req.user.id });
});
router.get('/getGroupChats', verifyToken, UserControllers.getAllGroupChats)

router.get('/:userId', verifyToken, UserControllers.getUserById);
router.delete('/:userId', verifyToken, UserControllers.deleteUser);

export default router;
