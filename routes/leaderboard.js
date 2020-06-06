const database = require('../helper/database');

const router = require('express').Router();

router.get('/', async (req, res) => {
    let creators = await database.ContentCreator.find({banned: false, score: {$gt: 0}}).sort('-score').limit(100);

    let leaderboard = [];

    for (let creator of creators) {
        creator = (new database.ContentCreator(creator)).toObject();
        delete creator._id;
        delete creator['__v'];
        leaderboard.push(creator)
    }

    res.json({
        error: null,
        data: [leaderboard]
    })
})

module.exports = router;