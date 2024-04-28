//this function wraps another and caches it onto a db
//for this the server provides a connection/null from a set up pool
module.exports = function getName(n, con, callback) {
  function fetch(n) {
    return "Server+Client+DBCached: Langtons Ant";
  };

  if (con==null) { //There is no DB provided to connect to
    console.log("Used expensive, DB not available...");
    callback(fetch(n));
    return;
  };

  //there must be a valid DB connection now
  const sql = `SELECT Name
               FROM namen 
               WHERE Zahl = ?;`; //Attention: SQL Injections possible!!!
  con.query(sql, [n], function (err, result) {
    if (err) {
      console.log("Used expensive, DB query failed...");
      callback(fetch(n));
      return;
    }

    if (result && result[0] && result[0].Name) {
      callback(result[0].Name);
      console.log("Used cached result from DB!")
      return;
    }
    res = fetch(n); //Only because from internal functions => not checked for injections!!!
    callback(res);
    const sql = `INSERT INTO namen (Zahl, Name)
                  VALUES (?,'"${res}"');`;
    con.query(sql, [n], function (err,_) {
      if (err) {
        console.log("Cannot insert into the DB...");
      }
      else console.log("Cached result into the DB!");
    }); 
  });
};