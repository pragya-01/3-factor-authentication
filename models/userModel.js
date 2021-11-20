const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
    name :{
        type  : String,
        required : true
    } ,
    email :{
        type  : String,
        required : true
    } ,
    password :{
        type  : String,
        required : true
    } ,
    date :{
        type : Date,
        default : Date.now
    } ,
    verification_key :{
        type : String,
        required : false
    } ,
    second_factor_authenticated : {
        type : Boolean,
        required : true,
        default : false
    } ,
    third_factor_authenticated : {
        type : Boolean,
        required : true,
        default : false
    }
});

module.exports = User = mongoose.model('User',UserSchema);

;