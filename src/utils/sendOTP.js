import { Client, Messaging } from 'node-appwrite';
import dotenv from "dotenv";

dotenv.config();

export const client = new Client();
client
    .setEndpoint("https://fra.cloud.appwrite.io/v1") // or your self-hosted URL
    .setProject(process.env.APPWRITE_PROJECT_KEY)
    .setKey(process.env.APPWRITE_API_SECRET);

const messaging = new Messaging(client);

dotenv.config();
export default async function sendOTP(phoneNumber, otp) {
  const response = await fallback( phoneNumber, otp );
  return { success: true } ;
}

async function usingService( phoneNumber, otp ) {
  try {
    // const response = await messaging.createSms(
    //   process.env.APPWRITE_SMS_TEMPLATE_ID,  // ✅ ID of SMS template from console
    //   [phoneNumber],                        // ✅ must be array
    //   undefined,                            // topics (not needed here)
    //   { otp, expiry: 5 }                    // ✅ inject variables

    // );

    const response = await messaging.createSMS(
      undefined,
      [phoneNumber],
      `Your otp is ${otp} `
    )
    console.log("SMS Sent:", response);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

function fallback( phoneNumber, otp ) {
  console.log( `Phone number :${phoneNumber}, otp : ${otp}`)
  const response = {
    success: true,
    status: 200,
    message: "OTP sent"
  }
  return response;
}
