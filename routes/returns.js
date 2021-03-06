const moment = require('moment');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const validate = require('../middlewares/validateReqBody');

router.post('/', [auth, validate(validateRental)], async (req, res) =>{
    
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('Not rental found for that customer/movie;');

    if(rental.dateReturned) return res.status(400).send('return allready processed');

    //set the dateReturnde and the rental fee
    rental.return();
    await rental.save();

    //Update movie's stock
    await Movie.update({_id: rental.movie._id}, { 
        $inc: {numberInStock: 1}
      });

    res.send(rental);
});

module.exports = router;
