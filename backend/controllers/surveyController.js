import mongoose from 'mongoose';

import Survey from '../models/surveyModel.js';
import SurveyResponse from '../models/surveyResponseModel.js';

export async function listSurveys(req, res, next) {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10, search = '' } = req.query;
    const filter = { user_id: userId };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalItems = await Survey.countDocuments(filter);
    const surveys = await Survey.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    
    const results = await Promise.all(
      surveys.map(async (s) => {
        const responsesCount = await SurveyResponse.countDocuments({ survey_id: s._id });
        return {
          id: s._id,
          title: s.title,
          description: s.description,
          status: s.status,
          questions_count: s.questions.length,
          responses_count: responsesCount,
          created_at: s.created_at,
          updated_at: s.updated_at,
          published_at: s.published_at,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        surveys: results,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalItems / parseInt(limit)),
          total_items: totalItems,
          items_per_page: parseInt(limit),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function createSurvey(req, res, next) {
  try {
    const userId = req.user._id;
    const { title, description = '', questions } = req.body;

  
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          title: title ? undefined : ['Title is required'],
          questions: !questions || questions.length === 0 ? ['At least one question required'] : undefined,
        },
      });
    }

    const newSurvey = await Survey.create({
      user_id: userId,
      title,
      description,
      questions,
      status: 'draft',
      published_at: null,
    });

    return res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      data: {
        survey: {
          id: newSurvey._id,
          title: newSurvey.title,
          description: newSurvey.description,
          status: newSurvey.status,
          questions: newSurvey.questions,
          created_at: newSurvey.created_at,
          updated_at: newSurvey.updated_at,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getSurveyById(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const survey = await Survey.findOne({ _id: id, user_id: userId }).lean();
    if (!survey) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const responsesCount = await SurveyResponse.countDocuments({ survey_id: survey._id });

    return res.status(200).json({
      success: true,
      data: {
        survey: {
          id: survey._id,
          title: survey.title,
          description: survey.description,
          status: survey.status,
          questions: survey.questions,
          responses_count: responsesCount,
          created_at: survey.created_at,
          updated_at: survey.updated_at,
          published_at: survey.published_at,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateSurvey(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, questions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const existing = await Survey.findOne({ _id: id, user_id: userId });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    if (title !== undefined) existing.title = title;
    if (description !== undefined) existing.description = description;
    if (questions !== undefined) existing.questions = questions;

    await existing.save();

    return res.status(200).json({
      success: true,
      message: 'Survey updated successfully',
      data: {
        survey: {
          id: existing._id,
          title: existing.title,
          description: existing.description,
          status: existing.status,
          questions: existing.questions,
          updated_at: existing.updated_at,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function deleteSurvey(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const deleted = await Survey.findOneAndDelete({ _id: id, user_id: userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    
    await SurveyResponse.deleteMany({ survey_id: id });

    return res.status(200).json({
      success: true,
      message: 'Survey deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
}

export async function publishSurvey(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const survey = await Survey.findOne({ _id: id, user_id: userId });
    if (!survey) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    survey.status = 'active';
    survey.published_at = new Date();
    await survey.save();

    return res.status(200).json({
      success: true,
      message: 'Survey published successfully',
      data: {
        survey: {
          id: survey._id,
          status: survey.status,
          published_at: survey.published_at,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}