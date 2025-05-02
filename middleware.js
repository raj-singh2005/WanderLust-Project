const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema } = require("./schema.js");


//authentication
module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error","You Must Be Logged-In To Perform Actions!");
       return  res.redirect("/login");
    }
    next() ;
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//authorization 

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params ;
    let listing = await Listing.findById(id);
    if(res.locals.currUser&&!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error","You're Unauthorized To Perform This Action !")
      return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params ;
    let review = await Review.findById(reviewId);
    if(res.locals.currUser&&!review.author.equals(res.locals.currUser._id)) {
      req.flash("error","You're Unauthorized To Perform This Action !")
      return res.redirect(`/listings/${id}`);
    }
    next();
};


//schema validate function
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
       throw new ExpressError(400,error);
    }else{
        next();
    }
};