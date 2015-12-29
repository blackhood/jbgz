var User = require('../models/user_model.js');
var Video = require('../models/video_model.js');

function VIDEO(){
};

VIDEO.prototype.insert_video = function(video, callback) {
    console.log("Insert a new video to database");

    var dummy = new Video ({
        user_id: '507c7f79bcf86cd7994f6c0e',
        user_name: 'Ruki',
        title: 'First Video Ever!!!!',
        description: 'This is the first video ever, I\'m so excited!!',
        src: 'http://91.p9p.co/ev.php?VID=0e4ceBOYjQt1B4F2wOyChgc4JUSQz15cliIxvbxFRWGc4GIx',
        duration: '03:14秒',
        thumbnail: 'http://www.botoxbeerbling.com/wp-content/uploads/2013/08/Hot-Detroit-Auto-Show-Girls.jpg',
        views: 50,
        tags: ['#Rukish', '#rukiway', '#doitlikeruki', '#likeAGorilla']
    });

    dummy.save(function(err) {
        if (err) throw err;

        console.log('A new dummy has been created');
        res.send('A new dummy has been created');
    });

};


VIDEO.prototype.get_hot_videos = function(start, end, callback){

    console.log('get hot videos');

    var monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    Video.find().where('upload_date').gt(monthAgo).sort({views: -1}).skip(start).limit(end-start).exec(
        function(err, videos) {
            if (err) throw err;

            console.log(videos);
            callback (null, videos);
        }
    );
};


VIDEO.prototype.get_recent_videos = function(start, end, callback){
    console.log('get recent videos');

    Video.find().sort({upload_date: -1}).skip(start).limit(end-start).exec(
        function(err, videos) {
            if (err) throw err;

            callback(null, videos);
        }
    );
};


VIDEO.prototype.get_video_of_id = function(video_id, callback){
    Video.find({'_id': '56822cded8cc04320eed8c3f'},
        function(err, video) {
            if (err) throw err;
            console.log('-------------------------------------------------');
            console.log(video);
            console.log('++++++++++++++++++++++++++++++++++++++++++++++++');
            callback(null, video)
        }
    );
};


VIDEO.prototype.all = function(callback){
    console.log('show all videos');
    Video.find({}, function(err, videos) {
        if (err) throw err;

        console.log(videos);
        callback(null, videos);
    });
};

// VIDEO.prototype.get_videos_of_user = function(user_id, start, end, callback){
// };

module.exports = new VIDEO();
