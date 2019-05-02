const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);

const rentalSchema = new mongoose.Schema({
	customer: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,
				minlength: 3,
				maxlength: 50
			},
			phone: {
				type: String,
				require: true
			},
			isGold: {
				type: Boolean,
				default: false
			}
		}),
		required: true
	},
	movie: {
		type: new mongoose.Schema({
			title: {
				type: String,
				trim: true,
				required: true,
				minlength: 5,
				maxlength: 50
			},
			dayliRentalRate: {
				type: Number,
				required: true,
				min: 0,
				max: 255
			}
		}),
		require: true
	},
	dateOut: {
		type: Date,
		required: true,
		default: Date.now
	},
	dateReturned: {
		type: Date
	},
	rentalFee: {
		type:Number,
		min:0
	}
});

const validationSchema = {
	customerId: Joi.objectId().required(),
	movieId:Joi.objectId().required()
}

function validateRental(rental){
	return Joi.validate(rental, validationSchema);
} 

const Rental = mongoose.model('rentals', rentalSchema);

exports.validateRental = validateRental;
exports.Rental = Rental;