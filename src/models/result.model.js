import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropImage', required: true },
  healthStatus: { type: String, enum: ['Healthy', 'Unhealthy', 'Stressed'], required: true },
  disease: { type: String, default: null },
  confidence: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
