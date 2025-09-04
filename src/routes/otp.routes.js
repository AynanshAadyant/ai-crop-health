import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otp.controller.js";

const Router = express.Router();

Router.post( "/send", sendOTP );
Router.post( "/verify", verifyOTP );

export default Router;  