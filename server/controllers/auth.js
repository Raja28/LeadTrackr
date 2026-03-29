const { supabase } = require("../config/supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const { data: existingUser, error: existingUserError } = await supabase
            .from("admins")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (existingUserError) {
            return res.status(500).json({
                success: false,
                message: existingUserError.message || "Internal server error",
            });
        }

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists",
            });
        }

        const password_hash = await bcrypt.hash(password, 10);
        if (!password_hash) {
            return res.status(500).json({
                success: false,
                message: "Failed to hash password",
            });
        }

        const { data: newUser, error: newUserError } = await supabase.from("admins").insert({
            full_name: name,
            email,
            password_hash
        });

        if (newUserError) {
            return res.status(500).json({
                success: false,
                message: newUserError.message || "Failed to register admin",
            });
        }
        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
        });

    } catch (error) {
        console.log("Register User Error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }


        const { data: existingUser, error: existingUserError } = await supabase
            .from("admins")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (existingUserError) {
            return res.status(500).json({
                success: false,
                message: existingUserError.message || "Internal server error",
            });
        }
        
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Admin not found",
            });
        }


        const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }


        const payload = {
            id: existingUser.id,
            role: "admin",
            email: existingUser.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        const { password_hash, ...adminData } = existingUser;

        return res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            admin: adminData, // No password hash sent!
        });
    } catch (error) {
        console.error("Admin Login Error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const adminLogout = async (req, res) => {
    try {
    
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", 
        path: "/",
      });
  

      return res.status(200).json({
        success: true,
        message: "Admin logged out successfully",
      });
  
    } catch (error) {
      console.error("Admin Logout Error", error);
     
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  };
module.exports = {
    adminRegister,
    adminLogin,
    adminLogout,
}