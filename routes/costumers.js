const auth = require('../middlewares/auth');
const _ = require('lodash');
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
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('The given ID is not valid');
    const costumer = await Costumer.findById(req.params.id);
    if (!costumer) return res.status(401).send('costumer with the given ID not found');
    res.send(costumer);
});

// adding a new costumer
router.post('/', auth, async (req, res) => {
    //validate
    const { error } = validateCostumer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    //save costumer
    let costumer = new Costumer(_.pick(req.body, ['name', 'isGold', 'phone']));
    costumer = await costumer.save();
    res.send(costumer);
});

// updating a costumer
router.put('/:id', auth, async (req , res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('The given ID is not valid');
    const { error } = validateCostumer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await Costumer.findByIdAndUpdate({ _id: req.params.id }, {
        $set: _.pick(req.body, ['name', 'isGold', 'phone'])
        }, {new: true});
    res.send(result);
});

// delete a costumer
router.delete('/:id', auth,  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('The given ID is not valid');
    const result = await Costumer.findByIdAndRemove(req.params.id);  
    res.send(result);
});

module.exports = router;