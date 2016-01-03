var express = require('express');
var router = express.Router();
var user = require('../models/user_model.js');
var video = require('../models/video_manager.js');

// this is for all other .ejs page start with /user in url
router.use('/user', require('./user_controller.js'));
router.use('/video', require('./video_controller.js'));
router.use('/contact', require('./contact_controller.js'));

// this is for index.ejs router 
router.get('/', function(req, res) {
    // console.log('come on1');
    var backet = "'2015-12'";
    // var video = new VIDEO();
    // video.get_hot_videos(backet, 0, 15, function(err, hot_videos){
    //     // console.log(error);
    //     console.log('this is the main page');
        
    //     if (err) {
    //         console.log(err);
    //         // res.render('error', {'title': 'jbgz'});
    //     } else {
    //         res.render('index', {'title': 'jbgz', 'hot_videos': hot_videos, video_type:'最热视频'});
    //     }

       
    // });
    
    video.get_hot_videos(0,10, function(err, hot_videos){
        if(err){
            throw err;
        } else{

            video.get_recent_videos(0,15, function(error, recent_videos){
                if(err){
                    throw error;
                } else{
                    console.log('good');
                    res.render('index', {'title': 'jbgz', 'hot_videos': hot_videos, 'recent_videos': recent_videos, video_type:'最热视频'});
                }
            });
            
        }
    });
});



module.exports = router;