const express = require('express');
const app = express();
const getName = require('./getName.js');  // Import your server-side cached function
const db = require('./db.js');  // Import DB parameters
const pool = db(); //Open pool of connections
const path = require('path');

app.use(express.static(path.join(__dirname, 'client-side'))); //send to client

app.get('/name', (req, res) => { //GET request to "<path>/name"
  if (req.headers['x-auth-token'] === 'valid') { //This is from/like our client file, low security check!!!

    let num = parseInt(req.headers['number'], 10); 
    if (isNaN(num) || !Number.isInteger(num)) { //Catch SQL Injections
      res.send('Invalid input: number is not an integer');
      return; //early exit
    }

    pool.getConnection((err, connection) => { //Try to get a connection from pool
      if (err) { //Cannot get SQL connection
        getName(req.headers['number'], null, function(str) { //insert null
          res.send(str);
        });
        return; //early exit
      }
      
      // pass the pool connection to your server-side function
      getName(req.headers['number'], connection, function(str) {
        res.send(str); //pass up res
        connection.release(); // When done with the connection, release it back to the pool
      });
    });
  } else { //Got a wrong token in the header
    return res.status(403).sendFile(path.join(__dirname, './403.html')); //Provide 403 page
  }
});

const port = 3000;
app.listen(port, "127.0.0.1", () => {
  console.log(`Server is running at http://127.0.0.1:${port}`); //local loopback address
});