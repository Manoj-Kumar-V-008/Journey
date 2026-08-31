# Joi — Schema Validation in Express

## 1. What is Joi?

**Joi** is a JavaScript library used to validate data against a predefined **schema**.

In an Express application, users can send data through:

* Forms
* Request bodies
* Query parameters
* URL parameters
* APIs

We should **never blindly trust user input**.

For example, suppose Journey has a form for creating a new listing:

```js
{
    title: "Beautiful Villa",
    description: "A beautiful villa near the beach",
    price: 5000,
    location: "Goa",
    country: "India"
}
```

A user could instead submit:

```js
{
    title: "",
    price: "hello",
    location: 123,
    country: true
}
```

Without validation, our application may accept invalid data.

Joi allows us to define what valid data should look like.

---

# 2. Why Do We Need Validation?

Validation protects our application from **invalid or unexpected input**.

For example:

```js
title: Joi.string().required()
```

means:

> `title` must be a string and it must be provided.

And:

```js
price: Joi.number().required()
```

means:

> `price` must be a number and it must be provided.

So instead of manually writing lots of conditions like:

```js
if (!title) {
    ...
}

if (typeof price !== "number") {
    ...
}

if (!location) {
    ...
}
```

we can describe our requirements using a Joi schema.

---

# 3. Installing Joi

Install Joi using npm:

```bash
npm install joi
```

Joi is installed as a normal project dependency. The current package is `joi`; older tutorials may show `@hapi/joi`, but that is not what we should use for a new project.

Check `package.json` after installation:

```json
"dependencies": {
    "joi": "..."
}
```

---

# 4. Importing Joi

Since Journey currently uses CommonJS:

```js
const Joi = require("joi");
```

If a project uses ES Modules, the equivalent is:

```js
import Joi from "joi";
```

---

# 5. What is a Schema?

A **schema** is a set of rules that describes what valid data should look like.

Example:

```js
const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
});
```

This tells Joi:

| Field         | Requirement       |
| ------------- | ----------------- |
| `title`       | String + required |
| `description` | String + required |
| `price`       | Number + required |
| `location`    | String + required |
| `country`     | String + required |

Joi schemas are built by combining types and rules. Schema objects are immutable, so adding a rule creates a new schema rather than modifying the original one.

---

# 6. Basic Joi Types

## String

```js
Joi.string()
```

Example:

```js
const schema = Joi.string();
```

Valid:

```js
"Hello"
```

Invalid:

```js
123
```

---

## Number

```js
Joi.number()
```

Example:

```js
const schema = Joi.number();
```

Valid:

```js
5000
```

Invalid:

```js
"hello"
```

---

## Boolean

```js
Joi.boolean()
```

Example:

```js
Joi.boolean()
```

Valid:

```js
true
```

or:

```js
false
```

---

## Date

```js
Joi.date()
```

---

## Array

```js
Joi.array()
```

For example:

```js
Joi.array().items(Joi.string())
```

This means:

> The value must be an array containing strings.

Example:

```js
["Goa", "Bangalore", "Mumbai"]
```

---

## Object

```js
Joi.object()
```

Example:

```js
Joi.object({
    name: Joi.string(),
    age: Joi.number()
})
```

---

# 7. Required Fields

By default, Joi fields are **optional**.

For example:

```js
const schema = Joi.object({
    title: Joi.string()
});
```

An empty object can still pass because `title` was not marked as required.

To make it mandatory:

```js
const schema = Joi.object({
    title: Joi.string().required()
});
```

Now:

```js
{}
```

will fail validation.

But:

```js
{
    title: "Beautiful Villa"
}
```

will pass.

This is an important concept:

```js
Joi.string()
```

means:

> If the value exists, it must be a string.

Whereas:

```js
Joi.string().required()
```

means:

> The value must exist and it must be a string.

Joi documents that values are optional by default and `.required()` can be used when a value must be present.

---

# 8. Common Joi Rules

Joi uses **chainable methods**.

Example:

```js
Joi.string().min(3).max(30).required()
```

This means:

* Must be a string
* Minimum 3 characters
* Maximum 30 characters
* Must be provided

---

## `.min()`

For strings:

```js
Joi.string().min(3)
```

Minimum 3 characters.

For numbers:

```js
Joi.number().min(100)
```

Minimum value is 100.

---

