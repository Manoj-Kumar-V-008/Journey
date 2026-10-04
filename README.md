# Journey

A full-stack travel listings app (Airbnb clone) — browse, create, edit, review and map stay listings with auth, image uploads and category filtering.

**Live prototype demo:** https://journey-9neo.onrender.com/listings

## Features

- Listings CRUD with owner-only edit/delete (`controllers/listings.js`, `middleware.js:26`)
- Auth with Passport Local + `passport-local-mongoose` (`models/user.js`, `routes/user.js`)
- Reviews with 1–5 star rating, author-only delete (`models/review.js`, `middleware.js:56`)
- Category filter: `trending, rooms, iconic-cities, mountains, castles, pools, camping, farms, arctic` (`controllers/listings.js:148`)
- Image upload via Multer → Cloudinary (`cloudConfig.js`, `routes/listings.js:11`)
- Geocoding via Geoapify API → GeoJSON `geometry` on Listing (`utils/geocode.js`, `models/listing.js:26`)
- Map display with Leaflet + MapLibre GL + OpenFreeMap (`public/js/map.js`)
- Session store in MongoDB, flash messages, Joi validation, central error page (`app.js`, `schema.js`, `views/error.ejs`)
- Seed data in `init/` (`init/index.js`, `init/data.js`)

## Tech Used

### Backend
- Node.js `22.21.0` (`package.json:2`)
- Express `^5.2.1`, `ejs` + `ejs-mate` layouts (`app.js:25`)
- Mongoose `^9.9.3` + MongoDB Atlas / local MongoDB
- `passport`, `passport-local`, `passport-local-mongoose`
- `express-session` + `connect-mongo`, `connect-flash`
- `method-override`, `dotenv`, `joi` (`schema.js`)
- `multer`, `multer-storage-cloudinary`, `cloudinary`
- `utils/geocode.js` uses Node `fetch` → Geoapify Geocode API

### Frontend
- EJS templates (`views/listings/`, `views/users/`, `views/layouts/boilerplate.ejs`)
- Bootstrap `5.3.8`, Font Awesome `7.3.1`
- Leaflet `1.9.4` (`package.json:26`), MapLibre GL, OpenFreeMap tiles
- Custom `public/css/style.css`, `public/css/rating.css`, `public/js/script.js`, `public/js/map.js`

### Services / Deployment
- MongoDB Atlas (prod) — `ATLAS_DB_URL`
- Cloudinary image storage — `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`
- Geoapify Geocoding — `GEOAPIFY_API_KEY`
- Render Web Service — Build: `npm install`, Start: `npm start`, listens on `process.env.PORT || 8080` (`app.js:134`)

## Project Structure

```
app.js            # Express app, session, passport, routes, error handler
cloudConfig.js    # Cloudinary + Multer storage
middleware.js     # isLoggedIn, isOwner, isReviewAuthor, Joi validators
schema.js         # Joi listingSchema + reviewSchema
models/           # listing.js, review.js, user.js
routes/           # listings.js, reviews.js, user.js
controllers/      # listings.js, reviews.js, users.js
views/            # layouts/boilerplate.ejs, listings/, users/, includes/, error.ejs
public/           # css/, js/map.js
utils/            # wrapAsync.js, ExpressError.js, geocode.js
init/             # data.js + index.js seed script
```

## Run Locally

1. Clone + install:
```bash
git clone https://github.com/Manoj-Kumar-V-008/Journey.git
cd Journey
npm install
```

2. Create `.env` (never commit — already in `.gitignore`):
```
ATLAS_DB_URL=mongodb://127.0.0.1:27017/journey
SECRET=your-session-secret
CLOUD_NAME=xxx
CLOUD_API_KEY=xxx
CLOUD_API_SECRET=xxx
GEOAPIFY_API_KEY=xxx
```

3. Optional seed:
```bash
node init/index.js
```

4. Start:
```bash
npm start
# http://localhost:8080/listings
```

## Render Deploy Notes

- `package.json` must have `"start": "node app.js"`.
- Set all env vars above in Render Dashboard > Environment (`.env` is gitignored).
- Atlas Network Access must allow Render: `0.0.0.0/0`.
- If `/` returns 500, check Render Logs for `MongoStore`, `secret required`, `Geoapify`, or Cloudinary auth errors.

## Routes

- `GET /listings` — index + `?category=...`
- `GET /listings/new` — new form (login)
- `POST /listings` — create + image upload
- `GET /listings/:id` — show + map + reviews
- `PUT /listings/:id`, `DELETE /listings/:id` — owner only
- `POST /listings/:id/reviews`, `DELETE /listings/:id/reviews/:reviewId`
- `GET /signup`, `GET /login`, `GET /logout`
