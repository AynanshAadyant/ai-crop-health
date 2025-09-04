import express from "express";
import {protectedRoute} from "../middlewares/jwt.middleware.js";
import { request, getAll, getOne } from "../controllers/prediction.controller.js"

const Router = express.Router();

Router.post( "/request", request );
Router.get( "/", getAll );
Router.get( "/:id", getOne );

export default Router;