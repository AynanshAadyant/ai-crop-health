import express from "express";
import { protectedRoute } from "../middlewares/jwt.middleware.js";
import { signup, login, getUser, logout, verifySignupOtp, verifyLoginOtp } from "../controllers/user.controller.js";

const Router = express.Router();

Router.post( '/signup', signup );
Router.post( '/signup/verify', verifySignupOtp );
Router.post( '/login', login );
Router.post( '/login/verify', verifyLoginOtp );
Router.get( '/', protectedRoute, getUser );
Router.get( '/logout', protectedRoute, logout );
Router.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    success: false,
    status: 404
  });
});

export default Router;
