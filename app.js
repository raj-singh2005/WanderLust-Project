if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
};
// console.log(process.env) ;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path") ;
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session") ;
const MongoStore = require("connect-mongo");
const flash = require("connect-flash") ;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//connection to DB


const dbUrl = process.env.ATLASDB_URL ;
main().then(()=>{
    console.log("connected to DB");
}).catch(err =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};




//session 
const secretCode=process.env.SECRET ;

const store = MongoStore.create({
    mongoUrl : dbUrl ,
    crypto : {
        secret : secretCode ,
    },
    touchAfter : 24 * 3600 , 
    });

    store.on("error",()=>{
        console.log("error in mongoStore session ",err) ;
    })

const sessionOptions = {
    store ,
    secret : secretCode ,
    resave : false ,
    saveUninitialized : true ,
    cookie:{
       expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
       maxAge : 7 * 24 * 60 * 60 * 1000 ,
       httpOnly : true,
    }
};


app.use(session(sessionOptions));
app.use(flash());

//authentication 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user ;
next();
});
//session ^

//listings 
app.use("/listings",listingRouter) ;

//reviews 
app.use("/listings/:id/reviews",reviewRouter);

//users
app.use("/",userRouter);



// Error handling middleware for unmatched routes
app.use("/", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//error handling middlewares
app.use((err,req,res,next)=>{
    let { statusCode=500 , message="Something Went Worng !"} = err ;
    res.status(statusCode).render("error.ejs",{err});
})

//creating server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});



