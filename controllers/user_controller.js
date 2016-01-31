var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var redis = require('redis');
var client = redis.createClient('6379', '52.33.233.61', {no_ready_check: true});
client.on('connect', function() {
    console.log('Connected to Redis');
});

var user_manager = require('../models/user_manager.js');
var video_manager = require('../models/video_manager.js');

router.post('/login', auth, function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;    

    user_manager.validate(email, password, function(err, user){
        if(err){
            res.render('message_view', {title: 'message', message: err});
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
    //no need to check if all fields exist before storing
    var name = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_p = req.body.confirm_p;
    var gender = req.body.gender;

    if(password !== confirm_p){
        res.render('message_view', {title: 'message', message:'password/confirm_password doesn\'t match'});
        return;
    }

    var user = {
                name: name,
                password: password,
                email: email,
                gender: gender,
                description: 'nothing yet...'
    };

    var random_hash = crypto.randomBytes(16).toString('hex');
    var info = {'user': user, 'hash': random_hash}

    client.set(email, JSON.stringify(info));
    client.expire(email, 259200);

    var subject = 'welcome to jbgz';
    var text = '感谢注册!你的账户已经被建立, 请点击以下链接激活.账号: '+ name + 
                '请点击链接激活:http://localhost:5000/user/verify_email?email='+email + '&hash=' + random_hash;;
    send_email(email, subject, text, function(err){
        if(err){
            next(new Error(err));
            return;
        } else {
            res.render('message_view', {title: 'message', message:'Confirmation email has been sent to you'});
        }
    });
});



router.get('/verify_email', function(req, res, next){
    var email = req.query.email;
    var random_hash = req.query.hash;

    client.get(email, function(err, reply) {
        if(err) {
            console.log(err);
            next(new Error(err));
            return;
        } 

        if(!reply){
            res.render('message_view', {title: 'message', message:'Email verify failed. Please try to register again.'});
            return;
        }

        var info = JSON.parse(reply);
        var user = info['user'];
        var hash = info['hash'];

        if(hash !== random_hash){
            console.log('hash value doesn\'t match. should be ' + hash + ' but it is ' + random_hash);
            res.render('message_view', {title: 'message', message:'hash value doesn\'t match.'});
            return;
        }

        if(user){
            user_manager.create_user(user, function(error){
                if(error){
                    res.render('message_view', {title: 'message', message:error});
                } else {
                    res.render('message_view', {title: 'message', message:'email has been verified!'});
                }
            });
        } else {
            console.log('no user found in redit when creating user');
            res.render('message_view', {title: 'message', message:'Email verify failed. Please try to register again.'});
        }
    });
});

router.post('/forget_password', auth, function(req, res, next){
    var email = req.body.email;
    user_manager.user_exist(email, function(err, exist){
        if(err){
            next(new Error(err));
            return;
        } 

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
                    res.render('message_view', {title: 'message', message:"Email has been sent to you!"});
                }
            });
            
        } else {
            res.render('message_view', {title: 'message', message:"Email doesn't exist"});
        }
    });
});

// TODO
router.get('/change_password', function(req, res, next){
    var email = req.query.email;
    var hash = req.query.hash;

    client.get(email, function(err, reply){
        if(err) {
            console.log(err);
            next(new Error(err));
            return;
        } 

        if(!reply){
            res.render('message_view', {title: 'message', message:'Change password request expired. Please try again.'});
            return;
        }

        var random_hash = JSON.parse(reply);
        if(hash !== random_hash){
            console.log('hash value doesn\'t match. should be ' + hash + ' but it is ' + random_hash);
            res.render('message_view', {title: 'message', message:'hash value doesn\'t match.'});
            return;
        }

        var password = req.body.password;
        var confirm_p = req.body.confirm_p;
        if(password || confirm_p){
            if(password !== confirm_p){
                res.render('message_view', {title: 'message', message:'password/confirm_password doesn\'t match'});
                return;
            }


            // call the change password function here
            
        } else {
            res.render('change_password_view', {title: 'change password'});
        }
    });
});

router.get('/personal', function(req, res, next){
    if(req.session && req.session.userid){
        user_manager.get_user_by_id(req.session.userid, function(err, user_info){
            if(err){
                console.log(err);
                next(new Error(err));
            } else {
                res.render('personal_view', {title: 'personal', 'user': user_info});            
            }
        });  
    } else {
        res.render('message_view', {title: 'message', message:"Please login first!"});
    }
});


router.get('/profile', function(req, res, next){
    var username = req.query.username;
    user_manager.get_user_by_name(username, function(err, user_info){
        if(err){
            console.log(err);
            next(new Error(err));
        } else {
            res.render('profile_view', {'title': 'profile', 'user': user_info});          
        }
    });  
});

// TODO
// handle edit form
router.get('/info', function(req, res, next){
    if(req.session && req.session.userid){
        user_manager.get_user_by_id(req.session.userid, function(err, user_info){
            if(err){
                console.log(err);
                next(new Error(err));
            } else {
                res.render('info_view', {title: 'edit info', 'user': user_info});            
            }
        });  
    } else {
        res.redirect('/');
    }
});

router.post('/edit_info', function(req, res, next){
    if(req.session && req.session.userid){
        var description = req.body.description;
        var gender = req.body.gender;
        console.log(description);
        console.log(gender);

        // user_manager.get_user_by_id(req.session.userid, function(err, user_info){
        //     if(err){
        //         console.log(err);
        //         next(new Error(err));
        //     } else {
        //         res.render('info_view', {title: 'edit info', 'user': user_info});            
        //     }
        // });  
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