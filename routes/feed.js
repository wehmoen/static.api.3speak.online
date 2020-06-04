const utils = require('../helper/utils');

const router = require('express').Router();

router.get('/new', async (req, res) => {
    let newVideos = await utils.getNewFeed();

    res.json({
        error: null,
        data: newVideos
    })
})

router.get('/trending', async (req, res) => {
    const trendingVideos = await utils.getTrendingFeed();

    res.json({
        error: null,
        data: trendingVideos
    })
})

router.get('/curated', async (req, res) => {
    const curatedVideos = await utils.getCuratedFeed();

    res.json({
        error: null,
        data: curatedVideos
    })
})

router.get('/pinned', async (req, res) => {
    const pinnedVideos = await utils.getPinnedFeed();

    res.json({
        error: null,
        data: pinnedVideos
    })
})


module.exports = router;