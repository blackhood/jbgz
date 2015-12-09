// this file’s purpose is to load all other controllers 
// and maybe define some paths 
// which don’t have a common prefix 
// like a home page route for example.

var express = require('express');
var router = express.Router();
var user = require('../models/user_model.js');

// this is for all other .ejs page start with /user in url
router.use('/user', require('./user_controller.js'));

// this is for index.ejs router 
router.get('/', function(req, res) {
    console.log('this is the main page');
    res.render('index', {title: 'jbgz'});
})

module.exports = router;