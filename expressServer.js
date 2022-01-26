const express = require('express');
const req = require('express/lib/request');
const PORT = 8080;
const app = express();
const cookieParser = require('cookie-parser');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');


//
//Relavent functions
//

const gernerateRandomString = (num) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  let randomItems = [];
  for (let i = 0; randomItems.length < num; i++){
    let num = Math.floor(Math.random() * 2);
    if (num === 0){
      randomItems.push(String(Math.floor(Math.random() * 10)));
    } else {
      randomItems.push(alphabet[Math.floor(Math.random() * 26)]);
    }
  } 
  return(randomItems.join(''))
};


//
//DATA objects
//

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

//Main page
app.get('/', (req, res) => {
  console.log(`request for '/' being made on port now ${PORT}`);
  res.send('hello!');
});
//cookie handler


app.get('/Paul', (req, res) => {
  console.log(`request for '/Paul made on port ${PORT}'`)
  res.send('It is me...Paul...Your creator');
});

app.post("/urls", (req, res) => {
  
  let alphaKey = req.body.shortURL = gernerateRandomString(6);  // Log the POST request body to the console
  urlDatabase[alphaKey] = req.body.longURL;
  //console.log(urlDatabase);
  res.redirect(`/urls/${alphaKey}`); // Respond with a redirect to urls/:shortURL;
});

//writes database to the screen as a JSON string
app.get("/urls", (req, res) => {
  console.log(req.cookies);
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  }
  res.render('urls_index', templateVars);
});

//Delete website form urlDatabase
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});



//Edit Current URL from url_show.ejs
app.post('/urls/:shortURL/edit', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  console.log(req.body);
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls')
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", {username: req.cookies["username"]});
});

app.get(`/u/:shortURL`, (req, res) => {
  let longURL = (urlDatabase[req.params.shortURL]);
  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }
  //console.log(longURL);
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => {
  //console.log(req);
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"] 
  };
  console.log(templateVars.username);
  res.render('url_show', templateVars);
  //res.redirect(templateVars.longURL)
});

//
//LogIn Status
//

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username)
  //console.log(req.cookies);
  //console.log(req.signedCookies);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})

//
//Registration
//
app.get('/register', (req, res) => {
  res.render('register', {username: req.cookies["username"]});
});

app.post('/register', (req, res) => {
  const id = gernerateRandomString(4);
  const email = req.body.email;
  const password = req.body.password;

  users[id] ={
    id,
    email,
    password,
  }
  res.cookie('user_id', id);
  //console.log(users);
  res.redirect('/urls')
});



app.get('*', (req, res) => {
  console.log(`request for invalid path made on ${PORT}`);
  res.send('ERROR: 404. Path not found');
});

app.listen(PORT, () => {
  console.log(`the server is listening or port ${PORT}`);
});
