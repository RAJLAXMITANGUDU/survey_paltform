import mongoose from 'mongoose';

import Respondent from '../models/respondentModel.js';
import Survey from '../models/surveyModel.js';
import SurveyResponse from '../models/surveyResponseModel.js';

export async function listRespondents(req, res, next) {
  try {

    const userId = req.user._id;
    const { page = 1, limit = 10, search = '' } = req.query;

    const surveys = await Survey.find({ user_id: userId }).select('_id').lean();
    const surveyIds = surveys.map((s) => s._id);

    
    const agg = [
      { $match: { survey_id: { $in: surveyIds } } },
      { $group: { _id: '$respondent_id' } },
    ];
    const distinctRespondentIds = (await SurveyResponse.aggregate(agg)).map((d) => d._id);

    
    const filter = { _id: { $in: distinctRespondentIds } };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalItems = await Respondent.countDocuments(filter);

    const respondents = await Respondent.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    
    const data = await Promise.all(
      respondents.map(async (r) => {
        const responses = await SurveyResponse.find({ respondent_id: r._id })
          .sort({ completed_at: -1 })
          .limit(1)
          .lean();
        const lastResponseAt = responses.length ? responses[0].completed_at : null;
        const surveysCompleted = await SurveyResponse.countDocuments({ respondent_id: r._id });
        return {
          id: r._id,
          email: r.email,
          name: r.name,
          surveys_completed: surveysCompleted,
          last_response_at: lastResponseAt,
          created_at: r.created_at,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        respondents: data,
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

export async function getRespondentDetail(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Respondent not found' });
    }

    const userSurveyIds = (await Survey.find({ user_id: userId }).select('_id').lean()).map((s) => s._id);
    const valid = await SurveyResponse.exists({
      survey_id: { $in: userSurveyIds },
      respondent_id: id,
    });
    if (!valid) {
      return res.status(404).json({ success: false, message: 'Respondent not found' });
    }
    const respondent = await Respondent.findById(id).lean();
    if (!respondent) {
      return res.status(404).json({ success: false, message: 'Respondent not found' });
    }

    const responses = await SurveyResponse.find({
      respondent_id: id,
      survey_id: { $in: userSurveyIds },
    })
      .sort({ completed_at: -1 })
      .populate('survey_id', 'title')
      .lean();

    const formattedResponses = responses.map((r) => ({
      id: r._id,
      survey_id: r.survey_id._id,
      survey_title: r.survey_id.title,
      completed_at: r.completed_at,
    }));

    const surveysCompleted = formattedResponses.length;

    return res.status(200).json({
      success: true,
      data: {
        respondent: {
          id: respondent._id,
          email: respondent.email,
          name: respondent.name,
          metadata: respondent.metadata,
          surveys_completed: surveysCompleted,
          responses: formattedResponses,
          created_at: respondent.created_at,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}