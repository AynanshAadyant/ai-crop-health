import express from "express";
import {protectedRoute} from "../middlewares/jwt.middleware.js";
import { request, getAll, getOne } from "../controllers/prediction.controller.js"

const Router = express.Router();

Router.post( "/request", protectedRoute, request );
Router.get( "/", protectedRoute, getAll );
Router.get( "/:id", protectedRoute, getOne );

export default Router;