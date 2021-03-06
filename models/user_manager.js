var User = require('../models/user_model.js');

function USER(){
};

USER.prototype.create_user = function(user, callback) {
    User.findOne({ email: user['email'] }, function(err, find) {
        if (err) {
            callback('create user failed');
            return;
        }
        if (!find) {
            var dummy = new User (user);
            dummy.save(function(err) {
                if (err) {
                    callback('create user failed');
                } else {
                    callback(null);
                    console.log('A new user has been created');
                }
            });
        } else {
            callback('Your email has already been used!');
        }
    });
};

USER.prototype.validate = function(email, password, callback) {

    User.findOne({ email: email }, function(err, user) {
        if (err) {
            callback(err, null);
        } else {
            if(user){
                user.comparePassword(password, function(err, isMatch) {
                    if (err) {
                        callback(err, null);
                    } else {
                        console.log('password matched?', isMatch);
                        if (isMatch) {
                            callback(null, user);
                        } else {
                            callback('password doesn\'t match', null);
                        }
                    }
                });
            } else {
                callback('email adress doesn\'t exist', null);
            }
        }
    });
};

USER.prototype.get_user_by_id = function(user_id, callback) {

    //check if the email is already in the database
    User.find({ '_id': user_id }, function(err, find) {
        if (err) {
            callback(err, null);
        } else {
            if (find) {
            callback(null, find[0]);
            } else {
                callback('Invalid user id', null);
            }
        }        
    });
};

USER.prototype.get_user_by_name = function(name, callback) {
    console.log("find users videos");

    //check if the email is already in the database
    User.find({ 'name': name }, function(err, find) {
        if (err) {
            callback(err, null);
        } else {
            if (find) {
                callback(null, find[0]);
            } else {
                callback('Invalid user name', null);
            }
        }        
    });
};

USER.prototype.get_user_by_email = function(email, callback) {

    //check if the email is already in the database
    User.find({ 'email': email }, function(err, find) {
        if (err) {
            callback(err, null);
        } else {
            if (find) {
            callback(null, find[0]);
            } else {
                callback('Invalid user email', null);
            }
        }        
    });
};


USER.prototype.edit_info = function(user_id, info, callback) {
    User.findById(user_id, function(err, user) {
        if (err) {
            callback(err, null);
        } else {
            if (user) {
                //update
                if (info['name']) {
                    user.name = info['name'];
                }

                if (info['password']) {
                    user.password = info['password'];
                }

                if (info['email']) {
                    user.email = info['email'];
                }

                if (info['gender']) {
                    user.gender = info['gender'];
                }

                if (info['description']) {
                    user.description = info['description'];
                }

                if (info['profile_img']) {
                    user.profile_img = info['profile_img'];
                }

                // save the user
                user.save(function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, 'User successfully update!');
                    }
                });
            } else {
                callback('Invalid user id', null);
            }
        }
    });
};


USER.prototype.user_exist = function(email, callback) {
    User.findOne({ email: email }, function(err, find) {
        if (err) {
            callback(err, null)
        } else {
            if (find) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        }
    });
};

module.exports = new USER();
