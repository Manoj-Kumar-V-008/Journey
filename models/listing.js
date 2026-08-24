const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
        default: "https://share.google/avW3iF2unmAydEbyF", // a real fallback image
        set: (v) => v === "" ? "https://share.google/avW3iF2unmAydEbyF" : v,
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
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;