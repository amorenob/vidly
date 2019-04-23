const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre')

//costumers
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        require: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('movies', movieSchema);


const validationSchema = {
    title: Joi.string().min(3).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required()
    
};

function validateMovie(movie){
    return Joi.validate(movie, validationSchema);
};
exports.Movie = Movie;
exports.validateMovie = validateMovie;