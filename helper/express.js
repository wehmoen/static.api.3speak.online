const express = require('express')
const app = express()
const cors = require('cors');

app.disable("powered-by");

app.use(cors());

module.exports = app;