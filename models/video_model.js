// this is one of the best way to creat model
// require some kind of db - mongodb for example
// var mangodb = require('mongodb');

// constructor
function VIDEO(){
    // some internal variables
    // this.username = username;
};


VIDEO.prototype.get_hot_videos = function(start, end, callback){
    var result = ['simon', 'ruki'];

    // do something query
    var error = 0;
    callback(result, error);
};

VIDEO.prototype.get_recent_videos = function(start, end, callback){
};

VIDEO.prototype.search_videos = function(start, end, callback){
};






VIDEO.prototype.get_videos_of_user = function(user_id, callback){
};





module.exports = VIDEO;