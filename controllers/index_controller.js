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
    
    video.get_hot_videos(0,10, function(err, hot_videos){
        if(err){
            next(new Error(err));
        } else{

            video.get_recent_videos(0,15, function(error, recent_videos){
                if(err){
                    next(new Error(err));
                } else{
                    if(req.session && req.session.message){
                        var message = req.session.message;
                        req.session.message = null;
                        res.render('index', {'title': 'jbgz', 'hot_videos': hot_videos, 'recent_videos': recent_videos, video_type:'最热视频', message: message});
                        console.log('hello');

                    } else {
                        res.render('index', {'title': 'jbgz', 'hot_videos': hot_videos, 'recent_videos': recent_videos, video_type:'最热视频'});
                    }
                    
                }
            });
        }
    });
});



module.exports = router;