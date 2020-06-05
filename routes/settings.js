const database = require('../helper/database');

const router = require('express').Router();

router.get('/', async (req, res) => {
    let appConfiguration = await database.AppConfiguration.findOne();
    appConfiguration = appConfiguration.toObject();
    delete appConfiguration._id;
    delete appConfiguration['__v'];

    res.json({
        error: null,
        data: [appConfiguration]
    })
})

module.exports = router;