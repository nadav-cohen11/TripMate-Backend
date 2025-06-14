import express from 'express';
import * as matchController from '../controllers/match.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, matchController.createOrAcceptMatch);
router.post('/accept',verifyToken,matchController.acceptMatch)
router.get('/confirmed', verifyToken, matchController.getConfirmedMatches);
router.get('/pending/received',verifyToken, matchController.getReceivedPending);
router.get('/pending/sent/:userId', matchController.getSentPending);
router.post('/decline',verifyToken, matchController.decline);
router.post('/unmatch', verifyToken, matchController.unmatch);
router.post('/block',verifyToken, matchController.block);
router.get('/all', matchController.getAllMatches)
router.get('/home/NonMatchedUsers', verifyToken, matchController.getNonMatchedNearbyUsersWithReviews);

export default router;
