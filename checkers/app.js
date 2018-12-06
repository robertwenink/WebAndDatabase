var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
//var messages = require("./public/javascripts/messages");

var gameStatus = require("./statTracker");
var Game = require("./game");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);