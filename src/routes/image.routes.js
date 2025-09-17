import express from "express";
import { uploadImage, getImages, getImageById } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {protectedRoute} from  "../middlewares/jwt.middleware.js";

const Router = express.Router();

Router.post( "/upload", upload.single( "image" ), uploadImage );
Router.get( "/", getImages );
Router.get( "/:id", getImageById );

export default Router;