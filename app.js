var express = require("express");
var path = require('path');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('./middlewares/auth.js'));
// this will use all the controllers
app.use(require('./controllers'));



var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening on " + port);
});

// this set the http request timeout to 20min.
// default was 2min.
server.timeout = 1200000;

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     // console.log(err.message);
//     console.log('should not see this');
//   res.status(err.status || 500);
//   res.render('error', {
//     title:'jbgz',
//     message: err.message,
//     error: {}
//   });
// });