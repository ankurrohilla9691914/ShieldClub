const mongoose = require('mongoose');
const env = require('./environemnt');
mongoose.connect(`mongodb://localhost/${env.db}`, {UseNewUrlParser: true});

var db = mongoose.connection;

db.on('error',console.error.bind("error in connecting to db"));

db.once('open',function(){
    console.log("database connection successful");
})

module.exports = db;