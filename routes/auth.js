const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const { User } = require('../models/user');
const validate = require('../middlewares/validateReqBody');

router = express.Router()


router.post('/', validate(validateLogin), async (req, res) =>{

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid user or password');

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(400).send('Invalid user or password');

    const token = user.generateAuthToken();
    res.send(token);
});

function validateLogin(login){
    schema = {
        password: Joi.string().min(5).max(1024).required(),
        email: Joi.string().min(5).max(255).required().email()
    };
    return Joi.validate(login, schema);
};

module.exports = router;
//