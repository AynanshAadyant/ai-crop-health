// import { Vonage } from "@vonage/server-sdk";
// import { Channels } from "@vonage/messages;"
// import dotenv from "dotenv";

// dotenv.config();

// const vonage = new Vonage({
//     apiKey : process.env.VONAGE_API_KEY,
//     apiSecret : process.env.VONAGE_API_SECRET
// })

export default async function sendOTP( phoneNumber, otp ) {
    // try{
    //     const from = "CropRaksha";
    //     const to = phoneNumber
    //     const text = `Here's you OTP for logging into FarmGaurd\nOTP : ${otp}`

    //     const response = await vonage.sms.send({ messageType : 'sms', channel : Channels.SMS, to, from, text })
    //     console.log( response );
    //     return {
    //         success: true,
    //         message: "SMS sent successfully",
    //         body: response,
    //         status: 200
    //     }
    // }
    // catch( e ) {
    //     return {
    //         success: false, 
    //         status: 500,
    //         message: "Error while sending SMS"
    //     }
    // }

    console.log( phoneNumber, "  OTP : " , otp );
    return { success: true,
        status: 200,
        message: "OTP sent successfully"
    }


}