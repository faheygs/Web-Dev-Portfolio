var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'faheybaby', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


//
//GET ROUTES
//

//INDEX route - get campground from db
router.get("/", function(req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(middleware.escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            Campground.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allCampgrounds.length < 1) {
                        noMatch = "No campgrounds match that query, please try again.";
                    }
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all campgrounds from DB
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            Campground.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});

//NEW route - show form to create campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

//SHOW route - showing one selected item from db
router.get("/:id", function(req, res) {
    //find campground with given :id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", err.message);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
})

//
// POST ROUTES
//

//CREATE route - add campground to db
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var cost = req.body.cost;
    var desc = req.body.description;
    
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        
        // add cloudinary url for the image to the campground object under image property
        var uploadImage = result.secure_url;
        var uploadImageID = result.public_id;
        // add author to campground
        var campAuthor = {
            id: req.user._id,
            username: req.user.username
        }
  
        geocoder.geocode(req.body.location, function(err, data) {
            if(err || !data.length) {
                req.flash("error", "Invalid address");
                return res.redirect("back");
            }
            var lat = data[0].latitude;
            var lng = data[0].longitude;
            var location = data[0].formattedAddress;
    
            var newCampground = {
                name: name,
                cost: cost,
                image: uploadImage,
                imageId: uploadImageID,
                description: desc,
                author: campAuthor,
                location: location,
                lat: lat,
                lng: lng
            };
            //create new campground and save to db
            Campground.create(newCampground, function(err, newlyCreated) {
                if(err) {
                    req.flash("error", err.message);
                    return res.redirect('back');
                } else {
                    req.flash("success", "Your campground has been added.");
                    //redirect back to campgrounds page
                    res.redirect('/campgrounds/' + newlyCreated.id);
                }
            });
        });
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            req.flash("error", err.message);
        } else {
            res.render("campgrounds/edit", {campground : foundCampground});
        }
    });
});
    
//UDPATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'), function(req, res) {
    Campground.findById(req.params.id, async function(err, campground) {
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if(req.file) {
                try {
                    cloudinary.v2.uploader.destroy(campground.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    campground.imageId = result.public_id;
                    campground.image = result.secure_url;
                } catch(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            
            geocoder.geocode(req.body.location, function(err, data) {
                if(err || !data.length) {
                    req.flash("error", "Invalid address");
                    return res.redirect("back");
                }
                campground.lat = data[0].latitude;
                campground.lng = data[0].longitude;
                campground.location = data[0].formattedAddress;
                campground.cost = req.body.cost;
                campground.description = req.body.description;
                campground.name = req.body.name;
                campground.save();
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            });
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, async function(err, campground) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            campground.remove();
            req.flash('success', 'Campground deleted successfully!');
            res.redirect('/campgrounds');
        } catch(err) {
            if(err) {
              req.flash("error", err.message);
              return res.redirect("back");
            }
        }
  });
});

module.exports = router;