import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const respondentSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    metadata: {
      type: Object,
      default: {},
      //Optional: { location: "United States", source: "website" }
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Optional: index on email if you plan to look up/respondents by email
respondentSchema.index({ email: 1 });

export default model('Respondent', respondentSchema);