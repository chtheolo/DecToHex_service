const express = require('express');
const convert = require('../conversions/decTohex');
const logs = require('../writeLogs');
const db = require('../db/queries');


/** ------- POST -------- */
exports.post = async function(req, res) {
    await convert.Dec2Hex(req.body.decimal)
    .then(result => {
        logs.write(result);
        // call insert query
        db.insert(result)
        .then(db_result => {
            logs.write(db_result);
            console.log(db_result);
        })
        .catch(error => {
            console.log(error);
            logs.write(error);
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

/** ------- FETCH -------- */
exports.fetch = async function(req, res) {
    let query = 'SELECT '; 
    if (req.query.value && req.query.order && req.query.dateline) {
        query += req.query.value +  ' FROM conversions WHERE dateline='+ req.query.dateline +' ORDER BY ' + req.query.value + ' ' + req.query.order;
    }
    else if (req.query.value && req.query.order) {
        query += req.query.value +  ' FROM conversions ORDER BY ' + req.query.value + ' ' + req.query.order;
    }
    else if (req.query.aggregation && req.query.value && req.query.dateline) {
        query += req.query.aggregation + '(' + req.query.value + ') FROM conversions WHERE dateline=' +req.query.dateline;
    }
    else if (req.query.aggregation && req.query.value) {
        query += req.query.aggregation + '(' + req.query.value + ') FROM conversions';
    }
    else {
        query += '* FROM conversions';
    }
    db.select(query)
    .then(data => {
        return res.status(200).send(data);
    })
    .catch(error => {
        return res.status(401).send(error);
    })
}