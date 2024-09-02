// models/Generation.ts
import mongoose from 'mongoose';

const GenerationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  originalImageUrl: { type: String, required: true },
  generatedImageUrl: { type: String, required: true },
  gender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Generation || mongoose.model('Generation', GenerationSchema);
