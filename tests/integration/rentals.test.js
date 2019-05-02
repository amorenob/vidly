const moment = require('moment');
const request = require('supertest');
const { User } = require('../../models/user');
const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');

// return test
//POST /api/returns/ {customerId, moiveId}
//calculate the rental 
//Increase the stock
// Return the rental 
let server;
describe('api/returns', () => {
    beforeEach( () => {
        server = require('../../index');

    });
    afterEach(async () => {
        await server.close();
        await Rental.remove({}); 
        await Movie.remove({}); 
    });

    describe('POST /', () => {
        
        let token;
        let customerId;
        let movieId;
        let rental;
        let movie;
        const exec = async () => {
            return await request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})
                
        };
        beforeEach(async () => {

            token = new  User().generateAuthToken();
            customerId = mongoose.Types.ObjectId();
            movieId = mongoose.Types.ObjectId();

            rental = new Rental({
                customer: {
                    _id: customerId,
                    name: '12345',
                    phone: '12345'
                },
                movie: {
                    _id: movieId,
                    title: '12345',
                    dayliRentalRate: 2
                },
                dateOut: moment().add(-7,'days').toDate()
            });
            await rental.save();

            movie = new Movie({
                _id: movieId,
                title: '12345',
                genre: {name:'12345'},
                numberInStock: 10,
                dailyRentalRate:2
            })
            await movie.save();
        });

        it('should return 401 if client is not logged in', async () => {
           token = ''

           const res = await exec();

           expect(res.status).toBe(401);
        });
        
        it('should return 400 if customerId is not provided', async () => {
           customerId = '';

           const res = await exec();

           expect(res.status).toBe(400);
        });
        
        it('should return 400 if movieId is not provided', async () => {
           movieId = '';

           const res = await exec();

           expect(res.status).toBe(400);
        });
        
        it('return 404 if no rental found for this customer/movie', async () => {
           await Rental.remove({});

           const res = await exec();

           expect(res.status).toBe(404);
        });
        
        it('return 400 if return allready processed', async () => {
            rental.dateReturned= new Date;
            await rental.save();

            const res = await exec();

            expect(res.status).toBe(400);
        });
        
        it('should return 200 if we have a valid request', async () => {

            const res = await exec();

            expect(res.status).toBe(200);
        });
        
        it('should set the rertun date if input is valid', async () => {

            await exec();
            
            const rentalinDb = await Rental.findById(rental._id);
            const diff = new Date() - rentalinDb.dateReturned;
            expect(rentalinDb.dateReturned).toBeDefined();
            expect(diff).toBeLessThan((10 * 1000));
        });
        
        it('should set the rental fee (numOfDays * movie.dailyRentalFee) if input is valid', async () => {

            const res = await exec();
            
            const rentalinDb = await Rental.findById(rental._id);
            const rentalDays = moment().diff(rental.dateOut, 'days')
            const rentalFee = rental.movie.dayliRentalRate * rentalDays;
            expect(rentalinDb.rentalFee).toBeDefined();
            expect(rentalinDb.rentalFee).toBe(rentalFee);
        });
        
        it('should Increase the stock if input is valid', async () => {

            const res = await exec();
            
            const movieInDb = await Movie.findById(rental.movie._id);
            
            expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
        });

        it('should return the rental if input is valid' , async () => {

            const res = await exec();

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['dateOut','dateReturned','rentalFee', 'customer', 'movie']));
 
        });
    });
});