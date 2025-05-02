const express = require("express");
const router = express.Router({mergeParams:true}) ;
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,validateReview,isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")


//post review
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.postReview));
   
//delete review 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router ;