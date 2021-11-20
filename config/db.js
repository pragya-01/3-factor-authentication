const mongoose = require('mongoose');

//Connect to MongoDB Database
const url = "mongodb://127.0.0.1:27017/digilocker";
mongoose.connect( url,{useNewUrlParser: true, useUnifiedTopology : true});
const db = mongoose.connection;
db.once('open', _ => {
    console.log('Database connected:', url)
})
db.on('error', err => {
    console.error('connection error:', err)
})
module.exports = db;