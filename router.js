const express = require('express');

// Route Controllers
const controllers = {
    numbers: require('./numbers')
}


// Route Groups
const routes = {
    numbers: express.Router(),
    api: express.Router()
}

module.exports = function(app) {

    // get decimal numbers from clients & convert them
    routes.api.use('/convert', routes.numbers);
    routes.numbers
        .post('/decTohex', controllers.numbers.post)
        .get('/decTohex', controllers.numbers.fetch)

    // set url for API group routes
    app.use('/', routes.api);
}