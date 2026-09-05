const express = require("express");
const router = express.Router({ mergeParams: true });//{ mergeParams: true } helps use :id from parent(app.js) in req.params.id
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

//validate Review 
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//Reviews Post Route
router.post("/",validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Successfully created new Review");
    res.redirect(`/listings/${listing.id}`); 
}));

//Review Delete Route
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Successfully Deleted the Review");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;