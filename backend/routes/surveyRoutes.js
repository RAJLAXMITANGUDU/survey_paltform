import express from 'express';

import {
  createSurvey,
  deleteSurvey,
  getSurveyById,
  listSurveys,
  publishSurvey,
  updateSurvey,
} from '../controllers/surveyController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router=express.Router();

// Authenticate all route
router.use(authenticateToken);

router.post("/",createSurvey);
router.get("/",listSurveys);
router.get("/:id",getSurveyById);
router.patch("/:id",updateSurvey);
router.delete("/:id",deleteSurvey);
router.post("/:id/publish",publishSurvey);

export default router;