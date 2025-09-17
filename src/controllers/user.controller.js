import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import generateOTP from "../utils/generateOTP.js";
import sendOTP from "../utils/sendOTP.js";
import generateCookie from "../utils/generateCookie.js";
import bcrypt from "bcrypt";

const signup = async( req, res ) => {
    try{
        console.log( "Signing up" );
        const { name, phoneNumber } = req.body;
        if( !name || !phoneNumber ) {
            return res.status( 500 ).json({
                message: "Empty fields present",
                success: false,
                status: 500
            })
        }

        const nameRegex = /^[A-Za-z ]{2,50}$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if( !nameRegex.test( name ) ) {
            return res.status( 400 ).json( {
                message: "Invalid name format. Use only alphabets and spaces.",
                success: false
            })
        }

        if( !phoneRegex.test( phoneNumber ) ) {
            return res.status( 400 ).json( {
                message: "Invalid phone number. Must be 10 digits number."
            })
        }

        const duplicateUser = await User.findOne( { phoneNumber } );
        if( duplicateUser ) {
            return res.status( 500 ).json( {
                success: false,
                status: 500,
                message: "Another account with same phone number registered"
            })
        }

        const newUser = await User.create( {
            name, 
            phoneNumber
        })

        const otp = await generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        await Otp.create( { user: newUser._id,
            otp, otpExpiry 
        })

        const {success} = await sendOTP( phoneNumber, otp );
        if( !success ) {
            return res.status( 500 ).json( {
                message: "Something went wrong while sending OTP",
                success: false
            })
        }

        return res.status( 200 ).json( {
            success: true, 
            message : "Sign up successful, verify OTP",
            status: 200
        })
    }
    catch( e ) {
        console.log( "ERROR =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

const verifySignupOtp = async (req, res) => {
  try {
    console.log( "Enter OTP after sign up" );
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const otpRecord = await Otp.findOne({ user }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    const otpMatch = bcrypt.compare( otp.toString(), otpRecord.otp.toString() )
    if( !otpMatch )
    {
        return res.status( 400 ).json({
            success: false,
            message: "Invalid OTP"
        })
    }

    if ( otpRecord.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Expired OTP" });
    }

    user.isVerified = true;
    await user.save();
    // Generate JWT
    const token = generateCookie( user );

    // Set cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    await Otp.deleteMany({ phoneNumber });
    console.log( "OTP verified" );

    return res.status(200).json({ success: true, message: "Account verified successfully", token : auth_token });
  } catch (e) {
    console.log("ERROR =", e);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


const login = async( req, res ) => {
    try{
        console.log( "Logging in" );
        const { phoneNumber } = req.body;
        //validation

        const user = await User.findOne({ phoneNumber });
        if( !user ) {
            return res.status( 404 ).json( {
                success: false,
                status: 404,
                message: "User not found"
            })
        }
        if( !user.isVerified ) {
            return res.status( 500 ).json( {
                success: false,
                message: "User not verified",
            })
        }

        const recentOtp = await Otp.findOne({ user }).sort({ createdAt: -1 });
        if (recentOtp && Date.now() - recentOtp.createdAt < 60 * 1000) {
            return res.status(429).json({ success: false, message: "Wait before requesting another OTP" });
        }


        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000;
        await Otp.create( {
            user, 
            otp,
            otpExpiry
        })
        const response = sendOTP( phoneNumber, otp );
        if( !response.success ) {
            return res.status( response.status ).json( {
                message: response.message,
                success: false
            })
        }
    
        return res.status( 200 ).json( {
            success: true,
            message: "OTP sent for login",
            status: 200,
        })

    }
    catch( e ) {
        console.log( "ERROR =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

const verifyLoginOtp = async (req, res) => {
  try {
    console.log( "Verifying OTP after login" );
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const otpRecord = await Otp.findOne({ userId: user._id }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    const otpMatch = bcrypt.compare( otp, otpRecord.otp )

    if( !otpMatch )
    {
        return res.status( 400 ).json({
            success: false,
            message: "Invalid OTP"
        })
    }

    if ( otpRecord.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Expired OTP" });
    }

    // Generate JWT
    const token = generateCookie( user );

    // Set cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    await Otp.deleteMany({ userId: user._id }); // clean old OTPs
    console.log( "OTP verified" );
    return res.status(200).json({ success: true, message: "Login successful", token : token });
  } catch (e) {
    console.log("ERROR =", e);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


const getUser = async( req, res ) => {
    try{
        const user = req.user;
        return res.status( 200 ).json( {
            message: "User fetched successfully",
            status: 200,
            success: true,
            body: user
        })
    }
    catch( e ) {
        console.log( "ERROR =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

const logout = async( req, res ) => {
    try{
        res.clearCookie( 'auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        return res.status( 200 ).json({
            success:true,
            message: "Log out successful",
            status: 200
        })
    }
    catch( e ) {
        console.log( "ERROR =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

export { signup, verifySignupOtp, login, verifyLoginOtp, getUser, logout }