import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
  jwtToken: { type: String } // optional, store JWT after verification
}, { timestamps: true });

module.exports = mongoose.model('OtpSession', otpSchema);
