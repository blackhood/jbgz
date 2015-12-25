// this is one of the best way to creat model
// require some kind of db - mongodb for example
// var mangodb = require('mongodb');
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['52.33.233.61'],
                                    keyspace: "jbgz"});

function VIDEO(){
};

VIDEO.prototype.get_hot_videos = function(bucket, start, end, callback){

    console.log("Querying Hot Videos from database with bucket: " + bucket);

    //var cmd = 'SELECT * FROM jbgz.hot_videos WHERE BUCKET = \'2015-12\' ORDER BY views DESC ;'
    var cmd = 'SELECT * FROM jbgz.hot_videos WHERE BUCKET = ' + bucket + ' ORDER BY views DESC ;'

    client.execute(cmd, function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                console.log(result.rows);
                callback(null, result.rows);
            }
        }
    );
};

VIDEO.prototype.insert_video = function(video, callback){

    console.log("Insert a new video to database");

    var cmd = 'INSERT INTO jbgz.video ()'
};

VIDEO.prototype.get_recent_videos = function(bucket, start, end, callback){

    //var cmd = 'SELECT * FROM jbgz.video WHERE BUCKET = \'2015-12\' AND upload_date > \'2015-12-21\' AND upload_date < \'2015-12-25\' ;'
    var cmd = 'SELECT * FROM jbgz.video WHERE BUCKET = ' + bucket + ' ;'

    client.execute(cmd, [], {fetchSize: 0},function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                console.log(result.rows);
                callback(null, result.rows);
            }
        }
    );
};
VIDEO.prototype.search_videos = function(keyword, start, end, callback){
};

VIDEO.prototype.get_videos_of_user = function(user_id, start, end, callback){
};

module.exports = VIDEO;
