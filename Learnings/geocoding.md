# Geocoding & Interactive Maps in a Node.js + Express + MongoDB Project

## Overview

Geocoding is the process of converting a human-readable location such as:

```text
Manali, India
```

into geographical coordinates:

```text
Latitude: 32.2454608
Longitude: 77.1872926
```

These coordinates can then be stored in a database and used to display the location on an interactive map.

In the Journey project, the mapping feature uses:

* **Geoapify** → Geocoding API
* **MongoDB** → Stores coordinates as GeoJSON
* **Leaflet** → Interactive map library
* **MapLibre GL JS** → Connects Leaflet with vector map styles
* **OpenFreeMap** → Map data/style provider

The overall architecture is:

```text
User enters location
        ↓
Express backend
        ↓
Geoapify Geocoding API
        ↓
Latitude + Longitude
        ↓
MongoDB (GeoJSON)
        ↓
EJS
        ↓
Leaflet + MapLibre
        ↓
OpenFreeMap
        ↓
Interactive map
```

---

# 1. What is Geocoding?

Geocoding converts a location name/address into coordinates.

### Example

Input:

```text
Bengaluru, India
```

Output:

```json
{
    "lat": 12.9716,
    "lng": 77.5946
}
```

The coordinates identify a physical position on Earth.

### Reverse Geocoding

The opposite process is called reverse geocoding.

```text
Latitude + Longitude
        ↓
Address / Place
```

Example:

```text
12.9716, 77.5946
        ↓
Bengaluru, India
```

In Journey we use **forward geocoding**, not reverse geocoding.

---

# 2. Why Do We Need Coordinates?

A string like:

```text
"Goa, India"
```

is useful for humans but a map needs geographical coordinates to know exactly where to center itself.

Therefore:

```text
location + country
        ↓
coordinates
```

For example:

```js
{
    location: "Goa",
    country: "India"
}
```

becomes:

```js
{
    geometry: {
        type: "Point",
        coordinates: [74.0855134, 15.3004543]
    }
}
```

---

# 3. GeoJSON

For geospatial data, MongoDB can use the **GeoJSON** format.

A point is represented as:

```js
{
    type: "Point",
    coordinates: [longitude, latitude]
}
```

Example:

```js
geometry: {
    type: "Point",
    coordinates: [74.0855134, 15.3004543]
}
```

## Important

GeoJSON stores coordinates in this order:

```text
[LONGITUDE, LATITUDE]
```

NOT:

```text
[LATITUDE, LONGITUDE]
```

This is one of the most common mistakes when working with maps.

---

# 4. Journey's Mongoose Schema

The Listing model contains:

```js
geometry: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        default: [0, 0]
    }
}
```

This allows each listing to store its geographical position.

Example MongoDB document:

```js
{
    title: "Geo_temp",
    location: "Goa",
    country: "India",

    geometry: {
        type: "Point",
        coordinates: [74.0855134, 15.3004543]
    }
}
```

The user does **not** enter the coordinates manually.

The application generates them automatically.

---

# 5. User Data vs Derived Data

The user enters:

```text
Title
Description
Price
Location
Country
Image
```

The application derives:

```text
Latitude
Longitude
```

So:

```text
User Input
    ↓
Location + Country
    ↓
Geocoding
    ↓
Coordinates
```

The coordinates are therefore **derived data**.

This is a useful backend design pattern.

---

# 6. Geoapify

Geoapify provides APIs related to geographical data.

For Journey we use its:

```text
Geocoding API
```

The endpoint used is:

```text
[https://api.geoapify.com/v1/geocode/search](https://api.geoapify.com/v1/geocode/search)
```

A request contains information such as:

```text
text = Manali, India
format = json
limit = 1
apiKey = API_KEY
```

The API returns a JSON response containing location information and coordinates.

---

# 7. API Keys and .env

API keys should not be hard-coded into application code.

Bad:

```js
const apiKey = "my-secret-api-key";
```

Instead, store it in `.env`:

```env
GEOAPIFY_API_KEY=your_api_key_here
```

And make sure:

```text
.env
```

is included in:

```text
.gitignore
```

This prevents accidentally publishing the API key to GitHub.

