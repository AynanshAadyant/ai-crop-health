import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export default function generateCookie( user ) {
    return jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
}