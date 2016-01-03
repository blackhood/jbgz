var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var user = require('../models/user_manager.js');
var nodemailer = require('nodemailer');


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
    var name = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_p = req.body.confirm_p;

    if(password !== confirm_p){
        // do something...
    }


    var u = {
                name: name,
                password: password,
                email: email,
                gender: 'male'
    };


    // Use Smtp Protocol to send Email
    // var smtpTransport = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: "jianbinguoziyouknow@gmail.com",
    //         pass: "FanCai007"
    //     }
    // }, {
    //     // default values for sendMail method 
    //     from: 'jianbinguoziyouknow@gmail.com',
    //     headers: {
    //         'My-Awesome-Header': '123'
    //     }
    // });

    // var mail = {
    //     from: "jianbing<jianbinguoziyouknow@gmail.com>",
    //     to: email,
    //     subject: "Thank you for sign up",
    //     text: "Here should be some link to the confirm page"
    //     // html: "<b>Node.js New world for me</b>"
    // }

    // smtpTransport.sendMail(mail, function(error, response){
    //     if(error){
    //         console.log(error);
    //     }else{
    //         console.log("Message sent: " + response.message);
    //     }

    //     smtpTransport.close();
    // });



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
        subject: 'hello',
        text: 'hello world!'
    }, function (err, info){
        if(err){
            console.log(err);
        } else {
            console.log(info);
        }
    });




    user.create_user(u, function(err){
        if(err){
            console.log(err);
        } else {
            console.log('everything is fine');
            req.session.username = name;
            res.redirect('/');
        }
    });
});

router.get('/personal', function(req, res, next){
    res.render('personal_view', {title: 'personal page'});
});



module.exports = router;