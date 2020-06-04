const ENV = process.argv[2] || 'prod';

module.exports = {
    HTTP_PORT: ENV === 'prod' ? 1996 : 3000,
    MONGO_CONNECTION_URI: (ENV === 'prod' ? 'mongodb://172.31.43.106/' : 'mongodb://localhost/') + (ENV === 'prod' ? 'threespeak' : process.env.MONGO_DATABASE || 'threespeak_dev'),
    FEED_MAX_PER_AUTHOR: 2
}
