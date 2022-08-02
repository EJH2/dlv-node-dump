import express from 'express';
import { getAllLogsController, createLogController, getLogController, updateLogController, deleteLogController } from '../controllers/logs.js';
import { isTokenAuthenticated } from '../middlewares/auth.js';
const router = express.Router();

// Get all logs
router.get('/', isTokenAuthenticated, getAllLogsController);

// Create a log
router.post('/', isTokenAuthenticated, createLogController);

// Get a log by uuid
router.get('/:uuid', isTokenAuthenticated, getLogController);

// Update a log by uuid
router.patch('/:uuid', isTokenAuthenticated, updateLogController);

// Delete a log by uuid
router.delete('/:uuid', isTokenAuthenticated, deleteLogController);

export default router;