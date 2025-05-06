import express from 'express';
import * as UserControllers from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/auth/me', verifyToken, (req, res) => { res.json({ userId: req.user.id }) })
router.post('/register', UserControllers.register);
router.get('/getUser/:userId', UserControllers.getUser);
router.delete('/deleteUser', UserControllers.deleteUser);
router.put('/updateUser', UserControllers.updateUser);
router.post('/login', UserControllers.login);
router.get('/getAllUsers', UserControllers.getAllUsers);
router.get('/getUserLoggedIn', verifyToken, UserControllers.getUserLoggedIn)

export default router;
