var express = require('express');
var app = express();

app.use('/assets', express.static('./assets'));
app.set('view engine','ejs');

const session = require('express-session');
app.use(session({secret: 'session'}));

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to mongoose
mongoose.connect('mongodb://localhost/techevents', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//create mongoose db connection
var database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function() {
  console.log("DB connected");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: "session",
  resave: false,
  saveUninitialized: true
}));

const userController = require('./routes/userController.js');
const connectionController = require('./routes/connectionController.js');
const controller = require('./routes/controller.js');

app.use('/userprofile',userController);
app.use('/connections',connectionController);
app.use('/',controller);

app.listen(8084,function(){
    console.log('server listening to port 8084');
});