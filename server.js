// server.js
const express = require('express');
const path = require('path');
const getName = require('./getName.js');  // Import your server-side function

const app = express();
const port = 3000;

// Serve static files from the "client" directory
app.use(express.static(path.join(__dirname, 'client-side')));


// Handle GET request to "/name"
app.get('/name', (_, res) => {
  const name = getName();  // Call your server-side function
  res.send(name);
});


app.listen(port, "127.0.0.1", () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});