import express from 'express';
import * as UserControllers from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', UserControllers.register);
router.get('/getUser/:userId', UserControllers.getUser);
router.delete('/deleteUser', UserControllers.deleteUser);
router.put('/updateUser', UserControllers.updateUser);
router.post('/login', UserControllers.login);

export default router;
