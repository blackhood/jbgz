// this is one of the best way to creat model
// require some kind of db - mongodb for example
// var mangodb = require('mongodb');

// constructor
function VIDEO(){
    // some internal variables
    // this.username = username;
};



VIDEO.prototype.get_hot_videos = function(start, end, callback){

    videos = [{name: 'ruki'}, {name: 'simon'}];

    // do something query
    callback(null, videos);
};

VIDEO.prototype.get_recent_videos = function(start, end, callback){
};

VIDEO.prototype.search_videos = function(keyword, callback){
};




module.exports = VIDEO;