import express from "express";
import UserRoutes from "./src/routes/user.routes.js";
import PredictionRoutes from "./src/routes/prediction.routes.js";
import ImageRoutes from "./src/routes/image.routes.js";
import WeatherRoutes from "./src/routes/weather.routes.js";
import CropRoutes from "./src/routes/crop.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use( express.static( "./public"));  
app.use( express.urlencoded( { extended : true} ) );
app.use( express.json() );
app.use( cookieParser() );
app.use( cors({
    origin: process.env.APP_URL
}))

app.use( "/api/user", UserRoutes );
app.use( "/api/prediction", PredictionRoutes );    
app.use( "/api/image", ImageRoutes ); 
app.use( "/api/weather", WeatherRoutes);
app.use( "/api/crops", CropRoutes );

export default app;