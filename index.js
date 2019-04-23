const { config } = require('./config');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./logger');
const genres = require('./routes/genres');
const costumers = require('./routes/costumers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use('/api/costumers', costumers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
};

const uri = `mongodb+srv://${config.DBUSER}:${config.DBPASSWORD}@${config.ATLASCLOUSTER}/${config.DBNAME}?retryWrites=true`
//mongoose.connect('mongodb://localhost/vidly')
mongoose.connect(uri)
    .then(() => console.log('conected to db'))
    .catch(err => console.error('No connected to DB..', err));

//send the 
app.get('/', (req, res) => {
    res.render('index', { title: 'My vid app', message:'hello'});
});


port = process.env.PORT || 5000;
app.listen(port, () =>  {console.log(`Listening on port ${port}...`) });

