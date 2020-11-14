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

app.use(bodyParser.json());
// Express modules / packages

app.use(bodyParser.urlencoded({ extended: true }));
// Express modules / packages

app.use(express.static("public"));
// load the files that are in the public directory

app.get("/:favicon.ico", (req, res) => {
    res.redirect("https://repl.it/favicon.ico");
});

app.get("/token/:longUrl", (req, res) => {
    let longUrl = req.params.longUrl;
    let token = createToken();
    let sUrl = req.protocol + "://" + req.hostname + "/" + token;
    console.log(longUrl);
    db.set(token, longUrl);
    res.json({ shortenUrl: sUrl });
});

app.get("/:token", (req, res) => {
    let token = req.params.token;
    console.log("token parsed: " + token);
    console.log(req.protocol + "://" + req.hostname + "/" + token);
    db.get(token).then((longer) => {
        console.log(longer);
        if (longer == null) {
            res.redirect("error.html");
        } else {
            let dUrl = decodeURIComponent(longer);
            dUrl = Buffer.from(dUrl, "base64");
            dUrl = dUrl.toString("utf8");
            res.redirect(dUrl);
        }
    });
});
app.listen(3000, () => console.log("server started"));

function createToken() {
    let charMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let token = "";
    for (let i = 0; i < 6; i++) {
        token += charMap[Math.floor(Math.random() * 62)];
    }
    return token;
}