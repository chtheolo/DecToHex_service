const express = require('express');
const convert = require('../conversions/decTohex');
const logs = require('../writeLogs');
const db = require('../db/queries');


/** ------- POST -------- */
exports.post = async function(req, res) {
    await convert.Dec2Hex(req.body.decimal)
    .then(result => {
        logs.write(result);
        db.post(result)
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
        return res.status(200).send({
            data: result
        });
    })
    .catch(error => {
        logs.write(error);
        return res.status(402).send(error);
    })
}