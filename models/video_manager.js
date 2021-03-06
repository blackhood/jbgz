var User = require('../models/user_model.js');
var Video = require('../models/video_model.js');
var aws = require('aws-sdk');
aws.config.accessKeyId = "AKIAJ5WXT7LEKKYA5EZA";
aws.config.secretAccessKey = "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";

var fs = require('fs');
var s3 = new aws.S3();

function VIDEO(){
};

VIDEO.prototype.insert_video = function(video, callback) {
    // console.log("Insert a new video to database");

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
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


VIDEO.prototype.get_hot_videos = function(start, end, need_total, callback){
    var monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    if(need_total){
        Video.find().where('upload_date').gt(monthAgo).sort({views: -1}).count(
            function(err, count) {
                if (err) {
                    console.log(err);
                    callback(err, null, null);
                    return;
                } 

                Video.find().where('upload_date').gt(monthAgo).sort({views: -1}).skip(start).limit(end-start).exec(
                    function(err, videos) {
                        if (err) {
                            console.log(err);
                            callback(err, null, null);
                        } else {
                            callback(null, videos, count);
                        }
                    }
                );
            }
        );
    } else {
        Video.find().where('upload_date').gt(monthAgo).sort({views: -1}).skip(start).limit(end-start).exec(
            function(err, videos) {
                if (err) {
                    console.log(err);
                    callback(err, null, null);
                } else {
                    callback(null, videos, null);
                }
            }
        );
    }
    
};


VIDEO.prototype.get_recent_videos = function(start, end, need_total, callback){
    if(need_total){
        Video.find().sort({upload_date: -1}).count(
            function(err, count) {
                if (err) {
                    console.log(err);
                    callback(err, null, null);
                    return;
                }

                Video.find().sort({upload_date: -1}).skip(start).limit(end-start).exec(
                    function(err, videos) {
                        if (err) {
                            console.log(err);
                            callback(err, null, null);
                        } else {
                            callback(null, videos, count);
                        }
                    }
                );
            }
        );
    } else {
        Video.find().sort({upload_date: -1}).skip(start).limit(end-start).exec(
            function(err, videos) {
                if (err) {
                    console.log(err);
                    callback(err, null, null);
                } else {
                    callback(null, videos, null);
                }
            }
        );
    }
};


VIDEO.prototype.get_video_of_id = function(video_id, callback){
    Video.find({'_id': video_id},
        function(err, video) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, video[0]);
            }
        }
    );
};

VIDEO.prototype.get_video_of_user = function(user_id, callback){
    Video.find({'user_id': user_id},
        function(err, video) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, video);
            }
        }
    );
};


VIDEO.prototype.all = function(callback){
    // console.log('show all videos');
    Video.find({}, function(err, videos) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, videos);
        }
    });
};

VIDEO.prototype.search_videos = function(keyword, start, end, need_total, callback){
    if (need_total) {
        Video.count({'title': {$regex: new RegExp (keyword, 'i')}}, function(err, total){
            if(err){
                callback(err, null, null);
                return;
            }
            Video.find({'title': {$regex: new RegExp (keyword, 'i')}}).skip(start).limit(end-start).exec(
                function(err, videos) {
                    if (err) {
                        callback(err, null, null);
                    } else{
                        callback(null, videos, total);
                    }
                }
            );
        });

    } else {
        Video.find({'title': {$regex: new RegExp (keyword, 'i')}}).skip(start).limit(end-start).exec(
            function(err, videos) {
                if (err) throw err;

                callback(null, videos);
            }
        );
    }

};

VIDEO.prototype.update_views = function(video_id, callback){

    Video.update(
        {'_id': video_id},
        {$inc : {'views' : 1}},
        function(err, video) {
            if (err){
                console.log(err);
                callback(err)
            }
            else{
                callback(null);
            }
        }
    );
};



VIDEO.prototype.upload_video = function(video, callback){

    var fileName = 'C:\\Users\\ruki2\\Desktop\\1.mp4';
    var fileBuffer = fs.readFileSync(fileName);

    var metaData = getContentTypeByFile(fileName);
    
      s3.putObject({
        ACL: 'public-read',
        Bucket: 'jbgz',
        Key: 'ruki.mp4',
        Body: fileBuffer,
        ContentType: metaData
      }, function(error, response) {
        console.log('uploaded file[' + fileName + '] to [first_file] as [' + metaData + ']');
        console.log(arguments);
        callback(error,response);
      });
};

function getContentTypeByFile(fileName) {
  var rc = 'application/octet-stream';
  var fn = fileName.toLowerCase();

  if (fn.indexOf('.html') >= 0) rc = 'text/html';
  else if (fn.indexOf('.css') >= 0) rc = 'text/css';
  else if (fn.indexOf('.json') >= 0) rc = 'application/json';
  else if (fn.indexOf('.js') >= 0) rc = 'application/x-javascript';
  else if (fn.indexOf('.png') >= 0) rc = 'image/png';
  else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';
  else if (fn.indexOf('.mp4') >= 0) rc = 'video/mp4';
}


module.exports = new VIDEO();
