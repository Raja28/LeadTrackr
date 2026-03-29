const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminMiddleware = (req, res, next) => {

    const token = req.cookies.token;
  
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
    }

    try {
   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if (decoded.role !== "admin") {
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized! You do not have admin privileges.",
            });
        }

    
        req.admin = decoded;
        next();

    } catch (error) {
        console.error("Admin Auth middleware Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token",
        });
    }
};


module.exports = { adminMiddleware };