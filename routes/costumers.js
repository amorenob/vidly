const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const validate = require('../middlewares/validateReqBody')
const express = require('express');
const mongoose = require('mongoose');
const { Costumer, validateCostumer} = require('../models/costumer')
const router = express.Router();

//send costumers back
router.get('/', async (req, res) => {
    const costumers = await Costumer
        .find()
        .sort('name');
    res.send(costumers);
});

// send a specific costumer
router.get('/:id', validateObjectId, async (req, res) => {
    const costumer = await Costumer.findById(req.params.id);
    if (!costumer) return res.status(401).send('costumer with the given ID not found');
    res.send(costumer);
});

// adding a new costumer
router.post('/', [auth, validate(validateCostumer)], async (req, res) => {
    let costumer = new Costumer(_.pick(req.body, ['name', 'isGold', 'phone']));
    costumer = await costumer.save();
    res.send(costumer);
});

// updating a costumer
router.put('/:id', [auth, validateObjectId, validate(validateCostumer)], async (req , res) => {
    const result = await Costumer.findByIdAndUpdate({ _id: req.params.id }, {
        $set: _.pick(req.body, ['name', 'isGold', 'phone'])
        }, {new: true});
    res.send(result);
});

// delete a costumer
router.delete('/:id', [auth, validateObjectId],  async (req, res) => {
    const result = await Costumer.findByIdAndRemove(req.params.id);  
    res.send(result);
});

module.exports = router;