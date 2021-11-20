const express = require('express');
const router = express.Router();
const db = require('../config/db');
const User = require('../models/userModel');
const {ensureAuthenticated} = require("../config/auth.js")

//welcome cum login page
router.get('/', (req, res) => {
    res.render("welcome");
})

router.get('/allusers', (req,res)=>{
    User.find()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: `Internal Server Error! ${err}`
            })
        });
    //res.status(200).send(savedUsers);
})

//register page
router.get('/register', (req,res)=>{
    res.render('register');
})




module.exports = router;

