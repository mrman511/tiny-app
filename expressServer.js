const express = require('express');
const req = require('express/lib/request');
const PORT = 8080;
const app = express();
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs')

//import helper functions
const { generateRandomString } = require('./helperFuncs')

const bodyParser = require("body-parser");
const bcryptjs = require('bcryptjs');
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'user_id',
  keys: ['magical key'],

  // Cookie Options
  maxAge: 50000, // 24 hours
}))






//
//DATA objects
//

const newID = generateRandomString(4);

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
  TxY76: { 
    id: 'TxY76',
    email: 'tool@tool.com',
    hashedPass: bcrypt.hashSync('tool', 10),
  }
};



//
//Relavent functions
//



const searchUsersByParam = (email, password) => {
  if (!password) {
    //console.log("HERE")
    for (let user in users) {
      if (email === users[user].email)
        return users[user].id;
    }
    return false;
  } else {
    if (users[searchUsersByParam(email)].password === password) {
      return true;
    }
    return false;
  }
};

const attemptLogin = (email, password) => {
  for (let user in users) {
    if (users[user].email === email && users[user].hashedPass === password) {
      return users[user].id;
    }
  }
  return false;
};

//
//for fun ignore
//

app.get('/Paul', (req, res) => {
  console.log(`request for '/Paul made on port ${PORT}'`);
  res.send('It is me...Paul...Your creator');
});



//cookie handler

//
//Main page
//

app.get('/', (req, res) => {
  console.log(`request for '/' being made on port now ${PORT}`);
  res.send('hello!');
});

//writes database to the screen as a JSON string
app.get("/urls", (req, res) => {
  const user = req.session.user_id//users[req.cookies['user_id']];
  console.log(user);
  //console.log(users);
  const templateVars = {
    user,
    urls: urlDatabase,
  };
  //console.log(templateVars.urls);
  res.render('urls_index', templateVars);
});


app.post("/urls", (req, res) => {
  
  let alphaKey = req.body.shortURL = gernerateRandomString(6);  // Log the POST request body to the console
  urlDatabase[alphaKey] = {
    longURL: req.body.longURL,
    userID: req.session.user_id.id //.cookies['user_id']
  };
  //console.log(urlDatabase);
  res.redirect(`/urls/${alphaKey}`); // Respond with a redirect to urls/:shortURL;
});

//
//Editing URLS
//

app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;//users[req.cookies['user_id']];
  const templateVars = {
    user,
    urls: urlDatabase,
  };
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let user = req.session.user_id//users[req.cookies['user_id']];
  //console.log();
  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.cookie()
  res.render('url_show', templateVars);
  //res.redirect(templateVars.longURL)
});

//Delete website form urlDatabase
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const user = req.session.user_id//.cookies['user_id'];
  const urlCreatorId = urlDatabase[shortURL].userID

  if (user === urlCreatorId){
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  }
  //res.cookie('unauthorized-alteration', true);
  res.redirect('/urls' )
});

//Edit Current URL from url_show.ejs
app.post('/urls/:shortURL/edit', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  const user = req.session.user_id//.cookies['user_id'];
  const urlCreatorId = urlDatabase[shortURL].userID

  if (user === urlCreatorId){
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
  //console.log(urlDatabase);
  //console.log(req)
  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }
  //console.log(longURL);
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
  for (let user in users) {
    if (users[user].email === email){
      if (bcrypt.compareSync(password, users[user].hashedPass)){
        
        req.session.user_id = users[user];
        res.redirect('/urls');
      }
    }
  }
  res.status(403).redirect('/login');
  
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
  //console.log(password);

  const hashedPass = bcrypt.hashSync(password, 10);

  if (email.length === 0 || password.length === 0) {
    res.statusCode = 400;
    return;
  } else if (searchUsersByParam(email)) {
    res.redirect('/login');
  }
  

  users[id] = {
    id,
    email,
    hashedPass,
  };
  req.session.user_id = users[id];
  //console.log(users);
  res.redirect('/urls');
});



app.get('*', (req, res) => {
  console.log(`request for invalid path made on ${PORT}`);
  res.send('ERROR: 404. Path not found');
});

app.listen(PORT, () => {
  console.log(`the server is listening or port ${PORT}`);
});
