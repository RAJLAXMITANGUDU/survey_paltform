import express from 'express';

import {
  getRespondentDetail,
  listRespondents,
} from '../controllers/respondentController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router=express.Router();

router.use(authenticateToken);
router.get("/",listRespondents);
router.get("/:id",getRespondentDetail);

export default router;