## `.max()`

For strings:

```js
Joi.string().max(100)
```

Maximum 100 characters.

For numbers:

```js
Joi.number().max(10000)
```

Maximum value is 10,000.

---

## `.integer()`

Makes sure a number is an integer.

```js
Joi.number().integer()
```

Valid:

```js
10
```

Invalid:

```js
10.5
```

---

## `.positive()`

Requires a positive number:

```js
Joi.number().positive()
```

Useful for:

```js
price: Joi.number().positive()
```

---

## `.email()`

Validates an email address:

```js
Joi.string().email()
```

Example:

```js
email: Joi.string().email().required()
```

---

## `.valid()`

Restricts the value to specific options.

```js
Joi.string().valid("admin", "user")
```

Only `"admin"` or `"user"` is accepted.

---

# 9. Example Schema

A simple user schema:

```js
const userSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    age: Joi.number()
        .integer()
        .min(18)
        .required()
});
```

This gives us a clear definition of valid user data.

---

# 10. Validating Data

After creating the schema, we use:

```js
schema.validate(data)
```

Example:

```js
const userSchema = Joi.object({
    username: Joi.string().required(),
    age: Joi.number().required()
});

const userData = {
    username: "Manoj",
    age: 20
};

const result = userSchema.validate(userData);

console.log(result);
```

Joi returns an object containing the validation result.

A common pattern is:

```js
const { error, value } = userSchema.validate(userData);
```

If validation succeeds:

```js
error
```

will be `undefined`.

If validation fails:

```js
error
```

contains information about the validation failure.

---

# 11. Checking for Validation Errors

Example:

```js
const { error } = userSchema.validate(userData);

if (error) {
    console.log(error);
}
```

We can also throw the error:

```js
if (error) {
    throw new Error(error);
}
```

However, in an Express application, we usually want to pass the validation error to our error-handling middleware.

---

# 12. `abortEarly`

By default, Joi can stop after encountering a validation error.

For example, suppose:

```js
const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required()
});
```

And the user sends:

```js
{
    title: "",
    price: "hello",
    location: ""
}
```

There are multiple problems.

We can tell Joi to collect all validation errors:

```js
const result = schema.validate(data, {
    abortEarly: false
});
```

Now Joi reports all validation errors instead of stopping at the first one.

This is particularly useful when debugging forms.

---

# 13. Joi in the Journey Project

Our Journey application has a listing form.

For example:

```html
<form action="/listings" method="POST">

    <input
        type="text"
        name="title"
    >

    <textarea
        name="description"
    ></textarea>

    <input
        type="number"
        name="price"
    >

    <input
        type="text"
        name="location"
    >

    <input
        type="text"
        name="country"
    >

    <button type="submit">
        Add Listing
    </button>

</form>
```

The submitted data reaches Express through:

```js
req.body
```

So we should validate:

```js
req.body
```

before inserting it into MongoDB.

---

# 14. Creating the Listing Schema

Create a separate file:

```text
schema.js
```

Example:

```js
const Joi = require("joi");

const listingSchema = Joi.object({
    title: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    price: Joi.number()
        .required()
        .min(0),

    location: Joi.string()
        .required(),

    country: Joi.string()
        .required()
});

module.exports = listingSchema;
```

Now the validation rules are separated from our routes.

This is cleaner than writing the entire schema inside `app.js`.

---

# 15. Using the Schema in `app.js`

Import the schema:

```js
const listingSchema = require("./schema");
```

Then before creating a listing:

```js
app.post("/listings", async (req, res) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    const newListing = new Listing(req.body);

    await newListing.save();

    res.redirect("/listings");
});
```

The important part is:

```js
const { error } = listingSchema.validate(req.body);
```

We are saying:

> Take the data submitted by the user and check whether it follows our listing schema.

---

# 16. Why Validate Before MongoDB?

The flow should be:

```text
User submits form
        ↓
Express receives req.body
        ↓
Joi validates req.body
        ↓
Is it valid?
   ↙           ↘
 NO             YES
 ↓               ↓
Error         Create Model
                  ↓
             Save to MongoDB
```

We don't want this:

```text
User submits invalid data
        ↓
Save directly to MongoDB
        ↓
Database contains bad data
```

Joi gives us a validation layer **before the data reaches our database**.

---

# 17. Joi vs Mongoose Validation

