const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const validate = require('../middlewares/validateReqBody');
const express = require('express');
const mongoose = require('mongoose');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const router = express.Router();

//send all movies back
router.get('/', async (req, res) => {
    const movies = await Movie
        .find()
        .sort('name');
    res.send(movies);
});

// send a specific movie
router.get('/:id', validateObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(401).send('Movie with the given ID not found');
    res.send(movie);
});

// adding a new movie
router.post('/', [auth, validate(validateMovie)], async (req, res) => {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');
    
    //save movie
    let movie = new Movie({ 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate 
    });
    movie = await movie.save();
    res.send(movie);
});

// updating a movie
router.put('/:id', [auth, validateObjectId, validate(validateMovie)], async (req , res) => {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    const result = await Movie.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            title: req.body.name,
            numberInStock: req.body.numberInStock,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            dailyRentalRate: req.body.dailyRentalRate             
        }}, {new: true});
    res.send(result);
});

// delete a movie
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const result = await Movie.findByIdAndRemove(req.params.id);  
    res.send(result);
});

module.exports = router;