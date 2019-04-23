const Joi = require('joi');
const mongoose = require('mongoose');
//costumers
const costumersSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: { 
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true
    }
});
const Costumer = mongoose.model('costumers', costumersSchema);


const validationSchema = {
    isGold: Joi.boolean().required(),
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(3).required()
};

function validateCostumer(costumer){
    return Joi.validate(costumer, validationSchema);
};
exports.Costumer = Costumer;
exports.validateCostumer = validateCostumer;