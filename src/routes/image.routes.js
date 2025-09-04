import express from "express";
import { upload, getImages } from "../controllers/image.controller.js";

const Router = express.Router();

Router.post( "/upload", upload );
Router.get( "/", getImages );

export default Router;