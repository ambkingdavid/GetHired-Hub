const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('<h1> Welcome to the GetHired Hub</h1>');
});

app.listen('8080', () => {
  console.log('server running on port 8080');
});


module.exports = app;
