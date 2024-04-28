// server gets builded and exposed
const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the "client" directory
app.use(express.static(path.join(__dirname, 'client-side')));

// Handle GET request to "/name"
const getName = require('./getName.js');  // Import your server-side function
app.get('/name', (req, res) => {
    //Is this a random request or from/like the client file? 
    //(This method is only usable for low security information, easy to bypass and read!)
    if (req.headers['x-auth-token']==='valid') { //is the hardcoded token!
      getName(req.headers['number'], function(str) { //get from/into cache
        res.send(str); //provide to client
      });
    }  
    else { //a request missing the token!
        //html access error on a fitting page 
        //(btw 418 is the BEST html error!!!)
        return res.status(403).sendFile(path.join(__dirname, './403.html'));
    }
  });

//expose to the local computer via node.js default loopback adress
const port = 3000;
app.listen(port, "127.0.0.1", () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});