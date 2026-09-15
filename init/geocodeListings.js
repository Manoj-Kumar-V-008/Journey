//Migration tool for saving the location of the already existing listings

require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const geocode = require("../utils/geocode.js");

async function geocodeExistingListings() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/journey");

        console.log("Connected to MongoDB");

        const listings = await Listing.find({
            geometry: { $exists: false }
        });

        console.log(`Found ${listings.length} listings without geometry`);

        let successCount = 0;
        let failureCount = 0;

        for (const listing of listings) {
            try {
                console.log(
                    `\nGeocoding: ${listing.title} → ${listing.location}, ${listing.country}`
                );

                const coordinates = await geocode(
                    listing.location,
                    listing.country
                );

                listing.geometry = {
                    type: "Point",
                    coordinates: [coordinates.lng, coordinates.lat]
                };

                await listing.save();

                successCount++;

                console.log(
                    `✓ Saved: [${coordinates.lng}, ${coordinates.lat}]`
                );
            } catch (error) {
                failureCount++;

                console.log(
                    `✗ Failed: ${listing.title} → ${error.message}`
                );
            }
        }

        console.log("\nMigration complete!");
        console.log(`Successful: ${successCount}`);
        console.log(`Failed: ${failureCount}`);

    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

geocodeExistingListings();