This is an important distinction.

We may eventually have validation in both:

### Joi

Validates incoming request data.

```text
Client → Express → Joi
```

### Mongoose

Validates data according to our database model.

```text
Express → Mongoose → MongoDB
```

So they solve related but different problems.

A useful mental model is:

```text
                USER INPUT
                    ↓
                Express
                    ↓
                  Joi
          "Is this request valid?"
                    ↓
                Mongoose
          "Does this fit my model?"
                    ↓
                MongoDB
```

Joi should **not** be considered a replacement for all database-level validation.

---

# 18. Example: Better Listing Schema

As Journey grows, we can make the schema more specific.

```js
const listingSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required(),

    description: Joi.string()
        .min(10)
        .max(1000)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    location: Joi.string()
        .min(2)
        .required(),

    country: Joi.string()
        .min(2)
        .required(),

    image: Joi.string()
        .allow("")
});
```

Now we have much better validation.

For example:

```js
title: "Hi"
```

would pass the minimum length requirement if the minimum is 3.

But:

```js
title: "H"
```

would fail.

---

# 19. Optional Fields

Not every field needs to be required.

Example:

```js
image: Joi.string().allow("")
```

This allows an empty string.

Without `.required()`:

```js
image: Joi.string()
```

the field itself can also be omitted.

Example:

```js
{
    title: "Beach House",
    description: "Beautiful house near the beach",
    price: 5000,
    location: "Goa",
    country: "India"
}
```

can still be valid even if `image` isn't present.

---

# 20. Custom Error Messages

Joi provides validation errors automatically.

For example:

```js
Joi.string().required()
```

could produce an error indicating that the value is required.

We can customize messages using `.messages()`.

Example:

```js
title: Joi.string()
    .required()
    .messages({
        "string.empty": "Title cannot be empty.",
        "any.required": "Title is required."
    })
```

Now the error message is more friendly for our application.

---

# 21. Understanding `error.details`

A Joi validation error contains useful information.

Example:

```js
const { error } = listingSchema.validate(req.body);

console.log(error.details);
```

`error.details` contains information about each validation failure.

A common property is:

```js
error.details[0].message
```

For example:

```js
throw new ExpressError(
    400,
    error.details[0].message
);
```

This lets our existing Express error middleware handle the error.

---

# 22. Better Validation Middleware

Instead of repeating this:

```js
const { error } = listingSchema.validate(req.body);

if (error) {
    throw new ExpressError(400, error.details[0].message);
}
```

in every route, we can create middleware.

Example:

```js
const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    next();
};
```

Then use it:

```js
app.post(
    "/listings",
    validateListing,
    async (req, res) => {

        const newListing = new Listing(req.body);

        await newListing.save();

        res.redirect("/listings");
    }
);
```

Now the route becomes much cleaner.

---

# 23. Middleware Flow

Our Journey application now has:

```text
POST /listings
       ↓
validateListing
       ↓
Joi Schema
       ↓
Valid?
   ↙       ↘
 NO         YES
 ↓           ↓
400 Error   Controller
             ↓
          Mongoose
             ↓
          MongoDB
```

This is a much better architecture.

---

# 24. A Practical `schema.js`

A simple version for Journey:

```js
const Joi = require("joi");

const listingSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required(),

    description: Joi.string()
        .min(10)
        .max(1000)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    location: Joi.string()
        .min(2)
        .required(),

    country: Joi.string()
        .min(2)
        .required(),

    image: Joi.string()
        .allow("")
});

module.exports = listingSchema;
```

---

# 25. Practical `validateListing` Middleware

```js
const listingSchema = require("./schema");
const ExpressError = require("./utils/ExpressError");

const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(
            400,
            error.details[0].message
        );
    }

    next();
};

module.exports = validateListing;
```

---

# 26. Using It in Routes

```js
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body);

        await newListing.save();

        res.redirect("/listings");
    })
);
```

Now our route does not need to worry about validation.

The middleware handles it.

---

# 27. Important Security Concept

Never assume that because your HTML form has validation, your server is safe.

For example, HTML:

```html
<input
    type="number"
    name="price"
    required
>
```

provides **client-side validation**.

But a user can bypass your HTML completely and send a request directly to your server.

Therefore:

```text
HTML validation
      +
Server-side validation
```

is much safer than relying only on HTML.

