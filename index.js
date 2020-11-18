const express = require('express');
/*
Imports the express library.
This is necessary to have an express server.
*/
const bodyParser = require('body-parser');
// Node.js body parsing middleware.

const app = express();
// Telling the app what modules / packages to use
const Database = require("@replit/database")
const db = new Database()

const tokencache = [];
tokencache.push(createToken());

app.use(bodyParser.json());
// Express modules / packages

app.use(bodyParser.urlencoded({ extended: true }));
// Express modules / packages

app.use(express.static('public'));
// load the files that are in the public directory

app.get("/favicon.ico", (req, res) => {
res.redirect("https://www.youtube.com/favicon.ico");
});

app.get('/tokenizer/:longUrl', (req, res) => {
/* This endpoint accepts a longUrl, creates a unique token corrosponding to the long url. Stores the mapping  between the two. Returns the token for constructinng the short url. */
  let longUrl = req.params.longUrl;
  db.get(longUrl).then(tok => {if(tok != null){
    let sUrl = req.protocol + "://" + req.hostname + "/" + tok;
    res.json({"shortenUrl":sUrl})
  } else {
    let token = tokencache.pop();
    createToken();
      let sUrl = req.protocol + "://" + req.hostname + "/" + token;
      db.set(token,longUrl);
      res.json({"shortenUrl":sUrl})
  }})
})

app.get('/:token', (req, res) => {
/* This endpoint accepts a token from the short Url. This retrieves the long url and redirects the user to it */
  //let token = req.params.token;
  let token = req.params.token;
  console.log("hiiiii" + token);
  console.log(req.protocol + "://" + req.hostname + "/" + token);
  db.get(token).then(longer => {console.log(longer); if(longer == null){
    res.redirect("error.html");
  } else {let dUrl = decodeURIComponent(longer); dUrl = Buffer.from(dUrl, "base64"); dUrl  = dUrl.toString("utf8");res.redirect(dUrl)}});
});

app.listen(3000, () => console.log('server started ' + new Date()));


function createToken() {
    let charMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < 6; i++) {
        token += charMap[Math.floor(Math.random() * 62)];
    }
    db.get(token).then(lUrl => {if(lUrl != null){
      createToken();
    } else {
      tokencache.push(token);
    }})
};