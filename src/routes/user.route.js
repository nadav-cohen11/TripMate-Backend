import express from 'express';
import * as UserControllers from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import * as HotelsController from '../controllers/hotels.controller.js'

const router = express.Router();


router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);
router.put('/:userId',verifyToken, UserControllers.updateUser);
router.delete('/:userId', UserControllers.deleteUser);
router.get('/location', verifyToken, UserControllers.getUserLocation);
router.get('/usersLocations', UserControllers.getUserLocations);
router.get('/auth/check', verifyToken, (req, res) => {
    res.status(200).json({ userId: req.user.id });
});
  

export default router;
