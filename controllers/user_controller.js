var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var user = require('../models/user_model.js');

// this refer to /user/
router.post('/', auth, function(req, res, next){

});

// this refer to /user/some_url
router.get('/some_url', function(req, res, next){
    res.render('index', {title: 'user page'});
});

module.exports = router;