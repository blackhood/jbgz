var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var video = require('../models/video_model.js');


router.get('/some_url', function(req, res, next){
    console.log('come 2');
    res.render('view_video', {title: 'user page'});
    console.log('what');
});


// this refer to /video/
router.get('/', function(req, res, next){
    var video_id = req.query.video_id;
    var video = {
        video_id: 111, 
        user_id:222, 
        upload_date: '12/22/2015', 
        duration:'3min', 
        src: 'http://91.p9p.co/ev.php?VID=0e4ceBOYjQt1B4F2wOyChgc4JUSQz15cliIxvbxFRWGc4GIx', 
        video_thumbnails:'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiMz8qm4_DJAhVEMSYKHZf0AMwQjRwIBw&url=http%3A%2F%2Fexgf.com%2F&psig=AFQjCNHndV0Hi1V5K6YgzLsBszJWkPO25g&ust=1450918580955574',
        title:'porn 123',
        description:'best porn ever',
        views:'999'
    };

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
    console.log('come on1');
    console.log('2222');
    // console.log(video_id);
    res.render('video_view', {title:  'user page', video: video, user: user});

});

router.get('/search',function(req, res, next){

    var page = req.query.page;
    if(!page){
        page = 1;
    }
    console.log(page);


    var keyword = req.query.keyword;
    console.log(keyword);
    var v = new video();
    v.search_videos(0,20,function(err, search_results){
        if(err){
            //do something...
        } else {

            var pagination = require('pagination');
            var paginator = pagination.create('search', {prelink:'/video/search', current: page, rowsPerPage: 200, totalResult: 10020});
            console.log(paginator.render());

            res.render('search_view', {'title': 'jbgz', 'videos': search_results, video_type:'search_videos', paginator: paginator});
        }
    });

});



module.exports = router;