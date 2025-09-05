import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header (mobile apps / API clients)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2️⃣ Check cookie (web apps)
    else if (req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    // 3️⃣ No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Authentication token not found",
      });
    }

    // 4️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Invalid token",
      });
    }

    // 5️⃣ Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // 6️⃣ Attach user to request
    req.user = user;
    next(); // allow access to route

  } catch (err) {
    console.error("Protected route error:", err);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Something went wrong",
    });
  }
};

export { protectedRoute };
