import e from "express";
import { protectedRoute } from "../middlewares/jwt.middleware.js"
import { addCrop, getAllCrops, getCropById, removeCrop } from "../controllers/crop.controller.js";

const Router = e.Router();

Router.post( "/add", protectedRoute, addCrop );
Router.get( "/", protectedRoute, getAllCrops );
Router.get( "/:id", protectedRoute, getCropById );
Router.delete( "/:id", protectedRoute, removeCrop );

export default Router;