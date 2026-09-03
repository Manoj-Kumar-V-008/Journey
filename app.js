const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./schema.js")

app.set("view engine", "ejs");
app.engine('ejs',ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Server is working");
});

async function main(){
    await mongoose.connect(
        "mongodb://127.0.0.1:27017/journey"
    );
}

main()
    .then(() => {
        console.log("connection Successful");
    })
    .catch(err => console.log(err));


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


//Index route
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await(Listing.find({}));
    res.render("./listings/index.ejs",{allListings});
}));

//New Route
app.get("/listings/new.ejs",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listings});
}));

//Create Route 
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

//Editing put req route in DB
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

//Delete request route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//Reviews Post Route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing.id}`); 
}));

//Review Delete Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))


// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"Luxury Villa",
//         description:"Grand Villa for rich",
//         price:2000000,
//         location:"Banglore",
//         country:"India"
//     });
//     await sampleListing.save().then(()=>{
//         res.send("Successful testing");
//     }).catch((err)=>{
//         console.log(err);
//     });
// })


//if user tries to access undefined route 
app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});


app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something went wrong" } = err;
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("App is listening at port 8080");
});
