// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;



var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/splashscreen", function (req, res) {
    res.sendFile("splashscreen.html", {root: "./public"});
});

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function(req, res) {
    res.sendFile("game.html", {root: "./public"});
});

module.exports = router;
