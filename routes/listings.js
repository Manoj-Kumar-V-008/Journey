const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
//Index route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new.ejs",isLoggedIn,listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListings));

//Create Route 
router.post("/",isLoggedIn,validateListing ,wrapAsync(listingController.createListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(listingController.renderEditForm));

//Editing put req route in DB i.e., update route
router.put("/:id", validateListing , isOwner ,wrapAsync(listingController.updateListing));

//Delete request route
router.delete("/:id",isLoggedIn, isOwner ,wrapAsync(listingController.destroyListing));

module.exports = router;