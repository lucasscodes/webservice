//getName(n) gets cached on DB here
module.exports = function getName(n, callback) {
  //The expensive fetch to cache
  function fetch(n) {
    return "Server+Client+DBCached: Langtons Ant";
  };

  //DB Parameters
  const db = require('./db.js');
  //Unpack function => parameters
  let con = db();
  //Connect to MySQL-Cache
  con.connect(function(err) {
    //If the cache is offline => fall back to expensive fetch
    if (err) {
      callback(fetch(n));
      console.log("Used expensive fetch because DB is offline!")
      return;
    };
    
    const sql = `SELECT Name
                 FROM namen 
                 WHERE Zahl = ?;`;    
    con.query(sql, [n], function (err, result) {
      //Is the query wrong?
      if (err) {
        console.log("crash1");
        throw err; 
      }

      //If we got this key cached, use retrieved answer
      if (result && result[0] && result[0].Name) {
        callback(result[0].Name);
        console.log("Used cached result from DB!")
      }
      else { //cache the response from expensive fetch
        res = fetch(n);
        //Query to insert PrimaryKey+Value pair
        const sql = `INSERT INTO namen (Zahl, Name)
                     VALUES (${n},'"${res}"');`; //btw unsafe, sql injections!
        //Try to upload or silently ignore failure
        con.query(sql, function (err,_) {
          if (err) {
            console.log("crash2");
            throw err;
          }
          console.log("Cached result into the DB!")
        }); 
        callback(res);
      }
      //Now each cache call opens a DB connection
      //The following is needed to not let connections open => DB shutdown => server crash
      con.end(function(err) {
        if (err) throw err;
      });
      //TODO: Only open connection if last one is dead, from server.js
      //Try to do this on the server, open connection and auto reopen there
      //Pass down connection and evaluate there for error => fallback to expensive
      //Or use db for insert/retrieve answere
    });
  });
};