const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    password:{
        type:String,
        required: true,
        maxlength: 1024,
        minlength: 5
    },
    email:{
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true
    }
});

const User =  mongoose.model('users', userSchema);

const validationSchema = {
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(5).max(1024).required(),
    email: Joi.string().min(5).max(255).required().email()
}

function validateUser(user){
    return Joi.validate(user, validationSchema);
}

exports.User = User;
exports.validateUser = validateUser;
