import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, default: '' },
    url: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'applied', 'interview', 'rejected', 'offer'],
      default: 'applied'
    },
    appliedDate: { type: String, required: true },
    interviewDate: { type: String, default: null },
    satisfactionRating: { type: Number, min: 1, max: 5, default: 3 },
    difficultyRating: { type: Number, min: 1, max: 5, default: 3 },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ApplicationModel =
  mongoose.models.Application || mongoose.model('Application', applicationSchema);
