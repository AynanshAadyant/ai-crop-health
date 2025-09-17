import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: { type: String, required: true },
  cropName : { type: mongoose.Schema.Types.ObjectId, ref: 'Crop'},
  type: { type: String },
  metadata: {
    cameraType: String,
    location: {
      latitude: Number,
      longitude: Number
    },
    captureDate: Date,
    spectralBands: [String]
  },
  isDeleted: Boolean
}, { timestamps: true });

const Image = mongoose.model('CropImage', imageSchema);

export default Image;
