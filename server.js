const config = require('./config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// create express app
const app = express();

// Handle CORS
app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
const dbConnectionString = "mongodb://" + config.db.host + ":" + config.db.port + "/" + config.db.name;
mongoose.connect(dbConnectionString, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// define a simple route
//app.get('/', (req, res) => {
//    res.json({"message": "Root route works!!!."});
//});

require('./api/routes/roleRoutes.js')(app);
require('./api/routes/userRoutes.js')(app);

// listen for requests
app.listen(config.app.port, () => {
    console.log("Server is listening on port " + config.app.port);
});