---

# 8. Geocoding Utility

Instead of placing API logic directly inside controllers, we created a separate utility:

```text
utils/geocode.js
```

Its job is:

```text
location + country
        ↓
Geoapify
        ↓
lat + lng
```

The utility looks conceptually like:

```js
const geocode = async (location, country) => {

    const query = `${location},${country}`;

    // Build Geoapify request

    // Send request

    // Check response

    // Extract coordinates

    return {
        lat: result.lat,
        lng: result.lon
    };
};

module.exports = geocode;
```

This keeps the controller cleaner.

---

# 9. Why Use a Separate Utility?

Without a utility, the controller would contain all API details:

```text
Controller
 ├── build API URL
 ├── call API
 ├── parse response
 ├── validate result
 ├── handle errors
 └── save listing
```

With a utility:

```text
Controller
     ↓
geocode()
     ↓
Geoapify
```

The controller only needs to know:

```js
const coordinates = await geocode(location, country);
```

This is an example of **separation of concerns**.

---

# 10. Creating a Listing

When a new listing is created:

```text
User submits listing
        ↓
Express controller
        ↓
Read location + country
        ↓
Call geocode()
        ↓
Geoapify returns coordinates
        ↓
Set geometry
        ↓
Save listing
```

Example:

```js
const { location, country } = req.body.listing;

const geoCodeResult = await geocode(location, country);

newListing.geometry = {
    type: "Point",
    coordinates: [
        geoCodeResult.lng,
        geoCodeResult.lat
    ]
};
```

Then:

```js
await newListing.save();
```

---

# 11. Why Longitude Comes First When Saving

The geocoding utility returns:

```js
{
    lat: 15.3004543,
    lng: 74.0855134
}
```

But GeoJSON requires:

```text
[longitude, latitude]
```

Therefore:

```js
coordinates: [
    geoCodeResult.lng,
    geoCodeResult.lat
]
```

becomes:

```js
coordinates: [
    74.0855134,
    15.3004543
]
```

---

# 12. Updating a Listing

A listing can be edited.

Suppose:

```text
Manali → Goa
```

The coordinates must also change.

Therefore:

```text
Old Location
     ↓
Edit
     ↓
New Location
     ↓
Geocode
     ↓
New Coordinates
     ↓
Update geometry
```

Example:

```js
const locationChanged =
    listing.location !== req.body.listing.location ||
    listing.country !== req.body.listing.country;
```

Then:

```js
if (locationChanged) {

    const coordinates = await geocode(
        req.body.listing.location,
        req.body.listing.country
    );

    listing.geometry = {
        type: "Point",
        coordinates: [
            coordinates.lng,
            coordinates.lat
        ]
    };
}
```

---

# 13. Why Check Whether Location Changed?

Suppose the user edits only the title.

Example:

```text
Old:
Location = Goa

New:
Location = Goa
Title = "Beautiful Goa Stay"
```

There is no reason to call the geocoding API again.

So:

```text
Location changed?
    ↓
   NO
    ↓
Keep existing geometry
```

But:

```text
Location changed?
    ↓
   YES
    ↓
Call Geoapify
    ↓
Save new coordinates
```

This reduces unnecessary API calls.

---

# 14. Handling Invalid Locations

A user may enter:

```text
qwertyzzzz123
```

instead of a real place.

The geocoding utility checks whether Geoapify returned a valid result.

Conceptually:

```js
if (!data.results || data.results.length === 0) {
    throw new Error(`Could not find location: ${query}`);
}
```

The controller can catch the error:

```js
try {
    coordinates = await geocode(location, country);
} catch (error) {

    req.flash(
        "error",
        "We couldn't find this location. Please enter a valid place."
    );

    return res.redirect("/listings/new");
}
```

This gives the user a useful message instead of allowing invalid coordinates to be stored.

---

# 15. Important: Don't Use Fake Coordinates

Do NOT solve failed geocoding with:

```js
coordinates: [0, 0]
```

`[0, 0]` is a real geographical coordinate near the Gulf of Guinea.

If the location was not found, it is better to reject the listing than to save a fake location.

Correct flow:

```text
Geocoding fails
      ↓
Show error
      ↓
Don't save invalid listing
```

