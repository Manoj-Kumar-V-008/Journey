const Listing = require("../models/listing.js");
const geocode = require("../utils/geocode.js");

module.exports.index = async (req, res) => {
    const allListings = await (Listing.find({}));
    res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");

    if (!listings) {
        req.flash("error", "Listing doesn't Exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listings });
};

module.exports.createListing = async (req, res, next) => {
    // 1. Guard against missing upload
    if (!req.file) {
        req.flash("error", "Please upload an image!");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log("URL - " + url, "Filename - " + filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    const { location, country } = req.body.listing;
    const geoCodeResult = await geocode(location, country);
    newListing.geometry = {
        type: "Point",
        coordinates: [geoCodeResult.lng, geoCodeResult.lat]
    };

    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id); 
    if (!listing) {
        req.flash("error", "Listing doesn't Exist!");
        return res.redirect("/listings");
    }
    
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload/","/upload/c_fit,h_300,w_250/");
    res.render("./listings/edit.ejs", { listing,originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing doesn't Exist!");
        return res.redirect("/listings");
    }

    const locationChanged =listing.location !== req.body.listing.location || listing.country !== req.body.listing.country;

    listing.set(req.body.listing);

    if (locationChanged) {
        const { location, country } = req.body.listing;

        const coordinates = await geocode(location, country);

        listing.geometry = {
            type: "Point",
            coordinates: [coordinates.lng, coordinates.lat]
        };
    }

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
    }

    await listing.save();

    req.flash("success", "Successfully Edited the listing");
    res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted the Listing");
    res.redirect("/listings");
}