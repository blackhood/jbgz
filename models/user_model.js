var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;

var user_schema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: String,
    gender: String,
    description: String,
    created_date: {type: Date, default: Date.now},
    profile_img: {type: String, default: 'https://chivethebrigade.files.wordpress.com/2012/04/girls-mma-500-6.jpg'}
});

user_schema.pre('save', function(next) {

    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

user_schema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('user', user_schema);
