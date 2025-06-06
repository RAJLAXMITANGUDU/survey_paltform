import mongoose from 'mongoose';

import Respondent from '../models/respondentModel.js';
import Survey from '../models/surveyModel.js';
import SurveyResponse from '../models/surveyResponseModel.js';

export async function getPublicSurvey(req, res, next) {
  try {
    const { id } = req.params;

  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const survey = await Survey.findOne({ _id: id, status: 'active' }).lean();
    if (!survey) {
      return res.status(404).json({ success: false, message: 'Survey not found or not active' });
    }

    return res.status(200).json({
      success: true,
      data: {
        survey: {
          id: survey._id,
          title: survey.title,
          description: survey.description,
          questions: survey.questions,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function submitResponse(req, res, next) {
  try {
    const { id } = req.params;
    const { respondent: respondentData = {}, answers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const survey = await Survey.findOne({ _id: id, status: 'active' });
    if (!survey) {
      return res.status(404).json({ success: false, message: 'Survey not found or not active' });
    }

    
    let respondent;
    if (respondentData.email) {
      
      respondent = await Respondent.findOne({ email: respondentData.email.trim().toLowerCase() });
      if (!respondent) {
        respondent = await Respondent.create({
          email: respondentData.email.trim().toLowerCase(),
          name: respondentData.name || '',
          metadata: respondentData.metadata || {},
        });
      }
    } else {
      
      respondent = await Respondent.create({
        name: respondentData.name || '',
        metadata: respondentData.metadata || {},
      });
    }

    
    const newResponse = await SurveyResponse.create({
      survey_id: survey._id,
      respondent_id: respondent._id,
      answers,
      completed_at: new Date(),
      ip_address: req.ip || '',
      user_agent: req.headers['user-agent'] || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Response submitted successfully',
      data: {
        response_id: newResponse._id,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function listResponses(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const survey = await Survey.findOne({ _id: id, user_id: userId });
    if (!survey) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalItems = await SurveyResponse.countDocuments({ survey_id: id });

    const responses = await SurveyResponse.find({ survey_id: id })
      .sort({ completed_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('respondent_id', 'email name')
      .lean();

    
    const data = responses.map((r) => ({
      id: r._id,
      respondent: {
        id: r.respondent_id._id,
        email: r.respondent_id.email,
        name: r.respondent_id.name,
      },
      answers: r.answers,
      completed_at: r.completed_at,
    }));

    return res.status(200).json({
      success: true,
      data: {
        responses: data,
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