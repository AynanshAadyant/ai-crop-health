import express from "express";
import { uploadImage, getImages, getImageById } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {protectedRoute} from  "../middlewares/jwt.middleware.js";

const Router = express.Router();

Router.post( "/upload", protectedRoute, upload.single( "image" ), uploadImage );
Router.get( "/", protectedRoute, getImages );
Router.get( "/:id", protectedRoute, getImageById );

export default Router;