const auth = require('../middlewares/auth');
const express = require('express');
const mongoose = require('mongoose');
const {Genre, validateGenre} = require('../models/genre')
const router = express.Router();

//send genres back
router.get('/', async (req, res) => {
    const genres = await Genre
        .find()
        .sort('name');
    res.send(genres);
});

// send a specific genre
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('The given ID is not valid');
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(401).send('Genre with the given ID not found');
    res.send(genre);
});

// adding a new genre
router.post('/', auth, async (req, res) => {
    //validate
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    //save genre
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
});

// updating a genre
router.put('/:id', auth, async (req , res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('The given ID is not valid');
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await Genre.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {name: req.body.name} 
        }, {new: true});
    res.send(result);
});

// delete a genre
router.delete('/:id', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('The given ID is not valid');
    const result = await Genre.findByIdAndRemove(req.params.id);  
    res.send(result);
});

module.exports = router;