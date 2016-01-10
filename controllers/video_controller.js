var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var video = require('../models/video_manager.js');
var paginator = require('super-pagination').paginator;
// var express = require('express');
var multer  = require('multer');
var uploading = multer({
  dest: './public/uploads/',
  limits: {fileSize: 1000000000, files:1},
})


router.get('/some_url', function(req, res, next){
    console.log('come 2');
    res.render('view_video', {title: 'user page'});
    console.log('what');
});


// this refer to /video/
router.get('/', function(req, res, next){
    var video_id = req.query.video_id;

    var user = {
        user_id: 222,
        password: 'encrpted',
        name: 'david',
        emails: 'davide@gmail.com',
        gender: 'male',
        created_date: '12/22/2015',
        user_thumbnails: 'http://www.exgf.com/images/04JUL2012/05.jpg',
        videos: [111]

    }
    // console.log('come on1');
    // console.log('2222');
    // // console.log(video_id);
    // res.render('video_view', {title:  'user page', video: video, user: user});


    video.get_video_of_id(video_id, function(err, v){
        if(err){
            throw err;
        }
        
        console.log(v);
        res.render('video_view', {title:  'user page', video: v[0], user: user});
    });
    video.update_views(video_id, function(error) {
        if (error){
            console.log('update video view count failed for ' + video_id + '\n' + err);
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
    video.search_videos(keyword, (page-1)*2, page*2, need_total, function(err, search_results, total_pages){
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
    video.get_hot_videos((page-1)*2, page*2,function(err, hot_videos){
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

    video.get_recent_videos((page-1)*2, page*2, function(err, recent_videos){
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