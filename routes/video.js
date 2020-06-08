const database = require('../helper/database');
const utils = require('../helper/utils');

const router = require('express').Router();

router.get('/:permlink', async (req, res) => {
    let video = await database.Video.findOne({permlink: req.params.permlink});

    if (video !== null) {
        video = utils.transformVideo(video)
    }

    res.json({
        error: null,
        data: [video]
    })
})

router.get('/:permlink/recommended', async (req, res) => {

    let video = await database.Video.findOne({permlink: req.params.permlink});
    if (video !== null) {
       return res.json({
            error: null,
            data: await utils.getRecommendedVideos(video.owner, [video.language])
        })
    }

    res.json({
        error: null,
        data: []
    })
});





module.exports = router;