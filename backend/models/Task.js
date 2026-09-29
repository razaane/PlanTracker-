import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    projectId: { type: String, required: true },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'in_review', 'done'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: { type: String },
    tags: [{ type: String }],
    subtasks: [subtaskSchema]
  },
  { timestamps: true }
);

export const TaskModel = mongoose.models.Task || mongoose.model('Task', taskSchema);
