import express from 'express';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  addInterview
} from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getApplications);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.post('/interview', addInterview);

export default router;
