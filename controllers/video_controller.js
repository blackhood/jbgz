var express = require('express');
var router = express.Router();
var paginator = require('super-pagination').paginator;
var auth = require('../middlewares/auth');
var video_manager = require('../models/video_manager.js');
var user_manager = require('../models/user_manager.js');
var CONSTANTS = require('../helpers/constants.js');
var multer  = require('multer');
var uploading = multer({
  dest: './public/uploads/',
  limits: {fileSize: 1000000000, files:1},
})


router.get('/', function(req, res, next){
    var video_id = req.query.v_id;

    video_manager.get_video_of_id(video_id, function(err, video){
        if(err || !video){
            next(new Error('Can\' find the video...'));
            return;
        } 
        user_manager.get_user_by_id(video.user_id, function(err, user){
            if(err || !user){
                next(new Error('Can\'t find user'));
                return;
            }
            res.render('video_view', {title:  'user page', video: video, user: user});
            video_manager.update_views(video_id, function(error) {
                if (error){
                    console.log('update video view count failed for ' + video_id + '\n' + error);
                }
            });
        })
        
    });  
});

router.get('/search',function(req, res, next){
    var page = req.query.page;
    var keyword = req.query.keyword;

    if(!page){
        page = 1;
    }

    // setting need_total to true, always
    video_manager.search_videos(keyword, (page-1)*CONSTANTS.VIDEOS_PER_PAGE, page*CONSTANTS.VIDEOS_PER_PAGE, true, function(err, search_results, total_count){
        if(err){
            next(new Error(err));
            return;
        }
        var number_of_pages = Math.ceil(total_count/(CONSTANTS.VIDEOS_PER_PAGE));
        if(number_of_pages === 0)
            number_of_pages = -1;
        var pagination = new paginator().set({
            current_page : page,
            number_of_pages : number_of_pages,
            number_of_links : 10,
            url : '/video/search?keyword=' + keyword,
            theme : 'bootstrap'
        });

        res.render('search_view', {'title': 'jbgz', 'videos': search_results, video_type:'search_videos', paginator: pagination});
    });
});

router.get('/hot_video',function(req, res, next){
    var page = req.query.page;
    if(!page){
        page = 1;
    }

    video_manager.get_hot_videos((page-1)*CONSTANTS.VIDEOS_PER_PAGE, page*CONSTANTS.VIDEOS_PER_PAGE, true, function(err, hot_videos, totol_hot_videos){
        if(err){
            next(new Error(err));
            return;
        } 
        var pagination = new paginator().set({
            current_page : page,
            number_of_pages : Math.ceil(totol_hot_videos/(CONSTANTS.VIDEOS_PER_PAGE)),
            number_of_links : 10,
            url : '/video/hot_video',
            theme : 'bootstrap'
        });

        res.render('hot_video_view', {'title': 'jbgz', 'videos': hot_videos, video_type:'hot_videos', paginator: pagination});
    });
});

router.get('/recent_video',function(req, res, next){

    var page = req.query.page;
    if(!page){
        page = 1;
    }

    video_manager.get_recent_videos((page-1)*CONSTANTS.VIDEOS_PER_PAGE, page*CONSTANTS.VIDEOS_PER_PAGE, true, function(err, recent_videos, total_recent_videos){
        if(err){
            next(new Error(err));
            return;
        } else {
            var pagination = new paginator().set({
                current_page : page,
                number_of_pages : Math.ceil(total_recent_videos/(CONSTANTS.VIDEOS_PER_PAGE)),
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
    // this works
    console.log(req.file);
    // TODO
    // put video into s3 and update db
    res.render('personal_view', {title: 'personal page'});
    // console.log( req.body.fileToUpload );

    // video.upload_video(v, function(err, response){
    //     console.log(err);
    //     console.log(response);
    // });
});

module.exports = router;