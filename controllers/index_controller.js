// this file’s purpose is to load all other controllers 
// and maybe define some paths 
// which don’t have a common prefix 
// like a home page route for example.

var express = require('express');
var router = express.Router();
var user = require('../models/user_model.js');
var VIDEO = require('../models/video_model.js');

// this is for all other .ejs page start with /user in url
router.use('/user', require('./user_controller.js'));
router.use('/video', require('./video_controller.js'));

// this is for index.ejs router 
router.get('/', function(req, res) {
    console.log('come on1');
    // var keyword = req.query.keyword;
    var video = new VIDEO();
    video.get_hot_videos(0,15, function(err, hot_videos){
        // console.log(error);
        console.log('this is the main page');
        
        if (err) {
            console.log(err);
            // res.render('error', {'title': 'jbgz'});
        } else {
            res.render('index', {'title': 'jbgz', 'hot_videos': hot_videos, video_type:'最热视频'});
        }

       
    });

    // res.render('index', {title: 'jbgz', 'result': ['simon']});
});



module.exports = router;