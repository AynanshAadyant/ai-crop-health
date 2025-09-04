import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
    try{
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/crophealth`);
        console.log( "Database connected" );
    }
    catch( e ) {
        console.log( "Error connecting DB= ", e );
    }
}