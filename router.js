const express = require('express');

// Route Controllers
const controllers = {
}


// Route Groups
const routes = {
    api: express.Router()
}

module.exports = function(app) {

    // set url for API group routes
    app.use('/', routes.api);
}