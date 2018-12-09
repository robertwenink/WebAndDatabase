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
router.get("/splash", function (req, res) {
    res.sendFile("splash.html", {root: "./public"});
});

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function(req, res) {
    res.sendFile("game.html", {root: "./public"});
});

// router.set("view engine", "ejs");
// router.use(express.static(__dirname + "/public"));

// /* Pressing the 'PLAY AGAIN?' button, return this page */
// router.get("/playagain", function(req, res) {
//     res.render("splash.ejs", { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted, blackWins: gameStatus.blackWins, whiteWins: gameStatus.whiteWins});
// });

module.exports = router;
