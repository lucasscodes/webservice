module.exports = function () {
    const mysql = require('mysql');
    // Create a connection pool with a max of 100 connections, a min of 2, and a 30 second max idle time
    //This allows 100 clients to use the DB or it falls back to expensive refetches
    return mysql.createPool({
        connectionLimit: 100, //IMPORTANT FOR SCALING: HARDCODED!!!
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'test123',
        database: 'cache'
      });
};