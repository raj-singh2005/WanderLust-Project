const User = require("../models/user.js");

//signup form route
module.exports.signUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

//signup route 
module.exports.signUpUser = async (req,res)=>{
    try{
    let {username,email,password} = req.body ;
    const newUser = new User({username,email}) ;
    const registeredUser = await User.register(newUser,password) ;
    req.login(registeredUser,(err)=>{
       if(err){
        next(err);
       }
       req.flash("success","Welcome To WanderLust!");
    res.redirect("/listings");
    });
   
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

//login form route 
module.exports.loginForm =(req,res)=>{
    res.render("users/login.ejs");
};

//login user route 
module.exports.loginUser = async(req,res)=>{
    req.flash("success","Welcome Back To WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
   };

//logout route 
module.exports.logoutUser = (req,res)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","You are Logged Out!");
        res.redirect("/listings");
    })
};