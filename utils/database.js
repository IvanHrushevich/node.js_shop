const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete', // schema name
    password: '*****',
});

module.exports = pool.promise();
