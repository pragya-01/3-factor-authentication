const User = require("../models/userModel");
module.exports = {
    ensureAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/users/login');
    },
    ensure2FA : function(req,res,next) {
        // check db for 2fa
        User.findOne({email: req.user.email}).exec((err, user) => {
            console.log("user found");
            if(req.isAuthenticated()) {  // Add 2FA check
                return next();
            }
        });
        // if(req.isAuthenticated() && (second_fa === true)) {  // Add 2FA check
        //     return next();
        // }
        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/users/login-otp');
    }
}