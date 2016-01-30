var express = require('express');
var router = express.Router();
var user = require('../models/user_model.js');
var video = require('../models/video_manager.js');

// this is for all other .ejs page start with /user in url
router.use('/user', require('./user_controller.js'));
router.use('/video', require('./video_controller.js'));
router.use('/contact', require('./contact_controller.js'));

// this is for index.ejs router 
router.get('/', function(req, res, next) {
    video.get_hot_videos(0,10, false, function(err, hot_videos){
        if(err){
            next(new Error(err));
            return;
        } 
        console.log(hot_videos);
        video.get_recent_videos(0,15, false, function(error, recent_videos){
            if(err){
                next(new Error(err));
                return;
            } 
            res.render('index', {'title': 'jbgz', 'hot_videos': hot_videos, 'recent_videos': recent_videos});
        });
    });
});



module.exports = router;