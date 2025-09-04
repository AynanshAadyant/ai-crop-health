import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/DB/config.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen( PORT, () => {
    console.log( "Server running on PORT = ", PORT );
})
