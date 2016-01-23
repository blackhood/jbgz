var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var user = require('../models/user_manager.js');
var video_manager = require('../models/video_manager.js');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

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

    user.validate(email, password, function(err, user){
        if(err){
            req.session.message = err;
            res.redirect('/');
        } else {
            console.log('everything is fine');
            req.session.username = user.name;
            req.session.userid = user._id;
            res.redirect('/');
        }
    });
});

router.post('/logout', auth, function(req, res, next){
    req.session.destroy();
    res.redirect('/');
});

// this needs refactor
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

    var random_hash = crypto.randomBytes(16).toString('hex');
    console.log('random hash is ' + random_hash);
    var infor = {'user': u, 'hash': random_hash}


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
    '请点击链接激活:http://localhost:5000/user/verify_email?email='+email + '&hash=' + random_hash;
    transporter.sendMail({
        to: email,
        subject: 'welcome to jbgz',
        text: mes
    }, function (err, info){
        if(err){
            console.log(err);
            next(new Error(err));
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
    var random_hash = req.query.hash;
    console.log(email);

    client.get(email, function(err, reply) {
        if(err) {
            console.log(err);
            throw err;
            res.render('verify_email_view', {title: 'veirfy email page', message:'email verify failed.'});
        } 

        console.log('-------------------------------------');
        var info = JSON.parse(reply);
        var user_info = info['user'];
        var hash_info = info['hash'];
        console.log(user_info);
        if(hash_info !== random_hash){
             console.log('hash value doesn\'t match. should be ' + hash_info + ' but it is ' + random_hash);
        } else if(user_info){
            user.create_user(user_info, function(error){
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
    });
});

router.post('/forget_password', auth, function(req, res, next){
    // need to check if all fields exist before storing
    var email = req.body.email;
    user.user_exist(email, function(exist){
        if(exist){
            
            var random_hash = crypto.randomBytes(16).toString('hex');

            client.set(email, JSON.stringify(random_hash));
            client.expire(email, 259200);

            var subject = "change password";
            var text = '请点击链接激活:http://localhost:5000/user/change_password?email='+email + '&hash=' + random_hash;
            send_email(email, subject, text, function(err){
                if(err){
                    console.log(err);
                    next(new Error(err));
                } else {
                    req.session.message = "Email has been sent to you!";
                    res.redirect('/');
                }
            });
            
        } else {
            req.session.message = "Email doesn't exist";
            res.redirect('/');
        }
    });
});


router.get('/personal', function(req, res, next){
    if(req.session && req.session.userid){
        user.get_user_by_id(req.session.userid, function(err, user_info){
            if(err){
                console.log(err);
                next(new Error(err));
            } else {
                res.render('personal_view', {title: 'personal', 'user': user_info});            
            }
        });  
    } else {
        res.redirect('/');
    }
    
});


router.get('/profile', function(req, res, next){
    var username = req.query.username;
    user.get_user_by_name(username, function(err, user_info){
        if(err){
            console.log(err);
            next(new Error(err));
        } else {
            console.log(user_info.videos);
            res.render('profile_view', {'title': 'profile', 'user': user_info});          
        }
    });  
});

router.get('/edit_info', function(req, res, next){
    if(req.session && req.session.userid){
        user.get_user_by_id(req.session.userid, function(err, user_info){
            if(err){
                console.log(err);
                next(new Error(err));
            } else {
                res.render('edit_info_view', {title: 'edit info', 'user': user_info});            
            }
        });  
    } else {
        res.redirect('/');
    }
});

function send_email(email, subject, text, callback){
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
    
    transporter.sendMail({
        to: email,
        subject: subject,
        text: text
    }, function (err, info){
        if(err){
            console.log('send email error ' + err);
            callback(err);
        } else {
            callback(null);
        }
    });
}

module.exports = router;