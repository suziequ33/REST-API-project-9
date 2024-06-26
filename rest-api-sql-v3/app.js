'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

//Import userRoutes and courseRoutes
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

//Import the user authentication middleware
const { authenticateUser } = require('./middleware/auth-user');

//import the sequelize instance from models/index.js
const { sequelize } = require('./models/index');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(express.json());
// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

//Apply the user authentication middleware before the user routes
app.use('/api/users', authenticateUser, userRoutes);

//Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

//test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
