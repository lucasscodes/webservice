module.exports = function () {
    const mysql = require('mysql');
    return mysql.createConnection({
        host: "localhost",
        port: "3306",
        user: "root",
        password: "",
        database: "cache"
    });
};