const express = require("express");
const router = express.Router();//{ mergeParams: true } helps use :id from parent(app.js) in req.params.id
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const regesterdUser = await User.register(newUser,password);
        req.flash("success",`${username} registered successfully`);
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",wrapAsync(async(req,res)=>{
    res.render("users/login.ejs");
}));

// passport is used as middleware for authentication during login
router.post("/login",passport.authenticate('local',{failureRedirect:"/login" , failureFlash:true}),wrapAsync(async(req,res)=>{
    req.flash("success",`Logged in Successfully`);
    res.redirect("/listings");
}));


//implementing logout,logout() is builtin by passport
router.post("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You logged out");
        res.redirect("/listings");
    })
});

module.exports=router;