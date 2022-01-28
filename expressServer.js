const express = require('express');
const PORT = 8080;
const app = express();
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

//import helper functions
const {
  generateRandomString,
  checkEmailAndPassword
} = require('./helperFuncs');

const bodyParser = require("body-parser");
const bcryptjs = require('bcryptjs');
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'user_id',
  keys: ['magical key'],

  // Cookie Options
  maxAge: 50000, 
}));

//
//DATA objects
//


const urlDatabase = {
  //shortURL: {
  //  longURL,
  //  userID,
  //}
};

const users = {
  // id: {
  //  id: alpha Numeric id,
  //  email: user email,
  //  hashedPass: hashed password,
  //  }
};



//
//for fun ignore
//

app.get('/Paul', (req, res) => {
  console.log(`request for '/Paul made on port ${PORT}'`);
  res.send('It is me...Paul...Your creator');
});



//
//Main page
//

app.get('/', (req, res) => {
  console.log(`request for '/' being made on port now ${PORT}`);
  res.send('hello!');
});

//writes database to the screen as a JSON string
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    users,
    userID,
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});


app.post("/urls", (req, res) => {
  
  let alphaKey = req.body.shortURL = generateRandomString(6);  // Log the POST request body to the console
  urlDatabase[alphaKey] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${alphaKey}`);
});

//
//Editing URLS
//

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;//users[req.cookies['user_id']];
  const templateVars = {
    users,
    userID,
    urls: urlDatabase,
  };
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let userID = req.session.user_id;
  //console.log(userID, users[userID].id);
  const templateVars = {
    users,
    userID,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.render('url_show', templateVars);
  
});

//Delete website form urlDatabase
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const user = req.session.user_id;//.cookies['user_id'];
  const urlCreatorId = urlDatabase[shortURL].userID;

  if (user === urlCreatorId) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  }
  
  res.redirect('/urls');
});

//Edit Current URL from url_show.ejs
app.post('/urls/:shortURL/edit', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  const user = req.session.user_id;//.cookies['user_id'];
  const urlCreatorId = urlDatabase[shortURL].userID;

  if (user === urlCreatorId) {
    urlDatabase[shortURL] = {
      longURL,
      userID: user
    };
    res.redirect('/urls');
  }


  
});

//redirect to URL site
app.get(`/u/:shortURL`, (req, res) => {
  let longURL = (urlDatabase[req.params.shortURL].longURL);
  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }
  res.redirect(longURL);
});



//
//LogIn Status
//

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const result = checkEmailAndPassword(users, email, password);

  if (result.data) {
    req.session.user_id = result.data;
    res.redirect('/urls');
  }
  
  res.status(403);
  
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

//
//Registration
//
app.get('/register', (req, res) => {
  let user = req.session.user_id; //users[req.cookies['user_id']];
  let templateVars = {
    user,
  };
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  const id = generateRandomString(4);
  const email = req.body.email;
  const password = req.body.password;
  const hashedPass = bcrypt.hashSync(password, 10);

  //see if entered email is already in the database
  const checkData = checkEmailAndPassword(users, email);
  if (checkData.data === 'match') {
    res.status(400);
    res.render('login');
  }

  users[id] = {
    id,
    email,
    hashedPass,
  };
  
  req.session.user_id = id;
  res.redirect('/urls');
});



app.get('*', (req, res) => {
  console.log(`request for invalid path made on ${PORT}`);
  res.send('ERROR: 404. Path not found');
});

app.listen(PORT, () => {
  console.log(`the server is listening or port ${PORT}`);
});
