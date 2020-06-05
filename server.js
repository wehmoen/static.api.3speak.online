const {config, express, router} = require('./helper')

express.get('/', (req, res) => res.json({
    status: "OK"
}))

express.use('/feed', router.feed);
express.use('/settings', router.settings);

express.listen(config.HTTP_PORT, () => console.log(`API is listening at http://0.0.0.0:${config.HTTP_PORT}`))