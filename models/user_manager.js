var User = require('../models/user_model.js');

function USER(){
};

USER.prototype.create_user = function(user, callback) {
    console.log("Insert a new user to database");

    // var user = {
    //             name: 'Ruki',
    //             password: 'ruki123',
    //             email: 'rukang@gmail.com',
    //             gender: 'male'
    //         };

    //check if the email is already in the database
    User.findOne({ email: user['email'] }, function(err, find) {
        if (err) throw err;

        if (!find) {
            var dummy = new User (user);

            dummy.save(function(err) {
                if (err) throw err;

                console.log('A new user has been created');
                callback(null);
            });
        } else {
            callback('Your email has already been used!');
        }
    });


};

USER.prototype.validate = function(email, password, callback) {
    console.log("Login validation");

    User.findOne({ email: email }, function(err, user) {
        if (err) throw err;
        if(user){


            user.comparePassword(password, function(err, isMatch) {
                if (err) throw err;
                console.log('password matched?', isMatch);

                if (isMatch) {
                    callback(null, user);
                } else {
                    callback('password doesn\'t match', null);
                }
            });
        } else {
            callback('email adress doesn\'t exist', null);
        }
    });
};


module.exports = new USER();
