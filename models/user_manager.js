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

USER.prototype.get_user_by_id = function(user_id, callback) {

    //check if the email is already in the database
    User.find({ '_id': user_id }, function(err, find) {
        if (err) throw err;

        if (find) {
            callback(0, find[0]);
        } else {
            callback('Invalid user id', null);
        }
    });
};

USER.prototype.get_user_by_name = function(name, callback) {
    console.log("find users videos");

    //check if the email is already in the database
    User.find({ 'name': name }, function(err, find) {
        if (err) throw err;

        if (find) {
            callback(0, find[0]);
        } else {
            callback('Invalid user id', null);
        }
    });
};


USER.prototype.edit_info = function(user_id, infor, callback) {
    console.log("edit user information");

    User.findById(user_id, function(err, user) {
        if (err) throw err;

        if (user) {

            //update
            if (infor['name']) {
                user.name = infor['name']
            }

            if (infor['password']) {
                user.password = infor['password']
            }

            if (infor['email']) {
                user.email = infor['email']
            }

            if (infor['gender']) {
                user.gender = infor['gender']
            }

            if (infor['profile_img']) {
                user.profile_img = infor['profile_img']
            }

            // save the user
            user.save(function(err) {
                if (err) throw err;

                callback(null, 'User successfully update!');
            });
        } else {
            callback('Invalid user id', null);
        }
    });
};


USER.prototype.user_exist = function(email, callback) {
    User.findOne({ email: email }, function(err, find) {
        if (err) {
            console.log('flag 2 ' + err);
            throw err;
        } else {
            if (find) {
                callback(true);
            } else {
                callback(false);
            }
        }

        
    });
};

module.exports = new USER();
