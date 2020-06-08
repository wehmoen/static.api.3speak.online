const database = require('./database')
const config = require('./config')

function processTags(tags) {
    const fallback = ["threespeak", "video"];

    const processed = [];

    for (let tag of tags) {
        tag = tag.toLowerCase().trim();

        if (!tag.startsWith("hive-") && tag.length >= 3) {
            tag = tag.replace(/[^a-z0-9]/g, '')
            if (!processed.includes(tag) && tag.length >= 3) {
                processed.push(tag)
            }
        }
    }

    return processed.length === 0 ? fallback : processed;
}

function transformVideo(video) {
    video = (new database.Video(video)).toObject()
    video.tags = processTags(video.tags.split(","))
    video.hive = video.hive.startsWith("hive-") ? video.hive : 'hive-181335'
    delete video._id;
    delete video['__v'];
    return video;
}

function filterFeed(videos) {
    const author_video_count = {};

    function getAuthorVideoCount(author) {

        return author_video_count[author] || 0

    }

    function incrementAuthorVideoCount(author) {

        if (!author_video_count[author]) {

            author_video_count[author] = 0

        }

        author_video_count[author] += 1

    }

    const feed = [];

    for (const video of videos) {
        if (getAuthorVideoCount(video.owner) < config.FEED_MAX_PER_AUTHOR) {
            feed.push(video);
            incrementAuthorVideoCount(video.owner)
        }
    }

    const collection = [];

    for (let video of feed) {
        collection.push(transformVideo(video))
    }

    return collection;
}

module.exports = {
    tryCastInt: (input, fallback = 0) => {
        input = parseInt(input);
        return isNaN(input) ? fallback : input
    },
    transformVideo,
    getTrendingFeed: async (skip = 0, limit = 100, query = {}, languages = []) => {
        const lastWeekStart = (new Date()).setDate((new Date()).getDate() - 7);

        const params = {
            status: "published",
            created: {$gt: lastWeekStart},
            score: {$gt: 0},
            pinned: false
        }

        if (languages.length > 0) {
            params.language = {$in: languages}
        }

        const trendingVideos = await database.Video.find(Object.assign(query, params), null).sort('-score').skip(skip).limit(limit);

        return filterFeed(trendingVideos)
    },
    getNewFeed: async (skip = 0, limit = 100, query = {}, languages = []) => {

        const params = {
            status: "published",
            score: {$gte: 0},
            pinned: false
        }

        if (languages.length > 0) {
            params.language = {$in: languages}
        }

        const newVideos = await database.Video.find(Object.assign(query, params), null).sort('-created').skip(skip).limit(limit);

        return filterFeed(newVideos)
    },
    getCuratedFeed: async (skip = 0, limit = 100, query = {}, languages = []) => {

        const params = {
            recommended: true,
            pinned: false,
            status: "published"
        }

        if (languages.length > 0) {
            params.language = {$in: languages}
        }

        const curatedVideos = await database.Video.find(params).sort('-created').skip(skip).limit(limit)

        return filterFeed(curatedVideos)
    },
    getChannelFeed: async (channel, skip = 0, limit = 100, query = {}) => {

        const params = {
            owner: channel,
            status: "published"
        }

        const channelVideos = await database.Video.find(Object.assign(query, params)).sort('-created').skip(skip).limit(limit)

        return filterFeed(channelVideos)
    },
    getPinnedFeed: async (skip = 0, limit = 100) => {

        const params = {
            status: "published",
            pinned: true
        }

        const curatedVideos = await database.Video.find(params).sort('-created').skip(skip).limit(limit)

        return filterFeed(curatedVideos)
    },
    getRecommendedVideos: async(author, languages = [],limit=25, embeded = false) => {
        const query = {status: 'published', $or: [{owner: author}]};
        if (languages.length > 0) {

            query.language = {$in: languages};

        }

        const rawVideos = await database.Video.aggregate([{$match: query}, {$sample: {size: limit}}]);

        const feed = [];

        for (let video of rawVideos) {
            const feedItem = {
                image: 'https://img.3speakcontent.online/' + video.permlink + '/poster.png',
                title: video.title,
                mediaid: video.permlink,
                owner: video.owner
            }

            if (embeded === true) {
                feedItem.file = 'https://cdn.3speakcontent.online/' + video.permlink + '/default.m3u8'
            }

            feed.push(feedItem)
        }

        return feed;
    }
}