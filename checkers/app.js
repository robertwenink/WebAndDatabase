var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var gameStatus = require("./statTracker");
var Game = require("./game");

var port = process.argv[2];
var app = express();

//app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port); 
/*app.get("/play", indexRouter);

app.get("/", (req, res) => {
  res.render("splash.ejs", { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted, gamesAborted: gameStatus.gamesAborted });
});

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {};
*/