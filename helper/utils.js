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
        video = (new database.Video(video)).toObject()
        video.tags = processTags(video.tags.split(","))
        video.hive = video.hive.startsWith("hive-") ? video.hive : 'hive-181335'
        delete video._id;
        delete video['__v'];
        collection.push(video)
    }

    return collection;
}

module.exports = {
    getTrendingFeed: async (limit = 100, skip = 0, query = {}, languages = []) => {
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
    getNewFeed: async (limit = 100, skip = 0, query = {}, languages = []) => {

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
    getCuratedFeed: async (limit = 100, skip = 0, query = {}, languages = []) => {

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
    getPinnedFeed: async (limit = 100, skip = 0) => {

        const params = {
            status: "published",
            pinned: true
        }

        const curatedVideos = await database.Video.find(params).sort('-created').skip(skip).limit(limit)

        return filterFeed(curatedVideos)
    }
}