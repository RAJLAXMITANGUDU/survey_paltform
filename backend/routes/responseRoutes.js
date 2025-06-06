import express from 'express';

import {
  getPublicSurvey,
  listResponses,
  submitResponse,
} from '../controllers/responseController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router=express.Router();

// router.use(authenticateToken);
router.get("/:id/public",getPublicSurvey);
router.post("/:id/response",submitResponse);
router.get("/:id/responses",authenticateToken,listResponses);

export default router;