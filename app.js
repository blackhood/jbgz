var express = require("express");
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://52.33.233.61:27017/testdb');

var session = require('express-session');
var bodyParser = require('body-parser');


var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
  secret: 'ruki_simon',
  resave: false,
  saveUninitialized: true,
  httpOnly: true,
  secure: true
}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(require('./middlewares/auth.js'));
// this will use all the controllers
app.use(require('./controllers/index_controller.js'));



var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening on " + port);
});

// this set the http request timeout to 20min.
// default was 2min.
// server.timeout = 1200000;

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title:'error',
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    // console.log(err.message);
    console.log('should not see this');
  res.status(err.status || 500);
  res.render('error', {
    title:'error',
    message: err.message,
    error: {}
  });
});