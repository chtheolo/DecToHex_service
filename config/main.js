//Configuration file
// const dotenv = require('dotenv').config({path: '/home/chtheolo/DecToHex_service/.env'});
const dotenv = require('dotenv').config();
if (dotenv.error) {
    console.log(dotenv.error);
}

module.exports = {
    development: {
        db_host: process.env.POSTGRES_HOST,
        db_port: process.env.POSTGRES_PORT,
        db_user: process.env.POSTGRES_USER,
        db_password: process.env.POSTGRES_PASSWORD,
        db_name: process.env.POSTGRES_DB,
        port: 3000
    }
}
