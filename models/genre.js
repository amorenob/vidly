const Joi = require('joi');
const mongoose = require('mongoose');

//genres
const genreSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});
//
const validationSchema = {
    name: Joi.string().min(3).required()
};

function validateGenre(genre){
    return Joi.validate(genre, validationSchema);
};

const Genre = mongoose.model('genres', genreSchema);

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;