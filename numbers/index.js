const express = require('express');
const convert = require('../convertions/decTohex');

/** ------- POST -------- */
exports.post = function(req, res) {
    let hex_number = convert.Dec2Hex(req.body.decimal);

    return res.status(200).send(hex_number);
}