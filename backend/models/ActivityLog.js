import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    taskId: { type: String, required: true },
    taskTitle: { type: String, required: true },
    action: {
      type: String,
      enum: ['created', 'updated', 'status_change', 'subtask_toggle', 'completed', 'scheduled'],
      required: true
    },
    details: { type: String, default: '' },
    timestamp: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

export const ActivityLogModel =
  mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
