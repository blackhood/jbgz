// this is one of the best way to creat model
// require some kind of db - mongodb for example
// var mangodb = require('mongodb');
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['52.33.233.61'],
                                    keyspace: "jbgz"});

function VIDEO(){
};

VIDEO.prototype.get_hot_videos = function(start, end, callback){

    console.log("Querying Hot Videos from database with start: " + start +
    ", end: " + end);

    // var cmd = 'SELECT v.video_id, v.user_id, v.title, ' +
    //             'v.description, v.upload_date, v.duration, ' +
    //             'v.tags, v.src, v.video_thumbnails,' + 
    //             'v.image_thumbnail, v.views, u.name ' +
    //             'FROM jbgz.video v INNER JOIN jbgz.user u ON ' +
    //             'v.user_id = u.user_id ORDER BY v.views ' +
    //             'DESC LIMIT ' + start + ',' + end;

    var hardcode_data = [{name: 'simon'}, {name: 'ruki'}];   
    callback(null, hardcode_data);

    // var cmd = "SELECT video_id, title FROM jbgz.video";
    // client.execute(cmd, function (err, result) {
    //         if (err) {
    //             callback(err, null);
    //         } 
    //         else {
    //             console.log(result.rows[0].title);

    //             callback(null, result.rows);
    //         }
    //     }
    // );
};


VIDEO.prototype.get_recent_videos = function(start, end, callback){
};

VIDEO.prototype.search_videos = function(start, end, callback){
};

VIDEO.prototype.get_videos_of_user = function(user_id, callback){
};

module.exports = VIDEO;