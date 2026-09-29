import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'job_search', 'personal'],
      default: 'academic'
    },
    color: { type: String, default: '#3F5B44' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.models.Project || mongoose.model('Project', projectSchema);
