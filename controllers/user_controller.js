var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var user = require('../models/user_manager.js');
var video_manager = require('../models/video_manager.js');
var nodemailer = require('nodemailer');

var redis = require('redis');

var client = redis.createClient('6379', '52.33.233.61', {no_ready_check: true});

client.on('connect', function() {
    console.log('Connected to Redis');
});

// this refer to /user/
router.post('/', auth, function(req, res, next){

});

router.post('/login', auth, function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    console.log(password);

    

    user.validate(email, password, function(err, user){
        if(err){
            console.log(err);
        } else {
            console.log('everything is fine');
            req.session.username = user.name;
            res.redirect('/');
        }
    });


});

router.post('/logout', auth, function(req, res, next){
    req.session.destroy();
    // console.log(req.session.email);
    res.redirect('/');

});

router.post('/sign_up', auth, function(req, res, next){
    // need to check if all fields exist before storing
    var name = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_p = req.body.confirm_p;
    var gender = req.body.gender;
    console.log(gender);
    if(password !== confirm_p){
        // do something...
    }

    // return;
    var u = {
                name: name,
                password: password,
                email: email,
                gender: gender
    };

    var infor = {'user': u, 'hash': 'some hash'}


    client.set(email, JSON.stringify(infor));
    client.expire(email, 259200);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jianbinguoziyouknow@gmail.com',
            pass: 'FanCai007'
        }
    }, {
        // default values for sendMail method 
        from: 'jianbinguoziyouknow@gmail.com',
        headers: {
            'My-Awesome-Header': '123'
        }
    });
    var mes = '感谢注册!你的账户已经被建立, 请点击以下链接激活.账号: '+ name + 
    '请点击链接激活:http://localhost:5000/user/verify_email?email='+email;
    transporter.sendMail({
        to: email,
        subject: 'welcome to jbgz',
        text: mes
    }, function (err, info){
        if(err){
            console.log(err);
        } else {
            console.log(info);
            res.redirect('/');
        }
    });




    // user.create_user(u, function(err){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log('everything is fine');
    //         req.session.username = name;
    //         res.redirect('/');
    //     }
    // });
});

router.get('/verify_email', function(req, res, next){
    var email = req.query.email;
    console.log(email);

    client.get(email, function(err, reply) {
        if(err) {
            console.log(err);
            throw err;
            res.render('verify_email_view', {title: 'veirfy email page', message:'email verify failed.'});
        } 

        console.log('-------------------------------------');
        var u = JSON.parse(reply);
        u = u['user'];
        console.log(user);

        if(u){
            user.create_user(u, function(error){
                if(error){
                    console.log(error);
                    res.render('verify_email_view', {title: 'veirfy email page', message:'email verify failed.'});
                } else {
                    console.log('everything is fine');
                    // req.session.username = name;
                    // res.redirect('/');
                    res.render('verify_email_view', {title: 'veirfy email page', message:'email has been verified!'});
                }
            });
        } else {
            console.log('no user found in redit when creating user');
        }
        

        // res.send(reply);
    });

    
});


router.get('/personal', function(req, res, next){
    res.render('personal_view', {title: 'personal page'});
});


router.get('/profile', function(req, res, next){
    var user_videos = video_manager.get_video_of_user('username or email');
    var u = user.get_user_by_id('someid');
    res.render('profile_view', {'title': 'profile', 'videos': user_videos,'user':u, video_type:'user_videos'});
    // res.render('profile_view', {title: 'profile page'});
});


module.exports = router;