import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js"; 
import {ENV} from "../lib/env.js";
// import dotenv from "dotenv";
// dotenv.config();

export const signup = async (req, res) => {
    // can access users request from req with help of express.json()
    const {fullName, email, password} = req.body; 

    try{
        if (!fullName || !email || !password){
            return res.status(400).json({ message: "All fields are required"})
        } 

        if (password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters"})
        }

        // check if email is valid: regex 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({email: email}); 
        if (user) {
            return res.status(400).json({ message: "User already Exist"})
        }

        // 123456 => $evjinerw-#fer3ng - password hashing
        const salt = await bcrypt.genSalt(10) 
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName, 
            email,
            password: hashedPassword
        })

        if (newUser){
            // persist user first, then issue auth cookie
            const savedUser = await newUser.save(); 
            generateToken(savedUser._id, res);

            res.status(200).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
            });


            try{
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch(error){
                console.error("Failed to send welcome email", error);
            }
    
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch(error){
        console.log("Error in signup Controller:", error); 
        res.status(500).json({ message : "Internal server Error"})
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body;

    try{
        if (!email || !password){
        return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email: email})
        if (!user){
            return res.status(400).json({ message: "Invalid Credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid Credentials"})
        }

        generateToken(user._id, res)

        res. status (200).json({
        _id: user._id, 
        fullName: user.fullName, 
        email: user.email,
        profilepic: user.profilePic,
        });

    } catch (error) {
        console.error("Error in login controller:", error)
        return res.status(500).json({ message: "Internal Server Error"})
    }
}

export const logout = (req,res) => {
    res.cookie("jwt", "", {maxAge:0})
    res.status(200).json({ message: "Logged out Successfully"})
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body; 
        if (!profilePic) return res.status(400).json({message: "Profile pic is required" })

        const userId = req.user._id; 

        const uploadResponse = await cloudinary.uploader.upload(profilePic); 

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: uploadResponse.secure_url }, 
            { new: true }
        ); 

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update profile:", error); 
        res.status(500).json({ message: "Internal server error" });
    }
}