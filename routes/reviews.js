const express = require("express");
const router = express.Router({ mergeParams: true });//{ mergeParams: true } helps use :id from parent(app.js) in req.params.id
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {validateReview , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews Post Route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//Review Delete Route
router.delete("/:reviewId",isLoggedIn , isReviewAuthor ,wrapAsync(reviewController.destroyReview));

module.exports = router;