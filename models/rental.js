const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);
const moment = require('moment');

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

rentalSchema.statics.lookup = function (customerId, movieId) {
	return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

rentalSchema.methods.return = function(){
	this.dateReturned = new Date();

	const rentalDays = (moment().diff(this.dateOut, 'days'))
    this.rentalFee = this.movie.dayliRentalRate * rentalDays;
};

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