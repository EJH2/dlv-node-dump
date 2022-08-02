import express from 'express';
import { getBotAuthorizationController, postConnectBotToUserController } from '../controllers/bot.js';
import { isTokenAuthenticated } from '../middlewares/auth.js';
const router = express.Router();

router.get('/authorize', isTokenAuthenticated, getBotAuthorizationController);

router.post('/', isTokenAuthenticated, postConnectBotToUserController);

export default router;