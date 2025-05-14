import express from 'express';
import * as UserControllers from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);
router.put('/:userId',verifyToken, UserControllers.updateUser);
router.delete('/:userId', UserControllers.deleteUser);
router.get('/', UserControllers.getAllUsers);
router.get('/location', verifyToken, UserControllers.getUserLocation);
router.get('/usersLocations', UserControllers.getUserLocations);

export default router;
