const Listing = require("../models/listing.js");


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
    console.log("URL - " + url, "Filename - " + filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; 
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
    res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Successfully Edited the listing");
    res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted the Listing");
    res.redirect("/listings");
}