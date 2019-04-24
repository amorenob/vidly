const auth = require('../middlewares/auth');
const mongoose = require('mongoose');
const { Rental, validateRental} = require('../models/rental');
const {Costumer} = require('../models/costumer');
const {Movie} = require('../models/movie');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental
        .find()
        .sort('-dateOut');
    res.send(rentals);
});

router.post('/', auth, async (req, res) => {
    const {error} = validateRental(req.body);
    if (error) return res.status('400').send(error.details[0].message);

    const costumer = await Costumer.findById(req.body.costumerId);
    if (!costumer) return res.status('400').send('The costumer with the given Id was not found');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status('400').send('The movie with the given Id was not found');

    if (movie.numberInStock === 0) return res.status('400').send('Movie not in stock');

    let rental = new Rental({
        costumer: {
            _id: Costumer._id,
            name: costumer.name,
            isGold: costumer.isGold,
            phone: Costumer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dayliRentalRate: movie.dayliRentalRate
        }
    });
    try {
        Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: { numberInStock: -1}
            })
            .run();

    }
    catch(ex){
        res.status(400).send('something failed');
    }
    res.send(rental);
});

module.exports = router;