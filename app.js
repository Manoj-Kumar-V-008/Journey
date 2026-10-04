if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");

//using express router
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const dbUrl = process.env.ATLAS_DB_URL;
const secret = process.env.SECRET;

if (!dbUrl || !secret) {
    console.error("FATAL: ATLAS_DB_URL and SECRET env vars are required. Set them in Render Dashboard > Environment.");
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secret || "fallback-dev-secret-only",
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("Error in Mongo Session Store", err);
})

const sessionOption = {
    store: store,
    secret: secret || "fallback-dev-secret-only",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,//days*hrs*min*sec*millisec
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


app.use(session(sessionOption));
app.use(flash());//use before routes


//Implementing passport for Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//using flash for create route
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;//locals are used to be accessed in ejs files
    next();
});

// use static serialize(to serialize users into the session) and
//  deserialize(to deserialize users into the session) of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// //Adding Demo User
// app.get("/demouser",wrapAsync(async (req,res)=>{
//     let fakeUser = new User({
//         username:"Fake-User",
//         email:"fakeuser@gmail.com"
//     });
//     let registeredUser = await User.register(fakeUser,"password");
//     res.send(registeredUser); 
// }));

app.get("/", (req, res) => {
    res.send("Server is working");
});

async function main() {
    await mongoose.connect(
        dbUrl
    );
}

main()
    .then(() => {
        console.log("connection Successful");
    })
    .catch(err => console.log(err));



//for routing from '/routes/listings.js'
app.use("/listings", listingsRouter)

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", userRouter);

//if user tries to access undefined route 
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});


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


