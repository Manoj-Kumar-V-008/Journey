const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");


//validate Listing 
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//Index route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await(Listing.find({}));
    res.render("./listings/index.ejs",{allListings});
}));

//New Route
router.get("/new.ejs",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id).populate("reviews").populate("owner");

    if(!listings){
        req.flash("error","Listing doesn't Exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listings});
}));

//Create Route 
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit", isLoggedIn ,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing doesn't Exist!");
        return res.redirect("/listings");
    }  
    res.render("./listings/edit.ejs",{listing});
}));

//Editing put req route in DB
router.put("/:id", validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Successfully Edited the listing");
    res.redirect("/listings");
}));

//Delete request route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted the Listing");
    res.redirect("/listings");
}));

module.exports = router;