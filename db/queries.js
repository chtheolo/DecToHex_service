const { Pool } = require('pg');
const logs = require('../writeLogs');
const config = require('../config/main');

const pool = new Pool({
    user: config.development.db_user,
    host: 'db',                             // container host from our docker-compose.yml
    database: config.development.db_name,
    password: config.development.db_password,
    post: config.development.db_port
});


/** This function is responsible to create a thread pool
 *  and save our data to our postgresql DB. */
exports.insert = async function (data) {
    return new Promise((resolve, reject) => {
        pool.connect((error, client, release) => {
            if (error) {
                reject(error);
            }
            else {
                let columns = ''
                let values = '';
                let i=1;
                let val_arr = [];
                let length = Object.keys(data).length;
                for (let key in data) {
                    if (i == length) {
                        columns = columns.concat(key);
                        values = values.concat(`$${i}`);
                    }
                    else {
                        columns  = columns.concat(key + ', ');
                        values = values.concat(`$${i}, `);
                    }
                    val_arr.push(data[key]);
                    i++;
                }

                client.query('INSERT INTO conversions(' + columns + ') VALUES (' + values + ')', val_arr, (error, results) => {
                    release();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve({
                            message: 'Insertion complete sucessfully!',
                            success: 1
                        });
                    }
                });
            }
        });
    });
}

exports.select = async function(query) {
    return new Promise((resolve, reject) => {
        pool.connect((error, client, release) => {
            if (error) {
                reject(error);
            }
            else {
                client.query(query , (error, results) => {
                    release();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            }
        });
    });

}