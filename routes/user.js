const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/users.js");

//signup 
router.route("/signup")
.get(userController.signUpForm)
.post(wrapAsync( userController.signUpUser));

//login
router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.loginUser));


//logout 
router.get("/logout",userController.logoutUser);

module.exports = router ;