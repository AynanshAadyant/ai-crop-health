import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
}, { timestamps: true });

otpSchema.pre( 'save', async function( next ) {
      try{
        const salt = await bcrypt.genSalt( 10 );
        this.otp = await bcrypt.hash( this.otp, salt );
      }
      catch( e ) {
        console.log( "ERROR while hashing OTP", e );
        next( e );
      }
})

const Otp = mongoose.model('OtpSession', otpSchema);

export default Otp;
