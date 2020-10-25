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

app.use(bodyParser.json());
// Express modules / packages

app.use(bodyParser.urlencoded({ extended: true }));
// Express modules / packages

app.use(express.static('public'));
// load the files that are in the public directory

app.get('/:token/:longUrl', (req, res) => {
/* Please note that this will error as multiple headers are sent to the client */
  let token = req.params.token;
  let tokenOutput = "this is normal" + token
  let urlOutput = "this is normal" + token

res.json({"hello":tokenOutput,"ping": createToken()})

})

app.listen(3000, () => console.log('server started' + new Date()));

//--------------------------------------------------

function createToken() {
    let charMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";

    for (let i = 0; i < 6; i++) {
        token += charMap[Math.floor(Math.random() * 62)];
    }
    return token;
}