const express = require('express');
const PORT = 8080;
const app = express();

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Main page
app.get('/', (req, res) => {
  console.log(`request for '/' being made on port ${PORT}`);
  res.send('hello!');
});

app.get('/Paul', (req, res) => {
  console.log(`request for '/Paul made on port ${PORT}'`)
  res.send('It is me...Paul...Your creator');
});

//writes database to the screen as a JSON string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//writes HTML to the screen
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('*', (req, res) => {
  console.log(`request for invalid path made on ${PORT}`);
  res.send('ERROR: 404. Path not found');
});

app.listen(PORT, () => {
  console.log(`the server is listening or port ${PORT}`);
});