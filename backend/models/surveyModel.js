import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// Subschema for a single Question
const questionSchema = new Schema(
  {
    id: {
      type: String,
      required: true, // e.g. "q1", "q2", etc. (you could also auto‐generate this)
    },
    type: {
      type: String,
      required: true,
      enum: ['short-text', 'single-choice', 'rating', 'nps'],
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: undefined, 
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false } // We don’t need a separate ObjectId for each question subdoc in this design
);

const surveySchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'active', 'completed'],
      default: 'draft',
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'A survey must contain at least one question.',
      },
    },
    published_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Indexes for performance
surveySchema.index({ user_id: 1 });
surveySchema.index({ status: 1 });
surveySchema.index({ created_at: -1 });

export default model('Survey', surveySchema);