import express from "express"; 

const router = express.Router(); 

router.get("/signup",(req, res)=>{
    res.send("hitting signup route")
})

router.get("/login",(req, res)=>{
    res.send("hitting login route")
})

router.get("/logout",(req, res)=>{
    res.send("hitting logout route")
})

export default router; 