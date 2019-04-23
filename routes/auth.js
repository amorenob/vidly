const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const { User } = require('../models/user');

router = express.Router()


router.post('/', async (req, res) =>{
    //validate
    const { error } = validateLogin(req);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid user or password');

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(400).send('Invalid user or password');

    const token = jwt.sign({'_id': user._id }, config.get('jwtPrivateKey'));
    res.send(token);
});

function validateLogin(req){
    schema = {
        password: Joi.string().min(5).max(1024).required(),
        email: Joi.string().min(5).max(255).required().email()
    };
    return Joi.validate(req.body, schema);
};

module.exports = router;
//