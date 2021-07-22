const express = require('express');
const convert = require('../conversions/decTohex');

/** ------- POST -------- */
exports.post = async function(req, res) {
    await convert.Dec2Hex(req.body.decimal)
    .then(result => {
        return res.status(200).send({
            hexadecimal: result
        });
    })
    .catch(error => {
        return res.status(402).send(error);
    })
}