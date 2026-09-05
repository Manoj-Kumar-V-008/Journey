const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
    filename:{
        type: String,
        default: "listingimage",
    },
    url:{
        type: String,
        default: "https://placehold.net/main.svg", // a real fallback image
        set: (v) => v === "" ? "https://placehold.net/main.svg" : v,
    },
},
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[{
        type:schema.Types.ObjectID,
        ref:"Review"
    }]
});

//as a middleware deletes all reviews when the main listing is deleted
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;