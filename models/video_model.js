// this is one of the best way to creat model
// require some kind of db - mongodb for example
// var mangodb = require('mongodb');
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['52.33.233.61'],
                                    keyspace: "jbgz"});

function VIDEO(){
};

var hardcode_data = [{
        video_id: 111, 
        user_id:222, 
        upload_date: '12/22/2015', 
        duration:'3min', 
        src: 'http://91.p9p.co/ev.php?VID=0e4ceBOYjQt1B4F2wOyChgc4JUSQz15cliIxvbxFRWGc4GIx', 
        video_thumbnails:'http://www.exgf.com/images/04JUL2012/05.jpg',
        title:'aaa',
        description:'best porn ever',
        views:'999'
    }, {
        video_id: 112, 
        user_id:222, 
        upload_date: '12/22/2015', 
        duration:'3min', 
        src: 'http://91.p9p.co/ev.php?VID=0e4ceBOYjQt1B4F2wOyChgc4JUSQz15cliIxvbxFRWGc4GIx', 
        video_thumbnails:'https://pbs.twimg.com/profile_images/2433138206/image.jpg',
        title:'bbb',
        description:'best porn ever',
        views:'999'
    } , {
        video_id: 113, 
        user_id:222, 
        upload_date: '12/22/2015', 
        duration:'3min', 
        src: 'http://91.p9p.co/ev.php?VID=0e4ceBOYjQt1B4F2wOyChgc4JUSQz15cliIxvbxFRWGc4GIx', 
        video_thumbnails:'http://i3.mirror.co.uk/incoming/article5115566.ece/ALTERNATES/s615/MAIN-Chinese-Porn-Star-Julia.jpg',
        title:'aaabbb',
        description:'best porn ever',
        views:'999'
    }

    ];

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
    callback(null, hardcode_data);
};

VIDEO.prototype.get_videos_of_user = function(user_id, callback){
};

module.exports = VIDEO;