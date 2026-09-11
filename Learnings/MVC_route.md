# MVC Architecture & `router.route()` — Project Learnings

> **Purpose:** Make the Express project cleaner, more maintainable, less repetitive, and easier to understand.

---

## 1. MVC Architecture

MVC stands for:

```text
M → Model
V → View
C → Controller
```

### Model

Handles the **data and database logic**.

Example:

```text
models/
├── listing.js
├── review.js
└── user.js
```

Models contain the Mongoose schemas and models.

---

### View

Handles what the **user sees**.

Example:

```text
views/
├── listings/
├── users/
├── reviews/
└── includes/
```

For this project, EJS files are used as views.

---

### Controller

Handles the **application logic for a request**.

Instead of putting all logic directly inside the route:

```js
router.get("/", async (req, res) => {

    const listings = await Listing.find({});

    res.render("listings/index.ejs", {
        listings
    });

});
```

we can move the logic into a controller:

```js
module.exports.index = async (req, res) => {

    const listings = await Listing.find({});

    res.render("listings/index.ejs", {
        listings
    });

};
```

Then the route becomes:

```js
router.get("/", wrapAsync(listingController.index));
```

### Main idea

```text
Route
  ↓
Controller
  ↓
Model / Database
  ↓
Controller
  ↓
View / Response
```

---

# 2. Why Use MVC?

Without MVC:

```text
Route file
 ├── database logic
 ├── validation
 ├── business logic
 ├── rendering
 └── error handling
```

As the project grows, the file becomes difficult to maintain.

With MVC:

```text
routes/
    ↓
controllers/
    ↓
models/

controllers/
    ↓
views/
```

Each part has a clearer responsibility.

### Benefits

```text
Less clutter
Better readability
Less repetition
Easier debugging
Easier maintenance
Easier to extend the project
```

---

# 3. `router.route()`

When multiple HTTP methods use the **same path**, `router.route()` can make the route code more compact.

Without it:

```js
router.get("/:id", show);

router.patch("/:id", update);

router.delete("/:id", destroy);
```

The path:

```text
/:id
```

is repeated three times.

---

## Using `router.route()`

```js
router.route("/:id")

    .get(show)

    .patch(update)

    .delete(destroy);
```

Now the path is written only once.

---

# 4. Example

### Before

```js
router.get("/:id", async (req, res) => {

    // show listing

});


router.patch("/:id", async (req, res) => {

    // update listing

});


router.delete("/:id", async (req, res) => {

    // delete listing

});
```

### After

```js
router.route("/:id")

    .get(async (req, res) => {

        // show listing

    })

    .patch(async (req, res) => {

        // update listing

    })

    .delete(async (req, res) => {

        // delete listing

    });
```

The functionality is the same.

The second version simply avoids repeating the path.

---

# 5. `router.route()` With Controllers

This becomes even cleaner when MVC is used.

```js
router.route("/:id")

    .get(
        wrapAsync(listingController.show)
    )

    .patch(
        wrapAsync(listingController.update)
    )

    .delete(
        wrapAsync(listingController.destroy)
    );
```

Now the route file mainly describes:

```text
HTTP method
    +
URL
    +
Controller
```

instead of containing all the application logic.

---

# 6. RESTful Route Organization

For a resource such as:

```text
/listings
```

we can organize routes like this:

```js
router.route("/")

    .get(
        wrapAsync(listingController.index)
    )

    .post(
        wrapAsync(listingController.create)
    );
```

For an individual listing:

```js
router.route("/:id")

    .get(
        wrapAsync(listingController.show)
    )

    .patch(
        wrapAsync(listingController.update)
    )

    .delete(
        wrapAsync(listingController.destroy)
    );
```

This clearly shows the REST operations.

```text
/                      → collection

GET                    → index

POST                   → create


/:id                   → individual resource

GET                    → show
PATCH                  → update
DELETE                 → destroy
```

---

# 7. The Main Learning

The important lesson is not only:

```js
router.route()
```

The bigger lesson is:

> **Don't repeat code structure when the same information can be defined once.**

For example:

```js
router.get("/:id", ...);
router.patch("/:id", ...);
router.delete("/:id", ...);
```

can become:

```js
router.route("/:id")
    .get(...)
    .patch(...)
    .delete(...);
```

This improves:

```text
Readability
Organization
Maintainability
```

---

# 8. Project Structure

A cleaner Express project can look like:

```text
project/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── views/
│   ├── listings/
│   ├── reviews/
│   ├── users/
│   └── includes/
│
├── utils/
│   └── wrapAsync.js
│
└── app.js
```

### Responsibility

```text
routes/
→ Which URL + method?

controllers/
→ What should happen?

models/
→ How is data stored?

views/
→ What should the user see?
```

---

# 9. Quick Example

### Route

```js
router.route("/:id")

    .get(
        wrapAsync(listingController.show)
    )

    .patch(
        wrapAsync(listingController.update)
    )

    .delete(
        wrapAsync(listingController.destroy)
    );
```

### Controller

```js
module.exports.show = async (req, res) => {

    const { id } = req.params;

    const listing =
        await Listing.findById(id);

    res.render(
        "listings/show.ejs",
        { listing }
    );

};
```

The route does not need to know how the listing is fetched.

The controller handles that.

---

# ✅ What I Learned

```text
1. MVC separates responsibilities in the application.

2. Models handle database/data logic.

3. Views handle the UI/output.

4. Controllers handle request/application logic.

5. Moving logic into controllers keeps route files cleaner.

6. router.route() groups multiple HTTP methods
   that use the same path.

7. router.route() reduces repeated paths and
   improves readability.

8. Combining MVC + router.route() makes Express
   applications easier to maintain as they grow.
```

### Core Idea

> **Good backend code is not only about making the application work. It is also about organizing the code so that another change does not turn into a mess.**