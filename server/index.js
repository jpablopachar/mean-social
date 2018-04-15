'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const userRoutes = require('./routes/user');
/*const followRoutes = require('./routes/follow');
const publicationRoutes = require('./routes/publication');
const messageRoutes = require('./routes/message');*/

//mongoose.Promise = global.Promise;

// Connected to the mongodb database
mongoose.connect('mongodb://localhost:27017/mean_social').then(() => console.log('Connected database')).catch(err => console.log(err));

/*                  Settings                     */
// Use the default port or use port 3000
app.set('port', process.env.PORT || 3000);

/*                 Middleware                   */
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
// Converts the data arriving through HTTP requests to JSON type
app.use(bodyParser.json());

/*                   Routes                      */
app.use('/api', userRoutes);
/*app.use('/api', followRoutes);
app.use('/api', publicationRoutes);
app.use('/api', messageRoutes);*/

// app listens in the established port
app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
});