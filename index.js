const express = require("express");
/*
Imports the express library.
This is necessary to have an express server.
*/

const bodyParser = require("body-parser");
// Node.js body parsing middleware.

const app = express();
// Telling the app what modules / packages to use

const Database = require("@replit/database");
const db = new Database();
const sha1 = require("sha1");
const tokencache = [];
createToken();

app.use(bodyParser.json());
// Express modules / packages


app.use(bodyParser.urlencoded({ extended: true }));
// Express modules / packages


app.use(express.static("public"));
// load the files that are in the public directory


app.get("/favicon.ico", (req, res) => {
    res.redirect("https://brilliant.org/favicon.ico");
});


app.get("/tokenizer/:longUrl", (req, res) => {
   	/* This endpoint accepts a longUrl, creates a unique token corrosponding to the long url. Stores the mapping  between the two. Returns the token for constructinng the short url. */
    let longUrl = req.params.longUrl;
    let sig = sha1(longUrl);

    /*sig is used as a signature. More on sha1 here: https://brilliant.org/wiki/secure-hashing-algorithms/
  
  This is useful for things such as protecting passwords. It is also for encoding WITHOUT the two equal signs at the end
  */

    db.get(sig).then((tok) => {
        if (tok != null) {
            let sUrl = req.protocol + "://" + req.hostname + "/" + tok;
          
            console.log(sUrl + "token found");
          		//this console.log is used so that we know that a website someone wants to shorten is already in the server, so we can just get the token registered to that website
          
            res.json({ shortenUrl: sUrl });
          
        } else {
            let token = tokencache.pop();
            createToken();
          
            let sUrl = req.protocol + "://" + req.hostname + "/" + token;
            console.log("new token created");
          		//this console.log is used so that we know that a new website has been registered into the server and is registered as a new token
          
            db.set(token, longUrl).then(() => console.log(token));
            //the token is set to the longUrl so that it will be remembered when fetching the longUrl

            db.set(sig, token).then(() => {
                console.log(longUrl);
            });
            //the longUrl, or sig (since it won't register as just longUrl) is set to the token so that it will be remembered when fetching the token

            res.json({ shortenUrl: sUrl });
        }
    });
});


app.get("/:token", (req, res) => {
    /* This endpoint accepts a token from the short Url. This retrieves the long url and redirects the user to it */
    //let token = req.params.token;

    let token = req.params.token;
    console.log(req.protocol + "://" + req.hostname + "/" + token);
  		//this is used to console.log the website
  
    db.get(token).then((longer) => {
        console.log(longer);
      
        if (longer == null) {
            res.redirect("error.html");
        } else {
            let dUrl = decodeURIComponent(longer);
            dUrl = Buffer.from(dUrl, "base64");
            res.redirect(dUrl);
        }
      		//this if-else statement is used so that in the case that a website cannot be found or the code malfunctions, then it will direct to an error page
    });
});


app.listen(3000, () => console.log("server started " + new Date()));

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

function createToken() {
    let charMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < 6; i++) {
        token += charMap[Math.floor(Math.random() * 62)];
    }
    db.get(token).then((lUrl) => {
        if (lUrl != null) {
            createToken();
        } else {
            tokencache.push(token);
        }
    });
}
