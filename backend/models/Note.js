import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    category: {
      type: String,
      enum: ['veille', 'cours', 'reunion', 'technique'],
      default: 'veille'
    },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export const NoteModel = mongoose.models.Note || mongoose.model('Note', noteSchema);
