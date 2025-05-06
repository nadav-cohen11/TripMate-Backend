import express from 'express';
import * as matchController from '../controllers/match.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', matchController.createOrAcceptMatch);
router.get('/confirmed/:userId', verifyToken, matchController.getConfirmedMatches);
router.get('/pending/received/:userId', matchController.getReceivedPending);
router.get('/pending/sent/:userId', matchController.getSentPending);
router.post('/decline/:matchId', matchController.decline);
router.post('/unmatch', matchController.unmatch);
router.post('/block/:matchId', matchController.block);
router.get('/all', matchController.getAllMatches)

export default router;
