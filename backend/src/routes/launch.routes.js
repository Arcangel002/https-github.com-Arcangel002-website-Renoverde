import express from 'express';
import {
  getLaunches,
  getLaunchById,
  createLaunch,
  updateLaunch,
  deleteLaunch,
} from '../controllers/content.controller.js';

const router = express.Router();

router.get('/', getLaunches);
router.get('/:id', getLaunchById);
router.post('/', createLaunch);
router.put('/:id', updateLaunch);
router.delete('/:id', deleteLaunch);

export default router;
