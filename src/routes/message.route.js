import express from 'express';
import * as MessageController from '../controllers/message.controller.js';

const router = express.Router();

router.get('/getMessage', MessageController.getMessage);
router.delete('/deleteMessage', MessageController.deleteMessage);
router.put('/updateMessage', MessageController.updateMessage);
router.get('/getMessageByUser', MessageController.getMessagesByUser);

export default router;
