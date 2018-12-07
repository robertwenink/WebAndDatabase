var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var gameStatus = require("./statTracker");
var Game = require("./game");

var port = process.argv[2];
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);

//TODO: move to routes/index
app.get("/", (req, res) => {
	res.render("splash.ejs", { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted });
});

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {};//property: websocket, value: game

/*
 * regularly clean up the websockets object
 */ 
setInterval(function() {
    for(let i in websockets){
        if(websockets.hasOwnProperty(i)){
            let gameObj = websockets[i];
            //if the gameObj has a final status, the game is complete/aborted
            if(gameObj.finalStatus!=null){
                console.log("\tDeleting element "+i);
                delete websockets[i];
            }
        }
    }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0;//each websocket receives a unique ID

wss.on("connection", function connection(ws) {

    /*
     * two-player game: every two players are added to the same game
     */
    let con = ws; 
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);

    /*
     * inform the client about its assigned player type
     */ 
    con.send((playerType == "WHITE") ? messages.S_PLAYER_WHITE : messages.S_PLAYER_BLACK);

    /*
     * client B receives the target word (if already available)
     */ 
    /*if(playerType == "BLACK" && currentGame.getWord()!=null){
        let msg = messages.O_TARGET_WORD;
        msg.data = currentGame.getWord();
        con.send(JSON.stringify(msg));
    }*/

    /*
     * once we have two players, there is no way back; 
     * a new game object is created;
     * if a player now leaves, the game is aborted (player is not preplaced)
     */ 
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    /*
     * message coming in from a player:
     *  1. determine the game object
     *  2. determine the opposing player OP
     *  3. send the message to OP 
     */ 
    con.on("message", function incoming(message) {    

        let oMsg = JSON.parse(message);
 
        let gameObj = websockets[con.id];
        let isPlayerA = (gameObj.playerA == con) ? true : false;          

        if (isPlayerA) {                                                   //isPlayerWhite 
            
            /*
             * player A can only make first move
             * if player B is already available, send message to B    W
             */
            if (oMsg.type == messages.T_MADE_A_MOVE && gameObj.gameStatus == "TURN WHITE") {  

                //if message is Made_A_Move and gameStatus 4 (player white's turn)
                //if player black has joined
                //relay message to player black and change gameStatus to 5

                if(gameObj.hasTwoConnectedPlayers()) {
                    var outgoingMsg = Messages.O_YOUR_TURN;
                    outgoingMsg.data = "BLACK";
                    gameObj.playerB.send(JSON.stringify(outgoingMsg)); 

                    //gameObj.playerB.send(message);
                    gameObj.setStatus("TURN BLACK");
                }
            }

            /*
             * any player can state can state who won/lost.
             */ 
            if( oMsg.type == messages.T_GAME_WON_BY){                       // If message is GAME_OVER whoever send it won.
                gameObj.setStatus("WHITE");                               // set Status to 6 (white won) or 7 (black won)
                //game was won by somebody, update statistics
                gameStatus.gamesCompleted++;
            }            

        }
        else {                                                              // Vice Versa
            /*
             * player B can make a guess; 
             * this guess is forwarded to A
             */ 
            if(oMsg.type == messages.T_MADE_A_MOVE && gameObj.gameStatus == "TURN BLACK") {                        
                //if message is Made_A_Move and gameStatus 5 (player black's turn)
                //relay message to player black and change gameStatus to 4

                var outgoingMsg = Messages.O_YOUR_TURN;                 //relay new 'your turn' message with color as data
                outgoingMsg.data = "WHITE";
                gameObj.playerA.send(JSON.stringify(outgoingMsg));
                
                //gameObj.playerA.send(message);
                gameObj.setStatus("TURN WHITE");
            }

            /*
             * any player can state can state who won/lost.
             */ 
            if( oMsg.type == messages.T_GAME_WON_BY){                       // If message is GAME_OVER whoever send it won.
                gameObj.setStatus("BLACK");                               // set Status to 6 (white won) or 7 (black won)
                //game was won by somebody, update statistics
                gameStatus.gamesCompleted++;
            }            
        }                                                                   // buildenv should incl a choice stop depending on game status 4 or 5.
    });

    con.on("close", function (code) { 
        
        /*
         * code 1001 means almost always closing initiated by the client;
         * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
         */
        console.log(con.id + " disconnected ...");

        if (code == "1001") {
            /*
            * if possible, abort the game; if not, the game is already completed
            */
            let gameObj = websockets[con.id];

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED"); 
                gameStatus.gamesAborted++;

                /*
                 * determine whose connection remains open;
                 * close it
                 */
                try {
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                }
                catch(e){
                    console.log("Player A closing: "+ e);
                }

                try {
                    gameObj.playerB.close(); 
                    gameObj.playerB = null;
                }
                catch(e){
                    console.log("Player B closing: " + e);
                }                
            }
            
        }
    });
});

server.listen(port);

