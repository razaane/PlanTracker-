import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    title: { type: String, required: true },
    day: { type: Number, min: 0, max: 6, required: true }, // 0: Lundi ... 6: Dimanche
    startTime: { type: String, required: true }, // '09:00'
    endTime: { type: String, required: true }, // '11:00'
    category: {
      type: String,
      enum: [
        'cours',
        'veille',
        'presentation',
        'problem_solving',
        'sport_trajets',
        'candidatures',
        'documentation',
        'entretiens'
      ],
      required: true
    },
    color: { type: String },
    location: { type: String, default: '' },
    notes: { type: String, default: '' },
    taskId: { type: String, default: null }
  },
  { timestamps: true }
);

export const SlotModel = mongoose.models.Slot || mongoose.model('Slot', slotSchema);
