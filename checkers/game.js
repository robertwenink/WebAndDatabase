/* every game has two players, identified by their WebSocket */
var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
};

/*
 * The game can be in a number of different states.
 */
game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"] = 0;
game.prototype.transitionStates["1 JOINT"] = 1;
game.prototype.transitionStates["2 JOINT"] = 2;
game.prototype.transitionStates["TURN WHITE"] = 3;
game.prototype.transitionStates["TURN BLACK"] = 4;
game.prototype.transitionStates["WHITE WON"] = 5; //WHITE won
game.prototype.transitionStates["BLACK WON"] = 6; //BLACK won
game.prototype.transitionStates["ABORTED"] = 7;

/*
 * Not all game states can be transformed into each other;
 * the matrix contains the valid transitions.
 * They are checked each time a state change is attempted.
 */ 

 // START WITH WHITE PLAYER? NORMALLY IT WOULD BE BLACK???
game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0],   //0 JOINT
    [1, 0, 1, 0, 0, 0, 0, 0],   //1 JOINT
    [0, 0, 0, 1, 0, 0, 0, 1],   //2 JOINT (note: once we have two players, there is no way back!), otherwise: 0,1,0...
	[0, 0, 0, 0, 1, 1, 0, 1],   //TURN WHITE
	[0, 0, 0, 1, 0, 0, 1, 1],   //TURN BLACK
    [0, 0, 0, 0, 0, 0, 0, 0],   //WHITE WON
    [0, 0, 0, 0, 0, 0, 0, 0],   //BLACK WON
    [0, 0, 0, 0, 0, 0, 0, 0]    //ABORTED
];

game.prototype.isValidTransition = function (from, to) {
    
    console.assert(typeof from == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof from);
    console.assert(typeof to == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof to);
    console.assert( from in game.prototype.transitionStates == true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, from);
    console.assert( to in game.prototype.transitionStates == true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, to);


    let i, j;
    if (! (from in game.prototype.transitionStates)) {
        return false;
    }
    else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    }
    else {
        j = game.prototype.transitionStates[to];
    }

    return (game.prototype.transitionMatrix[i][j] > 0);
};

game.prototype.isValidState = function (s) {
    return (s in game.prototype.transitionStates);
};

// WE NEED TO SET THE STATUS ACCORDING TO W

game.prototype.setStatus = function (w) {

    console.assert(typeof w == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof w);

    if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    }
    else {
        return new Error("Impossible status change from %s to %s", this.gameState, w);
    }
};

game.prototype.hasTwoConnectedPlayers = function () {
	//If a game has started it has any of the following gameStates and a new game should be created if someone tries to connect to the server.
    return (this.gameState == "2 JOINT" || this.gameState == "TURN WHITE" || this.gameState == "TURN BLACK" || this.gameState == "WHITE" || this.gameState == "BLACK" || this.gameState == "ABORTED");
};

game.prototype.isTurnWhite = function () {
	//console.log("Two players!");                              //this doesnt mean it has two players, it just checks for it.
    return (this.gameState == "TURN WHITE");
};

game.prototype.isTurnBlack = function () {
	//console.log("Two players!");                              //this doesnt mean it has two players, it just checks for it.
    return (this.gameState == "TURN BLACK");
};

game.prototype.addPlayer = function (p) {
	console.log("Player added!");
    console.assert(p instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof p);

    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }

    /*
     * revise the game state
     */ 
    var error = this.setStatus("1 JOINT");
    if(error instanceof Error){
        this.setStatus("2 JOINT");
        this.setStatus("TURN WHITE");
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "WHITE";
    }
    else {
        this.playerB = p;
        return "BLACK";
    }
};

module.exports = game;