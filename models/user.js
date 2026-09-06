const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// https://www.npmjs.com/package/passport-local-mongoose
// Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value by default
//So we just define email
const userSchema = schema({
    email:{
        type:String,
        required:true
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);