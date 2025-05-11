import express from 'express';
<<<<<<< HEAD
import * as UserControllers from '../controllers/user.controller.js';
=======
import * as userController from '../controllers/user.controller.js';
>>>>>>> origin/main
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

<<<<<<< HEAD
router.get('/auth/me', verifyToken, (req, res) => { res.json({ userId: req.user.id }) })
router.post('/register', UserControllers.register);
router.get('/getUser/:userId', UserControllers.getUser);
router.delete('/deleteUser', UserControllers.deleteUser);
router.put('/updateUser', UserControllers.updateUser);
router.post('/login', UserControllers.login);
router.get('/getAllUsers', UserControllers.getAllUsers);
router.get('/getUserLoggedIn', verifyToken, UserControllers.getUserLoggedIn)
=======
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:userId', userController.getUser);
router.put('/:userId',verifyToken, userController.updateUser);
router.delete('/:userId', userController.deleteUser);
router.get('/', userController.getAllUsers);
>>>>>>> origin/main

export default router;