---

# 16. Migrating Existing Data

When the mapping feature was added, existing listings did not have geometry.

Example old document:

```js
{
    title: "Mountain Stay",
    location: "Manali",
    country: "India"
}
```

There was no:

```js
geometry
```

So a one-time migration script was created:

```text
init/geocodeListings.js
```

It finds:

```js
{
    geometry: {
        $exists: false
    }
}
```

Then geocodes each listing and saves its coordinates.

Flow:

```text
Existing listings
       ↓
Find listings without geometry
       ↓
Geocode one by one
       ↓
Save coordinates
```

In Journey, 30 old listings were migrated successfully.

After migration:

```text
31 total listings
31 listings with geometry
```

---

# 17. Why Migration Is Better Than Geocoding Every Page Load

Bad approach:

```text
User opens listing
      ↓
Call Geoapify
      ↓
Display map
```

Every page visit creates another API request.

Better approach:

```text
Listing created/updated
      ↓
Geocode once
      ↓
Store coordinates
      ↓
User opens listing
      ↓
Read coordinates from MongoDB
      ↓
Display map
```

This is more efficient and reduces external API usage.

---

# 18. Leaflet

**Leaflet** is the frontend JavaScript library used to create the interactive map.

Leaflet provides functionality such as:

* Map creation
* Zoom
* Panning
* Markers
* Popups
* Map interaction

Leaflet itself is not the geographical data provider.

It needs map tiles/styles from another source.

---

# 19. OpenFreeMap

Journey uses **OpenFreeMap** as the map provider.

The stack is:

```text
Leaflet
    ↓
MapLibre GL Leaflet binding
    ↓
MapLibre
    ↓
OpenFreeMap style
```

OpenFreeMap provides the actual map data/style.

No Google Maps API is required for this implementation.

---

# 20. MapLibre GL JS

OpenFreeMap's current integration with Leaflet uses MapLibre GL.

The page loads:

```html
<script src="[https://unpkg.com/leaflet@1.9.4/dist/leaflet.js](https://unpkg.com/leaflet@1.9.4/dist/leaflet.js)"></script>

<script src="[https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js](https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js)"></script>

<script src="[https://unpkg.com/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js](https://unpkg.com/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js)"></script>
```

Then the map can use:

```js
L.maplibreGL({
    style: "[https://tiles.openfreemap.org/styles/liberty](https://tiles.openfreemap.org/styles/liberty)"
}).addTo(map);
```

---

# 21. Creating the Map

The HTML page contains:

```html
<div id="map"></div>
```

CSS:

```css
#map {
    height: 400px;
    width: 100%;
    border-radius: 1rem;
}
```

Without a height, the map may technically exist but not be visible.

---

# 22. Passing Coordinates from EJS to JavaScript

MongoDB:

```js
geometry: {
    type: "Point",
    coordinates: [74.0855134, 15.3004543]
}
```

EJS can expose the values through HTML `data-*` attributes:

```html
<div id="map"
    data-lng="<%= listings.geometry.coordinates[0] %>"
    data-lat="<%= listings.geometry.coordinates[1] %>"
    data-title="<%= listings.title %>"
    data-location="<%= listings.location %>"
    data-country="<%= listings.country %>">
</div>
```

The browser receives:

```html
<div id="map"
    data-lng="74.0855134"
    data-lat="15.3004543">
</div>
```

JavaScript can then read those values.

---

# 23. EJS → JavaScript → Leaflet

The complete frontend flow is:

```text
MongoDB
    ↓
Express controller
    ↓
EJS
    ↓
data-lat / data-lng
    ↓
map.js
    ↓
Leaflet
```

Example:

```js
const mapElement = document.getElementById("map");

const lat = Number(mapElement.dataset.lat);
const lng = Number(mapElement.dataset.lng);
```

Then:

```js
const map = L.map("map").setView([lat, lng], 13);
```

---

# 24. Coordinate Order Again

This is extremely important.

MongoDB GeoJSON:

```text
[longitude, latitude]
```

Leaflet:

```text
[latitude, longitude]
```

Therefore:

```js
MongoDB:
[74.0855, 15.3004]
```

