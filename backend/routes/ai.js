import express from 'express';
import {
  detectConflicts,
  getWeeklySummary,
  getReminders,
  optimizeSchedule,
  processNaturalLanguage
} from '../controllers/aiController.js';

const router = express.Router();

router.get('/conflicts', detectConflicts);
router.get('/summary', getWeeklySummary);
router.get('/reminders', getReminders);
router.post('/optimize', optimizeSchedule);
router.post('/chat', processNaturalLanguage);

export default router;
