const utils = require('../helper/utils');

const router = require('express').Router();

router.get('/new', async (req, res) => {
    let newVideos = await utils.getNewFeed(utils.tryCastInt(req.query.skip));

    res.json({
        error: null,
        data: newVideos
    })
})

router.get('/trending', async (req, res) => {
    const trendingVideos = await utils.getTrendingFeed(utils.tryCastInt(req.query.skip));

    res.json({
        error: null,
        data: trendingVideos
    })
})

router.get('/curated', async (req, res) => {
    const curatedVideos = await utils.getCuratedFeed(utils.tryCastInt(req.query.skip));

    res.json({
        error: null,
        data: curatedVideos
    })
})

router.get('/pinned', async (req, res) => {
    const pinnedVideos = await utils.getPinnedFeed(utils.tryCastInt(req.query.skip));

    res.json({
        error: null,
        data: pinnedVideos
    })
})

router.get('/channel/:channel', async (req, res) => {
    const channelVideos = await utils.getChannelFeed(req.params.channel, utils.tryCastInt(req.query.skip));

    res.json({
        error: null,
        data: channelVideos
    })
})

module.exports = router;