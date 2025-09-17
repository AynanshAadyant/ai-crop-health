import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropImage', required: true },
  healthStatus: { type: String, enum: ['Healthy', 'Unhealthy', 'Stressed'], required: true },
  disease: { type: String, default: null },
  confidence: { type: Number, required: true }
}, { timestamps: true });

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
