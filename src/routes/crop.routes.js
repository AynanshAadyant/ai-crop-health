import e from "express";
import { protectedRoute } from "../middlewares/jwt.middleware.js"
import { addCrop, getAllCrops, getCropById, removeCrop } from "../controllers/crop.controller.js";

const Router = e.Router();

Router.post( "/add", addCrop );
Router.get( "/", getAllCrops );
Router.get( "/:id", getCropById );
Router.delete( "/:id", removeCrop );

export default Router;