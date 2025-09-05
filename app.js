import express, { json, urlencoded } from "express";
import UserRoutes from "./src/routes/user.routes.js";
import PredictionRoutes from "./src/routes/prediction.routes.js";
import ImageRoutes from "./src/routes/image.routes.js";


const app = express();

app.use( express.static( "./public"));  
app.use( urlencoded( { extended : true} ) );
app.use( json() );

app.use( "/api/user", UserRoutes );
app.use( "/api/prediction", PredictionRoutes );    
app.use( "/api/image", ImageRoutes ); 

export default app;