Joi provides server-side validation.

---

# 28. Client-Side vs Server-Side Validation

### Client-side

Example:

```html
<input required>
```

Advantages:

* Immediate feedback
* Better user experience
* Prevents simple mistakes

But it can be bypassed.

### Server-side

Example:

```js
listingSchema.validate(req.body)
```

Advantages:

* Cannot be trusted away by the browser
* Protects the server from unexpected input
* Centralizes validation rules

For a real application, **server-side validation is essential**.

---

# 29. Common Joi Methods to Remember

| Method          | Purpose                             |
| --------------- | ----------------------------------- |
| `Joi.string()`  | Must be a string                    |
| `Joi.number()`  | Must be a number                    |
| `Joi.boolean()` | Must be true/false                  |
| `Joi.date()`    | Must be a date                      |
| `Joi.array()`   | Must be an array                    |
| `Joi.object()`  | Must be an object                   |
| `.required()`   | Value must exist                    |
| `.optional()`   | Value may be omitted                |
| `.min()`        | Minimum value/length                |
| `.max()`        | Maximum value/length                |
| `.integer()`    | Must be an integer                  |
| `.positive()`   | Must be positive                    |
| `.email()`      | Valid email format                  |
| `.valid()`      | Only specific values allowed        |
| `.allow()`      | Allows specific values such as `""` |
| `.messages()`   | Customize error messages            |

---

# 30. The Main Pattern to Remember

Most Joi validation follows this pattern:

```js
const schema = Joi.object({
    field: Joi.type()
        .rules()
        .required()
});
```

For example:

```js
const schema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),

    age: Joi.number()
        .integer()
        .min(18)
        .required()
});
```

Then:

```js
const { error } = schema.validate(data);
```

And:

```js
if (error) {
    // Handle validation error
}
```

---

# 31. Journey Project Architecture

A clean structure could eventually look like:

```text
Journey/
│
├── models/
│   └── listing.js
│
├── routes/
│   └── listing.js
│
├── middleware/
│   ├── validation.js
│   └── error.js
│
├── utils/
│   └── ExpressError.js
│
├── views/
│   ├── listings/
│   └── error.ejs
│
├── schema.js
│
├── app.js
│
├── package.json
└── Joi_Validation.md
```

The exact structure can change as the project grows.

---

# 32. The Big Picture

Joi is not just another npm package to memorize.

The important concept is:

> **Define what valid data looks like before allowing the data deeper into your application.**

For Journey:

```text
                USER
                 ↓
             HTML FORM
                 ↓
              Express
                 ↓
            req.body
                 ↓
              Joi
                 ↓
        ┌────────┴────────┐
        ↓                 ↓
     INVALID             VALID
        ↓                 ↓
   Error Handler       Route Logic
                          ↓
                       Mongoose
                          ↓
                       MongoDB
```

This separation makes the application easier to understand, maintain, and protect.

---

# 33. Quick Revision

### Install

```bash
npm install joi
```

### Import

```js
const Joi = require("joi");
```

### Create schema

```js
const listingSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required()
});
```

### Validate

```js
const { error } = listingSchema.validate(req.body);
```

### Handle error

```js
if (error) {
    throw new ExpressError(
        400,
        error.details[0].message
    );
}
```

### Middleware

```js
const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(
            400,
            error.details[0].message
        );
    }

    next();
};
```

### Route

```js
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body);

        await newListing.save();

        res.redirect("/listings");
    })
);
```

---

# 34. What I Should Remember

When working with Express applications:

```text
req.body
   ↓
Validate with Joi
   ↓
If invalid → Error
   ↓
If valid → Continue
   ↓
Mongoose
   ↓
MongoDB
```

**Joi = schema-based server-side validation.**

The most important things to understand are:

1. What a schema is
2. How to define types
3. How `.required()` works
4. How validation works
5. How to read `error`
6. How to create validation middleware
7. Why server-side validation is necessary
8. How Joi and Mongoose have different responsibilities
9. How validation fits into the Express request lifecycle

---

## Official References

* [Joi Documentation](https://joi.dev/)
* [Joi API Documentation](https://joi.dev/api/18.x.x)
* [Joi npm Package](https://www.npmjs.com/package/joi)

Joi's official documentation describes it as a language for describing data and validating it against schemas, with a large collection of built-in validators and chainable rules.
