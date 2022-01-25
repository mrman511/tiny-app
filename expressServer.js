const express = require('express');
const req = require('express/lib/request');
const PORT = 8080;
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

const gernerateRandomString = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  let randomItems = [];
  for (let i = 0; randomItems.length < 6; i++){
    let num = Math.floor(Math.random() * 2);
    if (num === 0){
      randomItems.push(String(Math.floor(Math.random() * 10)));
    } else {
      randomItems.push(alphabet[Math.floor(Math.random() * 26)]);
    }
  } 
  return(randomItems.join(''))
};

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

app.post("/urls", (req, res) => {
  
  let alphaKey = req.body.shortURL = gernerateRandomString();  // Log the POST request body to the console
  urlDatabase[alphaKey] = req.body.longURL;
  //console.log(urlDatabase);
  res.redirect(`/urls/${alphaKey}`);         // Respond with a redirect to urls/:shortURs;
});

//writes database to the screen as a JSON string
app.get("/urls", (req, res) => {

  const templateVars = {urls: urlDatabase}
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get(`/u/:shortURL`, (req, res) => {
  let longURL = (urlDatabase[req.params.shortURL]);
  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }
  console.log(longURL);
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => {
  //console.log(req);
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  //console.log(templateVars)
  res.render('url_show', templateVars);
  //res.redirect(templateVars.longURL)
});



//writes HTML to the screen
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get('*', (req, res) => {
//   console.log(`request for invalid path made on ${PORT}`);
//   res.send('ERROR: 404. Path not found');
// });

app.listen(PORT, () => {
  console.log(`the server is listening or port ${PORT}`);
});
