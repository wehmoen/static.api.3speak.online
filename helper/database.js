const config = require('./config')
const mongoose = require('mongoose');

const threespeak = mongoose.createConnection(config.MONGO_CONNECTION_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const VideoSchema = new mongoose.Schema({
    filename: {type: String, required: true},
    title: String,
    score: {type: Number, required: true, default: 0},
    tags: String,
    description: String,
    status: {
        type: String,
        enum: ["uploaded", "encoding", "saving", "published", "deleted", "encoding_failed", "encoding_queued", "encoding_halted_time", "encoding_queued_vod", "scheduled"],
        default: 'uploaded',
        required: true
    },
    size: {type: Number, required: true},
    permlink: {type: String, required: true},
    duration: {type: Number, required: true},
    created: {type: Date, required: true, default: Date.now()},
    owner: {type: String, required: true},
    is3CJContent: {type: Boolean, required: false, default: false},
    isNsfwContent: {type: Boolean, default: false},
    declineRewards: {type: Boolean, default: false},
    language: {type: String, required: false, default: "en"},
    category: {type: String, required: false, default: "general"},
    firstUpload: {type: Boolean, default: false},
    views: {type: Number, default: 0},
    hive: {type: String, default: 'hive-181335'},
    upvoteEligible: {type: Boolean, default: true}
});

const Video = threespeak.model("Video", VideoSchema);

module.exports = {
    Video
}