import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleSubtask,
  getActivityLogs
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.get('/logs/activity', getActivityLogs);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:taskId/subtasks/:subtaskId/toggle', toggleSubtask);

export default router;
