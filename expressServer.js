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
//DATA objects
//

const urlDatabase = {
  //"b2xVn2": "http://www.lighthouselabs.ca",
  //"9sm5xK": "http://www.google.com"
};

const users = {
  // id: {
  //  id: alpha Numeric id,
  //  email: user email,
  //  password: user password, 
  //  }
};



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

const searchUsersByParam = (email, password) => {
  if (!password) {
    //console.log("HERE")
    for (let user in users){
        if (email === users[user].email)
        return users[user].id
      }
    return false;
  } else {
    if (users[searchUsersByParam(email)].password === password) {
      return true;
    }
    return false;
  }
}

const attemptLogin = (email, password) => {
  for (let user in users) {
    if (users[user].email === email && users[user].password === password){
      return users[user].id
    }
  }
  return false;
}

//
//for fun ignore
//

app.get('/Paul', (req, res) => {
  console.log(`request for '/Paul made on port ${PORT}'`)
  res.send('It is me...Paul...Your creator');
});



//Main page
app.get('/', (req, res) => {
  console.log(`request for '/' being made on port now ${PORT}`);
  res.send('hello!');
});
//cookie handler



app.post("/urls", (req, res) => {
  
  let alphaKey = req.body.shortURL = gernerateRandomString(6);  // Log the POST request body to the console
  urlDatabase[alphaKey] = req.body.longURL;
  //console.log(urlDatabase);
  res.redirect(`/urls/${alphaKey}`); // Respond with a redirect to urls/:shortURL;
});

//writes database to the screen as a JSON string
app.get("/urls", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = {
    user,
    urls: urlDatabase,
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
  const user = users[req.cookies['user_id']];
  const templateVars = {
    user,
    urls: urlDatabase,
  }
  res.render("urls_new", templateVars);
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
  let user = users[req.cookies['user_id']]
  const templateVars = {
    user,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
  };
  console.log(templateVars.username);
  res.render('url_show', templateVars);
  //res.redirect(templateVars.longURL)
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
  //console.log(attemptLogin(email, password));

  if (searchUsersByParam(email, password)) {
    attemptLogin(email, password)? res.cookie('user_id', attemptLogin(email, password)) : res.redirect('/login') ;
  } else {
    res.statusCode = 403
  }

  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

//
//Registration
//
app.get('/register', (req, res) => {
  let user = users[req.cookies['user_id']];
  let templateVars = {
    user,
  }
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  const id = gernerateRandomString(4);
  const email = req.body.email;
  const password = req.body.password;
  console.log(password);
  if (email.length === 0 || password.length === 0 ) {
    res.statusCode = 400;
    return;
  } else if (searchUsersByParam(email)) {
     res.redirect('/login');
  }
  

  users[id] = {
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
