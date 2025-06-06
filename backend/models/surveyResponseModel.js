import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const surveyResponseSchema = new Schema(
  {
    survey_id: {
      type: Types.ObjectId,
      ref: 'Survey',
      required: true,
    },
    respondent_id: {
      type: Types.ObjectId,
      ref: 'Respondent',
      required: true,
    },
    answers: {
      type: Object,
      required: true,
      // Example: { "q1": "Very Satisfied", "q2": "Some text answer", ... }
    },
    completed_at: {
      type: Date,
      default: Date.now,
    },
    ip_address: {
      type: String,
      default: '',
    },
    user_agent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: false, 
  }
);


surveyResponseSchema.index({ survey_id: 1, completed_at: -1 });
surveyResponseSchema.index({ respondent_id: 1 });

export default model('SurveyResponse', surveyResponseSchema);