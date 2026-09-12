# `.env` Files & Environment Variables

> **Quick Goal:** Store sensitive/configuration values outside the source code and access them in Node.js using `dotenv`. This is especially useful for things like Cloudinary credentials, database URLs, session secrets, and API keys.

---

## 📌 What's Inside This File?

1. [Why `.env` Files?](#1-why-env-files)
2. [Creating the `.env` File](#2-creating-the-env-file)
3. [`.env` File Format](#3-env-file-format)
4. [Installing `dotenv`](#4-installing-dotenv)
5. [Loading Environment Variables](#5-loading-environment-variables)
6. [Using `process.env`](#6-using-processenv)
7. [Cloudinary Example](#7-cloudinary-example)
8. [`.gitignore`](#8-gitignore)
9. [Important Rules](#9-important-rules)
10. [Complete Example](#10-complete-example)
11. [Quick Reference](#11-quick-reference)

---

# 1. Why `.env` Files?

Suppose we write this directly in our code:

```js
const cloudName = "my-cloud-name";
const apiKey = "123456789";
const apiSecret = "my-secret";
```

This is a bad practice because:

```text
Credentials are inside source code
        ↓
Easy to accidentally upload to GitHub
        ↓
Security risk
```

Instead, store them in a `.env` file:

```text
.env
   ↓
Environment variables
   ↓
Application reads them
```

This keeps configuration values separate from the code.

Common things stored in `.env`:

```text
Database URI
Cloudinary credentials
Session secret
API keys
JWT secret
Application configuration
```

---

# 2. Creating the `.env` File

Create a file named:

```text
.env
```

Usually at the root of the project:

```text
project/
│
├── .env
├── .gitignore
├── package.json
├── app.js
└── ...
```

Example:

```text
.env
```

---

# 3. `.env` File Format

The basic format is:

```text
KEY=VALUE
```

Example:

```env
CLOUDINARY_CLOUD_NAME=mycloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=mysecret
SESSION_SECRET=mySessionSecret
MONGO_URI=mongodb://127.0.0.1:27017/journey
```

### Important

Do **not** normally write:

```env
CLOUDINARY_API_KEY = 123456789
```

Prefer:

```env
CLOUDINARY_API_KEY=123456789
```

Keep variable names clear and consistent.

---

## Comments

You can add comments using:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=mycloud
CLOUDINARY_API_KEY=123456789
```

---

# 4. Installing `dotenv`

Install:

```bash
npm install dotenv
```

`dotenv` loads values from your `.env` file into:

```js
process.env
```

---

# 5. Loading Environment Variables

### CommonJS

```js
require("dotenv").config();
```

Put this near the start of your application:

```js
require("dotenv").config();

const express = require("express");

const app = express();
```

Now the variables from `.env` are available through:

```js
process.env
```

---

## Modern Alternative

You may also see:

```js
const dotenv = require("dotenv");

dotenv.config();
```

Same idea:

```text
.env
 ↓
dotenv.config()
 ↓
process.env
```

---

# 6. Using `process.env`

Suppose `.env` contains:

```env
PORT=3000
APP_NAME=Journey
```

Then:

```js
console.log(process.env.PORT);

console.log(process.env.APP_NAME);
```

Output:

```text
3000
Journey
```

Example:

```js
const port = process.env.PORT || 3000;
```

If `PORT` is not present, it uses:

```text
3000
```

---

## Important: Environment Variables Are Strings

Even if you write:

```env
PORT=3000
```

Node reads it as a string:

```js
process.env.PORT
```

is:

```js
"3000"
```

not:

```js
3000
```

When a number is required:

```js
const port = Number(process.env.PORT);
```

---

# 7. Cloudinary Example

Since Cloudinary is being used for image/file storage, its credentials should not be hardcoded.

Instead of:

```js
cloudinary.config({
    cloud_name: "mycloud",
    api_key: "123456789",
    api_secret: "mysecret"
});
```

use `.env`.

---

## `.env`

```env
CLOUDINARY_CLOUD_NAME=mycloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=mysecret
```

Then:

```js
require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({

    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
        process.env.CLOUDINARY_API_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET

});
```

### Flow

```text
.env
 ↓
dotenv
 ↓
process.env
 ↓
cloudinary.config()
 ↓
Cloudinary
```

---

# 8. `.gitignore`

The biggest reason for using `.env` is that it should not be committed to GitHub.

Add this to:

```text
.gitignore
```

```gitignore
.env
```

You can also ignore:

```gitignore
node_modules/
.env
```

Now:

```text
.env
   ↓
ignored by Git
   ↓
not uploaded to GitHub
```

---

## Important

Never assume `.gitignore` protects a secret that was **already committed**.

If a real secret is accidentally pushed to GitHub:

```text
Remove it from the repository
+
Rotate/change the secret
```

Simply deleting the file later does not make the exposed credential safe.

---

# 9. Important Rules

## 1. Never hardcode secrets

Bad:

```js
const secret = "myRealSecret";
```

Better:

```js
const secret =
    process.env.SESSION_SECRET;
```

---

## 2. Don't upload `.env`

```gitignore
.env
```

---

## 3. Keep variable names clear

Good:

```env
MONGO_URI=...
CLOUDINARY_API_KEY=...
SESSION_SECRET=...
```

Avoid unclear names such as:

```env
x=...
abc=...
temp=...
```

---

## 4. `.env` is configuration, not application code

Think:

```text
Code
 ↓
How the application works

.env
 ↓
Configuration / environment-specific values
```

---

## 5. Different environments can have different values

For example:

```text
Development
    ↓
Local MongoDB

Production
    ↓
Cloud database
```

Your code can remain the same:

```js
mongoose.connect(
    process.env.MONGO_URI
);
```

Only the environment variable changes.

---

## 6. Keep `.env.example`

A useful practice is to create:

```text
.env.example
```

with placeholders:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MONGO_URI=
SESSION_SECRET=
```

This file can safely be committed to GitHub.

It tells another developer:

```text
"What environment variables does this project require?"
```

without exposing the real values.

---

# 10. Complete Example

## Project Structure

```text
Journey/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── app.js
└── ...
```

---

## `.env`

```env
PORT=3000

MONGO_URI=mongodb://127.0.0.1:27017/journey

SESSION_SECRET=mySuperSecretValue

CLOUDINARY_CLOUD_NAME=mycloud

CLOUDINARY_API_KEY=123456789

CLOUDINARY_API_SECRET=myCloudinarySecret
```

---

## `.env.example`

```env
PORT=

MONGO_URI=

SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

## `.gitignore`

```gitignore
node_modules/
.env
```

---

## `app.js`

```js
require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const session = require("express-session");

const cloudinary = require("cloudinary").v2;


const app = express();


// ----------------------------------
// Environment Variables
// ----------------------------------

const PORT =
    Number(process.env.PORT) || 3000;

const MONGO_URI =
    process.env.MONGO_URI;

const SESSION_SECRET =
    process.env.SESSION_SECRET;


// ----------------------------------
// Cloudinary Configuration
// ----------------------------------

cloudinary.config({

    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
        process.env.CLOUDINARY_API_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET

});


// ----------------------------------
// Session
// ----------------------------------

app.use(
    session({

        secret: SESSION_SECRET,

        resave: false,

        saveUninitialized: false

    })
);


// ----------------------------------
// Test Route
// ----------------------------------

app.get("/", (req, res) => {

    res.send("Journey is running!");

});


// ----------------------------------
// MongoDB Connection
// ----------------------------------

async function main() {

    await mongoose.connect(
        MONGO_URI
    );

    console.log(
        "MongoDB connected"
    );

}


main()
    .catch(err => {

        console.error(
            "MongoDB connection error:",
            err
        );

    });


// ----------------------------------
// Start Server
// ----------------------------------

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
```

---

# 11. Quick Reference

### Install

```bash
npm install dotenv
```

### Load `.env`

```js
require("dotenv").config();
```

### Access a variable

```js
process.env.VARIABLE_NAME
```

### `.env`

```env
VARIABLE_NAME=value
```

### Example

```env
MONGO_URI=mongodb://127.0.0.1:27017/journey
```

```js
mongoose.connect(
    process.env.MONGO_URI
);
```

### Cloudinary

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

```js
cloudinary.config({
    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
        process.env.CLOUDINARY_API_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET
});
```

### Ignore

```gitignore
.env
```

### Share structure safely

```text
.env.example
```

---

# 🧠 Quick Recap

```text
.env
 ↓
stores configuration/secrets

dotenv
 ↓
loads .env

process.env
 ↓
access variables in Node.js
```

Example:

```env
CLOUDINARY_API_KEY=123456789
```

becomes:

```js
process.env.CLOUDINARY_API_KEY
```

### For your project

```text
Cloudinary credentials
        ↓
.env
        ↓
dotenv
        ↓
process.env
        ↓
cloudinary.config()
```

### Remember

```text
.env
→ private configuration

.env.example
→ safe template

.gitignore
→ prevents .env from being committed

process.env
→ accesses environment variables
```

> **Core Idea:** Use `.env` to keep environment-specific configuration and secrets outside your source code. `dotenv` loads those values into `process.env`, allowing the same application code to work with different databases, Cloudinary accounts, session secrets, and other configurations without hardcoding credentials.