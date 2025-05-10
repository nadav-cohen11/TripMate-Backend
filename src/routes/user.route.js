import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
// router.get('/:userId', userController.getUser);
router.put('/:userId',verifyToken, userController.updateUser);
router.delete('/:userId', userController.deleteUser);
router.get('/', userController.getAllUsers);
router.get('/location', verifyToken, userController.getUserLocation);
router.get('/usersLocations', userController.getUserLocations);

export default router;
