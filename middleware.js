module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"--",req.originalUrl); -> stores the path we are trying to access , helps to redirect after login
    if(!req.isAuthenticated()){
        //URL for redirect is stored here to access the URL we want to use before user loggedin
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}