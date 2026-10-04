<div align="center">

# 🏕️ Journey

### Find your next stay. List it. Review it. Map it.

A full-stack **Airbnb-style** travel listings app with auth, image uploads, reviews, category filters & live maps.

<br>

[![Live Demo](https://img.shields.io/badge/🌍_Live_Demo-journey--9neo.onrender.com-20D4FF?style=for-the-badge&logo=render&logoColor=white)](https://journey-9neo.onrender.com/listings)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License ISC](https://img.shields.io/badge/License-ISC-F97316?style=for-the-badge)](./package.json)

**👉 Prototype:** https://journey-9neo.onrender.com/listings

</div>

---

## ✨ Features

| 🎯 Area | 💡 What it does |
|---|---|
| 🏠 **Listings CRUD** | Create / edit / delete stays, owner-only edit/delete — `controllers/listings.js`, `middleware.js:26` |
| 🔐 **Auth** | Signup / login / logout with Passport Local + `passport-local-mongoose` — `models/user.js` |
| ⭐ **Reviews** | 1–5 star ratings, author-only delete — `middleware.js:56` |
| 🏷️ **Categories** | `trending`, `rooms`, `iconic-cities`, `mountains`, `castles`, `pools`, `camping`, `farms`, `arctic` |
| 🖼️ **Images** | Multer → Cloudinary upload + transform — `cloudConfig.js` |
| 🗺️ **Maps + Geocoding** | Geoapify → GeoJSON `geometry` → Leaflet + MapLibre map — `utils/geocode.js`, `public/js/map.js` |
| 💬 **UX** | Sessions in MongoDB, flash messages, Joi validation, pretty error page — `schema.js`, `views/error.ejs` |
| 🌱 **Seed** | Sample data loader — `init/` |

---

## 🛠️ Tech Stack

<div align="center">

### ⚡ Core
[![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Mongoose](https://img.shields.io/badge/Mongoose_9-880000?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![EJS](https://img.shields.io/badge/EJS_Templates-A91E50?style=for-the-badge&logo=ejs&logoColor=white)](https://ejs.co)
[![ejs-mate](https://img.shields.io/badge/ejs--mate-8B5CF6?style=for-the-badge)](https://github.com/JacksonTian/ejs-mate)

### 🔐 Auth / Session / Validation
[![Passport](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)](http://www.passportjs.org)
[![express-session](https://img.shields.io/badge/express--session-2596BE?style=for-the-badge)](https://github.com/expressjs/session)
[![connect-mongo](https://img.shields.io/badge/connect--mongo-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://github.com/jdesboeufs/connect-mongo)
[![connect-flash](https://img.shields.io/badge/connect--flash-FFB300?style=for-the-badge)](https://github.com/jaredhanson/connect-flash)
[![Joi](https://img.shields.io/badge/Joi_Validation-EC3750?style=for-the-badge)](https://joi.dev)
[![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)](https://github.com/motdotla/dotenv)
[![method-override](https://img.shields.io/badge/method--override-6B7280?style=for-the-badge)](https://github.com/expressjs/method-override)

### 🎨 Frontend
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-538DD7?style=for-the-badge&logo=fontawesome&logoColor=white)](https://fontawesome.com)
[![Leaflet](https://img.shields.io/badge/Leaflet_1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![MapLibre](https://img.shields.io/badge/MapLibre_GL-396CB2?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org)
[![OpenFreeMap](https://img.shields.io/badge/OpenFreeMap-20D4FF?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://openfreemap.org)

### ☁️ Uploads / APIs / Deploy
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Multer](https://img.shields.io/badge/Multer-FF0800?style=for-the-badge)](https://github.com/expressjs/multer)
[![Geoapify](https://img.shields.io/badge/Geoapify_Geocoding-00A699?style=for-the-badge&logo=googlemaps&logoColor=white)](https://www.geoapify.com)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![MongoDB Atlas](https://img.shields.io/badge/Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Manoj-Kumar-V-008/Journey)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com)

<br>

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb,js,html,css,bootstrap,git,github,vscode,npm&theme=light)](https://skillicons.dev)

</div>

---

## 🗂️ Project Structure

```
📦 Journey
 ┣ 📜 app.js            → Express app, session, passport, routes, error handler
 ┣ 📜 cloudConfig.js    → Cloudinary + Multer storage
 ┣ 📜 middleware.js     → isLoggedIn, isOwner, isReviewAuthor, Joi validators
 ┣ 📜 schema.js         → Joi listingSchema + reviewSchema
 ┣ 📁 models/           → listing.js, review.js, user.js
 ┣ 📁 routes/           → listings.js, reviews.js, user.js
 ┣ 📁 controllers/      → listings.js, reviews.js, users.js
 ┣ 📁 views/            → layouts/boilerplate.ejs, listings/, users/, includes/, error.ejs
 ┣ 📁 public/           → css/style.css, css/rating.css, js/script.js, js/map.js
 ┣ 📁 utils/            → wrapAsync.js, ExpressError.js, geocode.js
 ┗ 📁 init/             → data.js + index.js seed script
```

---

## 🚀 Run Locally

**1️⃣ Clone + install**
```bash
git clone https://github.com/Manoj-Kumar-V-008/Journey.git
cd Journey
npm install
```

**2️⃣ Create `.env`** _(gitignored — never commit)_
```env
ATLAS_DB_URL=mongodb://127.0.0.1:27017/journey
SECRET=your-session-secret
CLOUD_NAME=xxx
CLOUD_API_KEY=xxx
CLOUD_API_SECRET=xxx
GEOAPIFY_API_KEY=xxx
```

**3️⃣ Optional seed**
```bash
node init/index.js
```

**4️⃣ Start**
```bash
npm start
# → http://localhost:8080/listings
```

---

## 🌐 Deploy Notes (Render)

> `package.json` already has `"start": "node app.js"` and `app.js:134` listens on `process.env.PORT || 8080`.

- ✅ Build Command: `npm install` · Start Command: `npm start`
- ✅ Add all `.env` vars in **Render Dashboard → Environment**
- ✅ Atlas **Network Access → `0.0.0.0/0`**
- 🐞 `GET / → 500`? Check **Logs** for `MongoStore`, `secret required`, Geoapify or Cloudinary auth errors.

---

## 🧭 Routes

- `GET /listings` — index + `?category=...`
- `GET /listings/new` — new form 🔒
- `POST /listings` — create + image upload 🔒
- `GET /listings/:id` — show + map + reviews
- `PUT /listings/:id`, `DELETE /listings/:id` — owner only 🔒
- `POST /listings/:id/reviews`, `DELETE /listings/:id/reviews/:reviewId` 🔒
- `GET /signup`, `GET /login`, `GET /logout`

<div align="center">

### 💙 Built with Node + Express + MongoDB
**⭐ Star the repo if you like it!**

[![GitHub Repo](https://img.shields.io/badge/⭐_GitHub-Manoj--Kumar--V--008/Journey-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Manoj-Kumar-V-008/Journey)
[![Live](https://img.shields.io/badge/🚀_Try_Live_Demo-20D4FF?style=for-the-badge)](https://journey-9neo.onrender.com/listings)

</div>
