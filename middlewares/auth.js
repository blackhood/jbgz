var user = require('../models/user_model.js');

module.exports = function(req, res, next) {
  // console.log('ha');
  console.log('path = ' + req.originalUrl);
  if (req.session && req.session.username) {
    // user.get(req.session.user, function(err, _user) {
    //   if (_user) {
    //     req.user = _user;
    //   } else {
    //     delete req.user;
    //     delete req.session.user;
    //   }

    //   next();
    // })
    console.log('session username is ' + req.session.username);
    res.locals.username = req.session.username;
    next();
  } else {
    console.log('no session');

    next();
  }
}