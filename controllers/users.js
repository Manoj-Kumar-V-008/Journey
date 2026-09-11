const User = require("../models/user.js");


module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.renderLogin = async(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.signup = async(req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const regesterdUser = await User.register(newUser,password);
        req.login(regesterdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success",`${username} registered successfully`);
            const redirectUrl = req.session.redirectUrl || "/listings";
            delete req.session.redirectUrl;
            res.redirect(redirectUrl);
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.login = async(req,res)=>{
        req.flash("success",`Logged in Successfully`);
//req.session.redirectUrl is reset by passport so we should use locals which can be accessed everywhere & passport can't change it
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You logged out");
        res.redirect("/listings");
    })
};