# Express Router

> **Quick Goal:** Use `express.Router()` to split routes into separate files/modules so the main `app.js` does not become unnecessarily large.

---

## 📌 What's Inside This File?

1. [Why Express Router?](#1-why-express-router)
2. [`express.Router()`](#2-expressrouter)
3. [Creating a Router File](#3-creating-a-router-file)
4. [Defining Routes](#4-defining-routes)
5. [Exporting the Router](#5-exporting-the-router)
6. [Mounting the Router](#6-mounting-the-router)
7. [How the Paths Work](#7-how-the-paths-work)
8. [Organizing Multiple Routers](#8-organizing-multiple-routers)
9. [Complete Example](#9-complete-example)
10. [Quick Reference](#10-quick-reference)

---

# 1. Why Express Router?

As an Express application grows, putting every route inside one `app.js` makes it difficult to read and maintain.

Instead of:

```text
app.js
 ├── users routes
 ├── posts routes
 ├── listings routes
 ├── reviews routes
 └── ...
```

we can separate them:

```text
app.js
   ↓
routes/
   ├── user.js
   └── post.js
```

### Idea

```text
Main application
      ↓
Connect different route modules
      ↓
Each file handles a particular group of routes
```

This keeps the main file clean and organized.

---

# 2. `express.Router()`

`express.Router()` creates a **new router object**.

```js
const express = require("express");

const router = express.Router();
```

The router works similarly to the Express `app` for defining routes:

```js
router.get(...)
router.post(...)
router.patch(...)
router.delete(...)
```

But these routes belong to the router instead of the main application.

---

# 3. Creating a Router File

Example project:

```text
MAJORPROJECT/
│
├── classroom/
│   ├── routes/
│   │   ├── user.js
│   │   └── post.js
│   │
│   └── server.js
│
├── models/
├── public/
├── views/
└── ...
```

Create:

```text
routes/post.js
```

Inside:

```js
const express = require("express");

const router = express.Router();
```

Now this file can contain all post-related routes.

---

# 4. Defining Routes

Instead of:

```js
app.get("/posts", ...);
```

inside the main file, use:

```js
router.get("/posts", (req, res) => {

    res.send("GET for posts");

});
```

Other routes:

```js
router.get("/posts/:id", (req, res) => {

    res.send("GET for post id");

});


router.post("/posts", (req, res) => {

    res.send("POST for posts");

});


router.delete("/posts/:id", (req, res) => {

    res.send("DELETE for post id");

});
```

---

# 5. Exporting the Router

At the end of the router file:

```js
module.exports = router;
```

Now another file can import it.

---

# 6. Mounting the Router

In the main server file:

```js
const express = require("express");

const app = express();

const posts = require("./routes/post.js");
```

Then mount it:

```js
app.use("/posts", posts);
```

Now the router handles requests starting with:

```text
/posts
```

---

# 7. How the Paths Work

This is the most important part to understand.

Suppose `post.js` contains:

```js
router.get("/", (req, res) => {
    res.send("GET for posts");
});
```

and `server.js` contains:

```js
app.use("/posts", posts);
```

The final path becomes:

```text
/posts
```

Because:

```text
app.use("/posts", router)
                +
router.get("/")
                ↓
         GET /posts
```

---

## Another Example

Router:

```js
router.get("/:id", (req, res) => {

    res.send("GET for post id");

});
```

Mounted at:

```js
app.use("/posts", posts);
```

Final route:

```text
GET /posts/:id
```

So:

```text
Router path      → /:id

Mounted path     → /posts

Final path       → /posts/:id
```

### Mental Model

```text
app.use("/posts", router)
        +
router.get("/:id", ...)
        ↓
GET /posts/:id
```

---

# 8. Organizing Multiple Routers

You can create separate routers for different resources.

```text
routes/
├── user.js
└── post.js
```

### `user.js`

```js
const express = require("express");

const router = express.Router();


router.get("/", (req, res) => {

    res.send("GET for users");

});


router.get("/:id", (req, res) => {

    res.send("GET for user id");

});


router.post("/", (req, res) => {

    res.send("POST for users");

});


router.delete("/:id", (req, res) => {

    res.send("DELETE for user id");

});


module.exports = router;
```

### `post.js`

```js
const express = require("express");

const router = express.Router();


router.get("/", (req, res) => {

    res.send("GET for posts");

});


router.get("/:id", (req, res) => {

    res.send("GET for post id");

});


router.post("/", (req, res) => {

    res.send("POST for posts");

});


router.delete("/:id", (req, res) => {

    res.send("DELETE for post id");

});


module.exports = router;
```

---

# 9. Complete Example

## Project Structure

```text
classroom/
│
├── routes/
│   ├── user.js
│   └── post.js
│
└── server.js
```

---

## `routes/post.js`

```js
const express = require("express");

const router = express.Router();


// -----------------------------
// Index
// GET /posts
// -----------------------------

router.get("/", (req, res) => {

    res.send("GET for posts");

});


// -----------------------------
// Show
// GET /posts/:id
// -----------------------------

router.get("/:id", (req, res) => {

    res.send("GET for post id");

});


// -----------------------------
// Create
// POST /posts
// -----------------------------

router.post("/", (req, res) => {

    res.send("POST for posts");

});


// -----------------------------
// Delete
// DELETE /posts/:id
// -----------------------------

router.delete("/:id", (req, res) => {

    res.send("DELETE for post id");

});


module.exports = router;
```

---

## `routes/user.js`

```js
const express = require("express");

const router = express.Router();


// -----------------------------
// Index
// GET /users
// -----------------------------

router.get("/", (req, res) => {

    res.send("GET for users");

});


// -----------------------------
// Show
// GET /users/:id
// -----------------------------

router.get("/:id", (req, res) => {

    res.send("GET for user id");

});


// -----------------------------
// Create
// POST /users
// -----------------------------

router.post("/", (req, res) => {

    res.send("POST for users");

});


// -----------------------------
// Delete
// DELETE /users/:id
// -----------------------------

router.delete("/:id", (req, res) => {

    res.send("DELETE for user id");

});


module.exports = router;
```

---

## `server.js`

```js
const express = require("express");

const app = express();


// Import routers

const users = require("./routes/user.js");

const posts = require("./routes/post.js");


// Root route

app.get("/", (req, res) => {

    res.send("Hi, I am root!");

});


// Mount routers

app.use("/users", users);

app.use("/posts", posts);


// Start server

app.listen(3000, () => {

    console.log("Server is listening to 3000");

});
```

---

## Final Routes

Because the routers are mounted in `server.js`:

### Users

```text
GET    /users
GET    /users/:id
POST   /users
DELETE /users/:id
```

### Posts

```text
GET    /posts
GET    /posts/:id
POST   /posts
DELETE /posts/:id
```

The route files contain only the **resource-specific paths**.

The main `server.js` adds the common prefix.

---

# 10. Quick Reference

### Create router

```js
const router = express.Router();
```

### Define route

```js
router.get("/", handler);
router.post("/", handler);
router.patch("/:id", handler);
router.delete("/:id", handler);
```

### Export

```js
module.exports = router;
```

### Import

```js
const posts = require("./routes/post.js");
```

### Mount

```js
app.use("/posts", posts);
```

### Final path

```text
Mounted path + Router path
```

Example:

```text
/posts + /:id
        ↓
GET /posts/:id
```

---

## 🧠 Quick Recap

Without Router:

```text
server.js
 ├── users
 ├── posts
 ├── comments
 ├── ...
 └── hundreds of lines
```

With Router:

```text
server.js
   ↓
 ├── user router
 ├── post router
 └── comment router
```

Each router handles a particular group of related routes.

### Core Idea

> **`express.Router()` lets us create modular route files. Define resource-specific routes inside the router, export it, and mount it in the main application using `app.use()`.**