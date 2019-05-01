const Joi = require('joi');
const mongoose = require('mongoose');

//genres
const genreSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});
//
const validationSchema = {
    name: Joi.string().min(5).max(50).required()
};

function validateGenre(genre){
    return Joi.validate(genre, validationSchema);
};

const Genre = mongoose.model('genres', genreSchema);

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;