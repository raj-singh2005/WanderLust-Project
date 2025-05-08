const Listing = require("../models/listing");
const { geocodeLocation } = require("../public/js/map");



//index route show all listing
module.exports.index =  async (req,res)=>{
const allListing = await  Listing.find({}) ;
res.render("listings/index.ejs",{allListing});
};

//new form route
module.exports.renderNewForm = (req,res)=>{
  
    res.render("listings/new.ejs");
};

//create listing route
module.exports.createListing = async (req,res)=>{
    let url = req.file.path ;
    let filename = req.file.filename ;
    const newListing =  new Listing(req.body.listing) ;
    newListing.owner = req.user._id ;
    newListing.image = {url,filename} ;

    const location = req.body.listing.location.trim();
    const country = req.body.listing.country.trim();
    const coordinates = await geocodeLocation(location, country);

    if (coordinates) {
        newListing.latitude = coordinates.latitude;
        newListing.longitude = coordinates.longitude;
    } else {
        req.flash('error', `Could not geocode the location: ${location}. Please check the address.`);
       
    }

    await newListing.save();
    req.flash("success","New Listing Added !");
    res.redirect("/listings");
    };

//show listing details route
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews", populate:{path:"author"}}).populate("owner");
   if(!listing){
       req.flash("error","Listing You Requested For Does Not Exists !");
       return res.redirect("/listings");
   }
    res.render("listings/show.ejs",{listing})
   };

//edit form route 
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params ;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing You Requested For Does Not Exists !");
       return res.redirect("/listings");
   }
   let originalImageUrl = listing.image.url ;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_300");
    
    res.render("listings/edit.ejs",{listing,originalImageUrl})
   };

//update listing route 
module.exports.updateListing = async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);

    const location = req.body.listing.location.trim();
    const country = req.body.listing.country.trim();
    const coordinates = await geocodeLocation(location, country);

    if (coordinates) {
        req.body.listing.latitude = coordinates.latitude;
        req.body.listing.longitude = coordinates.longitude;
    } else {
        req.flash('error', `Could not geocode the updated location: ${location}. Please check the address.`);
    }

    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
};
   


//delete listing route 
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let DeletedListing = await Listing.findByIdAndDelete(id);
    console.log(DeletedListing);
    req.flash("success","Listing Deleted !");
    res.redirect("/listings");
 };