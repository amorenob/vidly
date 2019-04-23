const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');
const router = express.Router();


//adding a new user 
router.post('/', async (req, res)=>{
    // validate
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if the user is already registered
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    // create user un db
    user = new User(_.pick(req.body, ['name', 'password', 'email']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));

})

module.exports = router
