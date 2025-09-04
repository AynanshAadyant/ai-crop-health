import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['multispectral', 'hyperspectral'], required: true },
  metadata: {
    cameraType: String,
    location: {
      latitude: Number,
      longitude: Number
    },
    captureDate: Date,
    spectralBands: [String]
  }
}, { timestamps: true });

const Image = mongoose.model('CropImage', imageSchema);

export default Image;
