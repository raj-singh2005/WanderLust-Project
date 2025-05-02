const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//post review route 
module.exports.postReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id ;
   
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review saved");
    req.flash("success","Review Posted !");
    res.redirect(`/listings/${listing._id}`);
   };

//delete review 
module.exports.deleteReview =async(req,res)=>{
    let {id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !");
    res.redirect(`/listings/${id}`);
  };