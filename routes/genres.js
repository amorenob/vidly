const validateObjectId = require('../middlewares/validateObjectId');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const express = require('express');
const mongoose = require('mongoose');
const {Genre, validateGenre} = require('../models/genre');
const router = express.Router();
const validate = require('../middlewares/validateReqBody');

//send genres back
router.get('/', async (req, res) => {
    const genres = await Genre
        .find()
        .sort('name');
    res.send(genres);
});

// send a specific genre
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('Genre with the given ID not found');
    res.send(genre);
});

// adding a new genre
router.post('/', [auth, validate(validateGenre)], async (req, res) => {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
});

// updating a genre
router.put('/:id', [auth, validateObjectId, validate(validateGenre)], async (req , res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true
    });
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    
    res.send(genre);
});

// delete a genre
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});

module.exports = router;