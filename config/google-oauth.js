const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
require("dotenv").config();
const {userModel} = require("../models/user.model")
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
// const { v4:uuidv4} = require('uuid')
passport.use(new GoogleStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    const {name, email, picture} = profile._json;
    const userData = await userModel.findOne({email});
    if(userData._id){
        return cb(null, userData);
    }else{
        const newUser = new userModel({
            name,
            email,
            picture
        });
        await newUser.save()
        return cb(null, newUser)
    }
  }
));
module.exports ={passport}