const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const passport = require('passport');
const axios = require('axios');
const { forwardAuthenticated, ensureAuthenticated, ensure2FA } = require('../config/auth');
const {parse} = require("nodemon/lib/cli");

//login handle
router.get('/login',  (req,res)=>{
    res.render('new-login');
})
router.get('/register' , (req,res)=>{
    res.render('new-register');
})

//Register handle
router.post('/register',(req,res)=> {
    const {name, email, password, password2} = req.body;
    let errors = [];
    //console.log(' Name ' + name + ' email :' + email + ' pass:' + password);
    if (!name || !email || !password || !password2) {
        errors.push({msg: "Please fill in all fields"})
    }
    //check if match
    if (password !== password2) {
        errors.push({msg: "passwords dont match"});
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
        errors.push({msg: 'password atleast 6 characters'})
    }
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        //validation passed
        User.findOne({email: email}).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({msg: 'email already registered'});
                render(res, errors, name, email, password, password2);

            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    second_factor_authenticated: false,
                    third_factor_authenticated: false
                });
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value) => {
                                    console.log(value)
                                    req.flash('success_msg', 'You are now registered!')
                                    res.redirect('/users/login');
                                })
                                .catch(value => console.log(value));

                        }));


            }
        })
    }
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/users/login-otp',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})


//logout
router.get('/logout', (req,res)=>{
    const filter = {email: req.user.email};
    const update = {second_factor_authenticated: false}
    const data = updateRecord(filter, update);
    if(!data) console.log("Not Updated, DB Error");
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
})


//----------------------------------------------------------------------------------------------------------
async function makePostRequest(email) {

    let payload = { email: email, type: "2FA" };
    let res = await axios.post('http://localhost:4500/api/email/otp', payload);

    let data = res.data;
    console.log(data);
    return data;

}
//----------------------------------------------------------------------------------------------------------
let ver_key;

router.get('/login-otp', ensureAuthenticated ,(req, res) => {
    console.log(req.user.email);
    let email = req.user.email;
    const data = makePostRequest(email);
    console.log(data);
    data.then( res => {
        ver_key = res.Details;
    })
    res.render('otp');
})

async function updateRecord(filter, update) {
    await User.findOneAndUpdate(filter, update);
}

router.post('/login-otp', ensureAuthenticated, (req, res) => {
    let _otp = req.body.otp;
    let _email = req.user.email;
    let payload = { otp: _otp, verification_key: ver_key,  check: _email  };
    axios.post('http://localhost:4500/api/verify/otp', payload)
        .then(function (response) {
            console.log(response);
            if(response.data.Status === "Success") {
                // Mark 2FA as true
                const filter = {email: req.user.email};
                const update = {second_factor_authenticated: true}
                const data = updateRecord(filter, update);
                if(!data) console.log("Not Updated, DB Error")
                console.log(req.user);
                res.redirect('/users/dashboard');
            }
        })
        .catch(err => {
            res.send("Wrong OTP");
            //res.send(err);
        })
})

//-------------------------------------------------------------------------------

router.get('/face-login',  ensureAuthenticated,  (req,res)=>{
    res.render('face-recognition');
})

//-------------------------------------------------------------------------------

router.get('/dashboard', ensureAuthenticated, (req,res)=>{
    res.render('dashboard',{
        user: req.user
    });
})

module.exports  = router;