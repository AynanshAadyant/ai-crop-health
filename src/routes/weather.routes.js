import express from "express";
import { currentWeather } from "../controllers/weather.controller.js";

const Router = express.Router();

Router.post( "/forecast", currentWeather );

export default Router;