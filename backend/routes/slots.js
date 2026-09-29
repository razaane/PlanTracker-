import express from 'express';
import {
  getSlots,
  createSlot,
  updateSlot,
  deleteSlot,
  assignTaskToSlot
} from '../controllers/slotController.js';

const router = express.Router();

router.get('/', getSlots);
router.post('/', createSlot);
router.put('/:id', updateSlot);
router.delete('/:id', deleteSlot);
router.post('/assign-task', assignTaskToSlot);

export default router;
