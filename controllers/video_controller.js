var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var video_manager = require('../models/video_manager.js');
var user_manager = require('../models/user_manager.js');
var paginator = require('super-pagination').paginator;
// var express = require('express');
var multer  = require('multer');
var uploading = multer({
  dest: './public/uploads/',
  limits: {fileSize: 1000000000, files:1},
})


// this refer to /video/
router.get('/', function(req, res, next){
    var video_id = req.query.v_id;

    video_manager.get_video_of_id(video_id, function(err, v){
        if(err || !v){
            next(new Error('Can\' find the video...'));
        } else {
            user_manager.get_user_by_id(v.user_id, function(err, user){
                if(err){
                    next(new Error(err));
                } else {
                    res.render('video_view', {title:  'user page', video: v, user: user});
                    video_manager.update_views(video_id, function(error) {
                        if (error){
                            console.log('update video view count failed for ' + video_id + '\n' + error);
                        }
                    });
                }
            })
        }
    });  
});

router.get('/search',function(req, res, next){

    var page = req.query.page;
    var need_total = false;
    if(!page){
        page = 1;
        need_total = true;
    }
    console.log(page);
    if(typeof req.session.total_pages !== 'undefined'){
        need_total = true;
    }

    var keyword = req.query.keyword;
    console.log(keyword);
    // var v = new video();
    video_manager.search_videos(keyword, (page-1)*2, page*2, need_total, function(err, search_results, total_pages){
        if(err){
            console.log('something wrong...')
            //do something...
        } else {

            var pagination = new paginator().set({
                per_page : 10,
                current_page : page,
                total : 1000,
                number_of_pages : 100,
                number_of_links : 10,
                url : '/video/search?keyword=' + keyword,
                theme : 'bootstrap'
            });


            res.render('search_view', {'title': 'jbgz', 'videos': search_results, video_type:'search_videos', paginator: pagination});
        }
    });

});

router.get('/hot_video',function(req, res, next){

    var page = req.query.page;
    if(!page){
        page = 1;
    }
    console.log(page);

    // var v = new video();
    video_manager.get_hot_videos((page-1)*2, page*2,function(err, hot_videos){
        if(err){
            console.log('something wrong...')
            //do something...
        } else {
            var pagination = new paginator().set({
                per_page : 10,
                current_page : page,
                total : 1000,
                number_of_pages : 10,
                number_of_links : 10,
                url : '/video/hot_video',
                theme : 'bootstrap'
            });


            res.render('hot_video_view', {'title': 'jbgz', 'videos': hot_videos, video_type:'hot_videos', paginator: pagination});
        }
    });

});

router.get('/recent_video',function(req, res, next){

    var page = req.query.page;
    if(!page){
        page = 1;
    }
    console.log(page);

    video_manager.get_recent_videos((page-1)*2, page*2, function(err, recent_videos){
        if(err){
            console.log('something wrong...')
            //do something...
        } else {

            var pagination = new paginator().set({
                per_page : 10,
                current_page : page,
                total : 1000,
                number_of_pages : 100,
                number_of_links : 10,
                url : '/video/recent_video',
                theme : 'bootstrap'
            });


            res.render('recent_video_view', {'title': 'jbgz', 'videos': recent_videos, video_type:'recent_videos', paginator: pagination});
        }
    });

});



router.post('/upload_video', uploading.single('fileToUpload'), function(req, res, next){
    // console.log(req.body);
    console.log(req.file);

    res.render('personal_view', {title: 'personal page'});
    // console.log( req.body.fileToUpload );

    // video.upload_video(v, function(err, response){
    //     console.log(err);
    //     console.log(response);
    // });
});

module.exports = router;