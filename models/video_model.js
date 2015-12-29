var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var video_schema = new Schema({
    user_id: Schema.Types.ObjectId,
    user_name: String,
    title: {type: String, required: true},
    description: String,
    src: String,
    upload_date: {type: Date, default: Date.now},
    duration: String,
    thumbnail: String,
    views: Number,
    tags: [{type: String}]
});



module.exports = mongoose.model('video', video_schema);
