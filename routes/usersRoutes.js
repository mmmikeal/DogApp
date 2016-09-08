var express                 =   require("express"),
    router                  =   express.Router({mergeParams:true}),
    User                    =   require("../models/users.js"),
    passport                =   require("passport"),
    yelpData                =   require("../models/yelp.js"),
    Yelp                    =   require("yelp");


var yelp = new Yelp({
  consumer_key: 'LDo2SW89ugeWVJQXDLIqkg',
  consumer_secret: "kgpjgGAUj5c5_GUwvlWt-g21WzM",
  token: 'A-qbWCmj7u_pxx2dKZPox11rOdkp8kBf',
  token_secret: '95n7Fr_0Mdje8F_XbzKQ5qAhZ28',
});





router.post("/signup", function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err,users){
        if(err){
            console.log(users);
            console.log(err);
        }else{
            passport.authenticate("local")(req,res, function(){
               res.render("./search/search"); 
            });
        }
    });
});


router.get("/myprofile", function(req,res){
    res.render("myprofile");
}),


router.post('/login', passport.authenticate("local"),function(req,res){
    User.findById(req.user.id,function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            foundUser.favorites.forEach(function(favorites){
               yelpData.findOne({'business.id': favorites},function(err,foundFavorites){
                    if(err){
                        console.log(err);
                    }else if(!foundFavorites){
                        yelp.business(favorites).then(function(favorites){
                            yelpData.create({business:favorites},function(err,storedYelpData){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log(storedYelpData.business.id);
                                }
                            });
                        });
                    }
                });
            });
        res.redirect("/");
        }        
    });
});


router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/journey");
    console.log(req.user);
});

module.exports.router=router;