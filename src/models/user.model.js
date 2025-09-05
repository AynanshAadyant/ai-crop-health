import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  isVerified: { type : Boolean, default: false },
  avatar : { type : String, trim : true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
