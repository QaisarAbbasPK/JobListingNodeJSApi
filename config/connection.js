const mongoose = require('mongoose');
const mongoURL = require('./key');

mongoose.connect(mongoURL.MongoURL, {useNewUrlParser : true,  useUnifiedTopology: true})
.then(res => console.log("Database Connected"))
.catch(error => console.log(error));