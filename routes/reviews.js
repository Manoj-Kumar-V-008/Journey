const express = require("express");
const router = express.Router({ mergeParams: true });//{ mergeParams: true } helps use :id from parent(app.js) in req.params.id
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {validateReview , isReviewAuthor} = require("../middleware.js");

//Reviews Post Route
router.post("/",isLoggedIn,validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Successfully created new Review");
    res.redirect(`/listings/${listing.id}`); 
}));

//Review Delete Route
router.delete("/:reviewId",isLoggedIn , isReviewAuthor ,wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Successfully Deleted the Review");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;