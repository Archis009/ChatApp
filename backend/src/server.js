import express from "express";
// import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {ENV} from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path"; 
import { connectDB } from "./lib/db.js";

// dotenv.config();

const app = express();
const __dirname = path.resolve(); 

const PORT = ENV.PORT || 3000;

app.use(express.json({limit: "5mb"})); //req.body 
app.use(cookieParser());
app.use((req, res, next) => {
    console.log("Cookies received:", req.cookies);
    next();
});

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "Backend is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment 
if(ENV.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (_,res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

export default app;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, ()=>{
        console.log(`server is running on port ${PORT}`)
        connectDB();
    })
} else {
    // connect to DB even if deployed on Vercel
    connectDB(); 
}