becomes:

```js
Leaflet:
[15.3004, 74.0855]
```

The correct code is:

```js
L.map("map").setView([lat, lng], 13);
```

NOT:

```js
L.map("map").setView([lng, lat], 13);
```

---

# 25. Marker

A marker can be added with:

```js
L.marker([lat, lng])
    .addTo(map);
```

This produces:

```text
📍
```

at the listing's location.

---

# 26. Popup

The marker can display information:

```js
L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`
        <strong>${title}</strong><br>
        ${location},${country}
    `)
    .openPopup();
```

Example:

```text
Geo_temp
Goa, India
```

This makes the map related to the current listing instead of being just a generic map.

---

# 27. Map Architecture in Journey

The final architecture is:

```text
                        JOURNEY

                    ┌─────────────────┐
                    │ User enters     │
                    │ Location        │
                    │ Country         │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express         │
                    │ Controller      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ geocode.js      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Geoapify        │
                    │ Geocoding API   │
                    └────────┬────────┘
                             │
                             ▼
                    latitude + longitude
                             │
                             ▼
                    ┌─────────────────┐
                    │ MongoDB         │
                    │ GeoJSON Point   │
                    └────────┬────────┘
                             │
                             ▼
                            EJS
                             │
                             ▼
                          map.js
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
             Leaflet                 Coordinates
                │
                ▼
             MapLibre
                │
                ▼
           OpenFreeMap
```

---

# 28. Why We Don't Put Everything in One File

A beginner may initially write:

```text
controller:
  call API
  create map
  render HTML
  handle everything
```

But separating responsibilities makes the application easier to understand and maintain.

Journey separates:

```text
Model
    ↓
stores data

Controller
    ↓
business logic

Utility
    ↓
geocoding API

EJS
    ↓
HTML

map.js
    ↓
map behavior
```

This is an example of **separation of concerns**.

---

# 29. Error Handling

External APIs can fail.

Possible problems:

```text
Invalid location
API unavailable
Network failure
API key problem
Rate limit
Malformed response
```

Therefore external API calls should be treated as operations that can fail.

Typical pattern:

```js
try {
    // external API call
}
catch (error) {
    // controlled handling
}
```

This pattern is widely useful in backend development.

---

# 30. API Usage Optimization

Because geocoding uses an external service:

Avoid:

```text
Every page load
    ↓
Geocode
```

Prefer:

```text
Create listing
    ↓
Geocode
    ↓
Save coordinates
```

and:

```text
Location changed
    ↓
Geocode again
```

This means the map itself doesn't need to call the geocoding service every time it is displayed.

---

# 31. Attribution

The map may display attribution such as:

```text
Leaflet | OpenFreeMap © OpenMapTiles | Data from OpenStreetMap
```

This should not be removed blindly.

OpenStreetMap/OpenMapTiles/OpenFreeMap data and services have attribution requirements.

Attribution tells users where the map data comes from.

It is normal for open-source/open-data mapping systems to display attribution.

---

# 32. Free Mapping Stack Used in Journey

The mapping stack was intentionally selected to avoid billing/card requirements.

```text
Geocoding:
Geoapify

Interactive Map:
Leaflet

Map Rendering:
MapLibre GL

Map Provider:
OpenFreeMap

Database:
MongoDB
```

The important distinction is:

```text
Geoapify
= converts location → coordinates

OpenFreeMap
= provides map style/data

Leaflet
= interactive map library

MapLibre
= renders vector map style inside Leaflet

MongoDB
= stores coordinates
```

---

# 33. Common Mistakes

## Mistake 1 — Latitude/Longitude order

Wrong:

```js
coordinates: [lat, lng]
```

Correct GeoJSON:

```js
coordinates: [lng, lat]
```

---

## Mistake 2 — Calling geocoding on every page load

Avoid:

```text
show listing
   ↓
Geoapify
```

Store the coordinates instead.

---

## Mistake 3 — Exposing API keys

Never put:

```js
GEOAPIFY_API_KEY
```

inside public frontend JavaScript.

Keep the key on the backend in `.env`.

---

## Mistake 4 — Saving fake coordinates

Don't use:

```js
[0, 0]
```

