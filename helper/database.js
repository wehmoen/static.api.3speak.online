const config = require('./config')
const mongoose = require('mongoose');

const threespeak = mongoose.createConnection(config.MONGO_CONNECTION_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const AppConfigurationSchema = new mongoose.Schema({
    version: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{1,3}.\d{1,2}.\d{1,4}/.test(v);
            },
            message: props => `${props.value} is not a valid version number!`
        },
        required: true
    },
    maintenance: {
        start: Date,
        end: Date,
        notice: String
    }
}, { capped: { max: 1, autoIndexId: true }})

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

const ContentCreatorSchema = new mongoose.Schema({
    username: {type: String, required: true},
    banned: {type: Boolean, required: true, default: false},
    canProxyUpvote: {type: Boolean, required: true, default: false},
    queuedCanProxyUpvote: {type: Boolean, required: true, default: false},
    upvoteDay: {type: Number},
    queuedUpvoteDay: {type: Number},
    queuedLimit: {type: Number, required: false, default: 0},
    hidden: {type: Boolean, required: true, default: false},
    isCitizenJournalist: {type: Boolean, required: false, default: false},
    verified: {type: Boolean, required: true, default: false},
    joined: {type: Date, required: true, default: Date.now()},
    score: {type: Number, required: true, default: 0},
    badges: {
        type: [String],
        required: true,
        default: []
    },
    darkMode:{type: Boolean, required: true, default: false}
});

const Video = threespeak.model("Video", VideoSchema);
const AppConfiguration = threespeak.model("AppConfiguration", AppConfigurationSchema);
const ContentCreator = threespeak.model("ContentCreator", ContentCreatorSchema);

module.exports = {
    Video,
    AppConfiguration,
    ContentCreator
}