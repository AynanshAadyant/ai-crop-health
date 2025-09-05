import express, { json, urlencoded } from "express";
import UserRoutes from "./src/routes/user.routes.js";
import PredictionRoutes from "./src/routes/prediction.routes.js";
import ImageRoutes from "./src/routes/image.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use( express.static( "./public"));  
app.use( express.urlencoded( { extended : true} ) );
app.use( express.json() );
app.use( cookieParser() );

app.use( "/api/user", UserRoutes );
app.use( "/api/prediction", PredictionRoutes );    
app.use( "/api/image", ImageRoutes ); 

export default app;