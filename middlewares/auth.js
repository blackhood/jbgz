var user = require('../models/user_model.js');

module.exports = function(req, res, next) {
  if (req.session && req.session.user) {
    user.get(req.session.user, function(err, _user) {
      if (_user) {
        req.user = _user;
      } else {
        delete req.user;
        delete req.session.user;
      }

      next();
    })
  } else {
    next();
  }
}