const express = require('express');

const app = express();
const mongoose = require('mongoose');
const router = express.Router();

const bodyParser= require('body-parser');
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require("./config/passport")(passport)

//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const db = require('./config/db');

//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
})

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT = 8080;
//Start Express Server
app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})