when geocoding fails.

---

## Mistake 5 — Forgetting existing database records

When adding a new field to a production database, old documents may not have that field.

Possible solutions:

```text
Migration
Lazy migration
Default values
```

Journey used a one-time migration script.

---

## Mistake 6 — Loading map libraries in the wrong order

If:

```js
L.map(...)
```

runs before Leaflet is loaded:

```text
L is not defined
```

Correct order:

```text
Leaflet
   ↓
MapLibre
   ↓
MapLibre-Leaflet binding
   ↓
map.js
```

---

# 34. Debugging the Journey Map

Useful checks:

### Check MongoDB

```js
db.listings.find(
    {},
    {
        title: 1,
        location: 1,
        country: 1,
        geometry: 1
    }
)
```

### Check listings without coordinates

```js
db.listings.countDocuments({
    geometry: { $exists: false }
})
```

Expected after migration:

```text
0
```

### Check browser console

Useful information:

```js
console.log("Latitude:", lat);
console.log("Longitude:", lng);
```

### If `L is not defined`

Check whether Leaflet JavaScript loaded before `map.js`.

### If the map area is gray

The Leaflet map may be working while map tiles are failing.

Check:

```text
Browser Console
Network tab
MapLibre/OpenFreeMap resources
```

---

# 35. Final Journey Feature

The completed feature works like this:

```text
                    CREATE LISTING

Location: Manali
Country: India
        ↓
Geoapify
        ↓
32.2454608
77.1872926
        ↓
MongoDB

geometry: {
    type: "Point",
    coordinates: [
        77.1872926,
        32.2454608
    ]
}
```

Then:

```text
                    SHOW LISTING

MongoDB coordinates
        ↓
EJS
        ↓
map.js
        ↓
Leaflet
        ↓
MapLibre
        ↓
OpenFreeMap
        ↓
📍 Map Marker
```

---

# 36. Key Concepts Learned

This feature demonstrates several important full-stack concepts:

### API Integration

Calling an external API from a Node.js backend.

### Environment Variables

Keeping secrets such as API keys out of source code.

### Derived Data

Generating coordinates from user-provided location data.

### GeoJSON

Representing geographical data in a standard structure.

### MongoDB Geospatial Data

Storing geographical coordinates as `Point` data.

### Separation of Concerns

Keeping geocoding logic in a utility rather than mixing everything into the controller.

### Data Migration

Updating existing database records after changing the schema.

### Error Handling

Handling external API failures safely.

### API Optimization

Avoiding unnecessary external API calls.

### Frontend/Backend Data Flow

```text
MongoDB
   ↓
Express
   ↓
EJS
   ↓
JavaScript
   ↓
Map library
```

---

# 37. Mental Model to Remember

The simplest way to remember the entire feature:

```text
PLACE NAME
    ↓
GEOCODING
    ↓
COORDINATES
    ↓
DATABASE
    ↓
MAP
```

Or:

```text
"Where?"
    ↓
"Where exactly?"
    ↓
"Store it"
    ↓
"Show it"
```

---

# 38. Journey Implementation Files

The main files involved in the feature are:

```text
models/listing.js
    ↓
Stores geometry

utils/geocode.js
    ↓
Talks to Geoapify

controllers/listings.js
    ↓
Geocodes create/update operations

init/geocodeListings.js
    ↓
One-time migration for old listings

views/listings/show.ejs
    ↓
Displays map container and passes coordinates

public/js/map.js
    ↓
Initializes Leaflet and marker

public/css/style.css
    ↓
Styles map container

views/layouts/boilerplate.ejs
    ↓
Loads Leaflet CSS/global frontend dependencies
```

---

# 39. General Pattern for Future Projects

The Journey implementation can be generalized.

Whenever a project needs external geographic data:

```text
User Input
    ↓
Backend
    ↓
External API
    ↓
Validate Response
    ↓
Transform Data
    ↓
Store Important Data
    ↓
Frontend
```

This same architecture can be used for:

```text
Weather APIs
Payment APIs
AI APIs
Email APIs
SMS APIs
Maps APIs
Search APIs
Translation APIs
```

The provider changes, but the underlying engineering pattern stays similar.