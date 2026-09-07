const express = require("express");
const router = express.Router();//{ mergeParams: true } helps use :id from parent(app.js) in req.params.id
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

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


module.exports=router;