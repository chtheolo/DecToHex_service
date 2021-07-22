const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const router = require('./router');
const config = require('./config/main');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var server = app.listen(config.development.port);
console.log(`Your server is running on port ${config.development.port}`);

router(app);

module.exports = server;