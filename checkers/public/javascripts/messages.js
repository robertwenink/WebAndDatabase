(function(exports){

    /* 
     * Client to server: game is complete, the winner is ... 
     */
    exports.T_SECOND_PLAYER_JOINED = "SECOND-PLAYER-JOINED";             
    exports.O_SECOND_PLAYER_JOINED = {
        type: exports.T_SECOND_PLAYER_JOINED,
        data: null
    };
    exports.S_SECOND_PLAYER_JOINED = JSON.stringify(exports.O_SECOND_PLAYER_JOINED);

    /*
     * Server to client: abort game (e.g. if second player exited the game) 
     */
    exports.O_GAME_ABORTED = {                          
        type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
     * Server to client: set as player White 
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_WHITE = {                            
        type: exports.T_PLAYER_TYPE,
        data: "WHITE"
    };
    exports.S_PLAYER_WHITE = JSON.stringify(exports.O_PLAYER_WHITE);

    /* 
     * Server to client: set as player Black
     */
    exports.O_PLAYER_BLACK = {                            
        type: exports.T_PLAYER_TYPE,
        data: "BLACK"
    };
    exports.S_PLAYER_BLACK = JSON.stringify(exports.O_PLAYER_BLACK);

    /* 
     * Server to player White or player Black: your turn
     */
    exports.T_YOUR_TURN = "YOUR-TURN";                              //DONT NEED THIS ANYMORE
    exports.O_YOUR_TURN = {                         
        type: exports.T_YOUR_TURN,
        data: null
    };
    //exports.S_YOUR_TURN does not exist, as we always need to fill the data property

    /* 
     * Player Black to server OR Player White to server: Made A Move
     */
    exports.T_CLICKED_A_TILE = "CLICKED_A_TILE";                          //JUST USE THIS ONE
    exports.O_CLICKED_A_TILE = {
        type: exports.T_CLICKED_A_TILE,
        data: null,
    };
    //exports.S_MADE_A_MOVE does not exist, as data needs to be set

    /* 
     * Server to Player A & B: game over with result won/loss 
     */
    exports.T_GAME_OVER = "GAME-OVER";              
    exports.O_GAME_OVER = {
        type: exports.T_GAME_OVER,
        data: null
    };


}(typeof exports === "undefined" ? this.Messages = {} : exports));
//if exports is undefined, we are on the client; else the server