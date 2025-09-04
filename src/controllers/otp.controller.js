import Otp from "../models/otp.model.js";

const sendOTP = async( req, res ) => {
    try{}
    catch( e ) {
        console.log( "ERROR =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

const verifyOTP = async( req, res ) => {
    try{}
    catch( e ) {
        console.log( "ERROR =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

export { sendOTP, verifyOTP }