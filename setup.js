const {database} = require('./helper');

const appConfiguration = new database.AppConfiguration({
    version: require('./package.json').version
})

appConfiguration.save(() => {
    console.log("Created APP Configuration.")
    process.exit(0)
})