const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));

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


//Index route
app.get("/listings", async (req,res)=>{
    const allListings = await(Listing.find({}));
    res.render("./listings/index.ejs",{allListings});
});

//New Route
app.get("/listings/new.ejs",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("./listings/show.ejs",{listings});
});

//Post Route
app.post("/listings",async (req,res)=>{
    
})

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

app.listen(8080,()=>{
    console.log("App is listening at port 8080");
});