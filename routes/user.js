const express = require("express");
const router = express.Router();//{ mergeParams: true } helps use :id from parent(app.js) in req.params.id
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignUp)
.post(wrapAsync(userController.signup));

// passport is used as middleware for authentication during login
router.route("/login")
.get(wrapAsync(userController.renderLogin))
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/login" , failureFlash:true}),
    wrapAsync(userController.login));

//implementing logout,logout() is builtin by passport
router.post("/logout",userController.logout);

module.exports=router;