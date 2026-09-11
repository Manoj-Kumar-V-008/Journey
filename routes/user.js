const express = require("express");
const router = express.Router();//{ mergeParams: true } helps use :id from parent(app.js) in req.params.id
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.get("/signup",userController.renderSignUp);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login",wrapAsync(userController.renderLogin));

// passport is used as middleware for authentication during login
router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/login" , failureFlash:true}),
    wrapAsync(userController.login));


//implementing logout,logout() is builtin by passport
router.post("/logout",userController.logout);

module.exports=router;