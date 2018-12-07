function GameState(socket){
	this.playerType = null;
	this.blackWin=null;
	this.whiteWin=null;
	this.getPlayerType = function () {
        return this.playerType;
    };

    this.setPlayerType = function (p) {
        console.assert(typeof p == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof p);
        this.playerType = p;
    };
	var tiles = [];
	var w_checker = [];
	var b_checker = [];
	var possiblemoves=[];
	var current_checker;
	var leftUp=false, leftDown=false, rightUp=false, rightDown=false;
	var turn="WHITE";
	var whiteLeft=12 ,blackLeft=12 ;
	var mustAttack=false; //if a piece has to attack, makeMove must have different behaviour
	var attackPossible=false;

	// this.disableTiles = function() {
	// 														//disable board for player [playerType]						(!)(!)(!) LAST TO FIX
	// }
	// this.enableTiles = function() {
	// 														//enable board for player [playerType]						(!)(!)(!) LAST TO FIX
	// }

	var playtile = function(tile){
		this.id = tile;
		this.htmlid=tile.id;
		this.occupied = false;//is the tile occupied?
		this.pieceId = undefined;//which piece is on it?
		this.id.onclick = function  () {
			makeMove(tile.id);	
		}
	}

	function makeMove(tilehtmlid) {
		console.log(tilehtmlid);
		for(let i=0;i<possiblemoves.length;i++){
			if(possiblemoves[i][0]==tiles[tilehtmlid]){
				move(current_checker.htmlid,tiles[tilehtmlid]);
				if(possiblemoves[i][1]!=undefined){
					updateScore(possiblemoves[i][1].pieceId,turn);
					var currenttile=possiblemoves[i][0];
					possiblemoves=[];
					mustAttack=true;
					showMoves(currenttile.pieceId);
					if(possiblemoves.length==0){
						switchturns();
						mustAttack=false;
					}
				}
				else{
					switchturns();
					possiblemoves=[];
				}
			}
		}
		if(tiles[tilehtmlid].pieceId!=undefined){
				showMoves(tiles[tilehtmlid].pieceId);
		}
	}

	function buildBoard(){
		var i =0;
		text="";
		for (var j = 0; j < 8; j++) { 
			if(j%2==0){
				text += '</div><div class="whitetile">';
			}
			i++;
			text += '</div><div id='+ i +' class="darktile">';
			
			for (var k=0; k<3; k++){
				i++;
				text += '</div><div class="whitetile"></div><div id='+ i +' class="darktile">';
			}
			
			if(j%2==1){
				text += '</div><div class="whitetile">';
			}
			
			
		}
		document.getElementById('tiles').innerHTML = text;
		for (let i = 1; i <=32; i++){
			tiles[i] =new playtile(document.getElementById(i));//square_class bevat de divs objecten met class square, de id gebruiken volstaat dus
		}
		console.log(tiles)
	}

	var checker = function(piece,color,tile) {
		this.id = piece;
		this.htmlid=piece.id;
		this.color = color;
		this.king = false;
		this.tileId = tile;
		this.alive = true;
		this.attack = false;
	}

	checker.prototype.checkIfKing = function () {
		x=this.tileId.match(/\d+/)[0];
		console.log("x:"+x);
		if(x >= 29 && x <= 32 && !this.king &&this.color == "black"){
			this.king = true;
			this.id.style.border = "6px solid grey";
			this.id.style.borderRadius = "50%";
		}
		if(x >= 1 && x <= 4 && !this.king &&this.color == "white"){
			this.king = true;
			this.id.style.border = "6px solid yellow";
			this.id.style.borderRadius = "50%";
		}
	}

	function placeInitPieces(BW,PlayerOrOpponent){
		//BW =0 for player starts with white, 1 for black
		//0 for player, 1 for opponent, 
		var istart;
		var iend;
		var j=1;
		if(PlayerOrOpponent==0){
			istart=32-12+1;
			iend=32;
		}
		else{
			istart=1;
			iend=12;
		}
		
		if(BW==0){
			classname="whitePiece";
			idcolor="white";
		}
		else{
			classname="blackPiece";
			idcolor="black";
		}
		
		for ( let i=istart;i<= iend;i++){
			let b = document.createElement("div");
			b.className = classname;
			let id=idcolor + j;
			b.setAttribute("id",id);
			document.getElementById(i).appendChild(b);
			
			if(idcolor=="white"){
				w_checker[j]= new checker(document.getElementById(id),idcolor,i);
				tiles[i].pieceId=w_checker[j].htmlid;
			}
			else{
				b_checker[j]= new checker(document.getElementById(id),idcolor,i);
				tiles[i].pieceId=b_checker[j].htmlid;
			}
			tiles[i].occupied=true;
			
			j++;
		}
	}

	function updateScore(idpiece,PlayerOrOpponent){
		//BW 0 for white should be added
		//PlayerOrOpponent 0 for score should be added to players stack
		let scoreTile = document.createElement("div");
		scoreTile.className = "scoreTile";
		scoretileid="score"+idpiece;
		
		//if(PlayerOrOpponent==0){
		if(PlayerOrOpponent.indexOf("white")>=0){
			id="scoreOpponent";
		}
		else{
			id="scorePlayer";
		}
			
		
		scoreTile.setAttribute("id", scoretileid);
		document.getElementById(id).appendChild(scoreTile);	
		document.getElementById(scoretileid).appendChild(document.getElementById(idpiece));
		
		//update javascript
		var deletechecker=checkBlackOrWhite(idpiece)[idpiece.match(/\d+/)[0]];
		console.log("Score wordt geupdate met:"+deletechecker.tileId);
		
		tiles[deletechecker.tileId].occupied=false;
		tiles[deletechecker.tileId].pieceId=undefined;
		
		deletechecker.alive=false;
		deletechecker.tileId=undefined;
		
		if(deletechecker.color=="white"){
			whiteLeft-=1;
		}
		else{
			blackLeft-=1;
		}
		
		if(blackLeft==0||whiteLeft==0){
			endGame();
		}
		
	}

	function checkBlackOrWhite(idpiece){
		if (idpiece.indexOf("white") >= 0) { return w_checker }
		else { return b_checker}
	}

	function showMoves (piecehtmlid) {
		leftUp=false, leftDown=false, rightUp=false, rightDown=false;
		if(mustAttack===false){//then selecting a new checker is forbidden
			current_checker=checkBlackOrWhite(piecehtmlid)[piecehtmlid.match(/\d+/)[0]];
		}
		
		if(current_checker.color==turn){	
			var currenttile=tiles[current_checker.tileId];
			
			if(current_checker.king){
				//dan mag hij alle kanten op bewegen
				leftUp=true;leftDown=true;rightUp=true;rightDown=true;
			}
			if(current_checker.color=="white"){
				leftUp=true;
				rightUp=true;
			}	
			else{
				leftDown=true;
				rightDown=true;
			}
			tileid=parseInt(currenttile.htmlid);
			
			var steps=defineStep(tileid);
			
			possiblemoves=[];
			for(let i=0;i<=3;i++){
				checkStep(tileid,steps[i],current_checker,i);
			}
			
			onlyAttackPossibleMoves();
			
			//controle
			console.log("currenttile"+currenttile.htmlid);
			for(let i=0;i<possiblemoves.length;i++){
				console.log("Tile beschikbaar: "+possiblemoves[i][0].htmlid)
			}
			
			
			selectPiecesCss(currenttile,possiblemoves);
		}
	}

	function onlyAttackPossibleMoves(){
		var newmoves=[];
		
		for(let i=0;i<possiblemoves.length;i++){
			if(possiblemoves[i][1]!=undefined){
				console.log("there is an attack move!");
				newmoves.push([possiblemoves[i][0],possiblemoves[i][1]]);
			}
		}
		if(newmoves.length!=0||mustAttack===true){
			possiblemoves=[];
			possiblemoves=newmoves;
		}
	}

	function checkStep(tileid,step,current_checker,directionindex){
		id=tileid+step;
		var targettile=tiles[id];
		
		if(targettile.occupied){
			var occupyingpiece=checkBlackOrWhite(targettile.pieceId)[targettile.pieceId.match(/\d+/)[0]];
			
			if(current_checker.color!=occupyingpiece.color){//attack might be possible.
				var steps=defineStep(id);
				if(steps[directionindex]!=0){
					var othertile=tiles[id+steps[directionindex]];
					if(othertile.occupied===false){
						possiblemoves.push([othertile,targettile]);
					}
				}
			}
		}
		else{
			possiblemoves.push([targettile,undefined]);//possible step, attack possible on tile ...
		}
	}

	function defineStep (tileid){
		if([5,13,21,29].includes(tileid)){
			leftUp=false;
			leftDown=false;
		}
		if([4,12,20,28].includes(tileid)){
			rightUp=false;
			rightDown=false;
		}
		if([1,2,3,4].includes(tileid)){
			leftUp=false;
			rightUp=false;
		}
		if([29,30,31,32].includes(tileid)){
			leftDown=false;
			rightDown=false;
		}
		
		//alternating rules
		var rowtype=[(tileid-1)%8,(tileid-2)%8,(tileid-3)%8,(tileid-4)%8].includes(0);
		var lu,ld,ru,rd; // left up down, right up down; id stepsize
		if(rowtype===true){
			lu=-4;
			ld=4;
			ru=-3;
			rd=5;
		}
		else{
			lu=-5;
			ld=3;
			ru=-4;
			rd=4;
		}
		
		var directionArray=[0,0,0,0];
		if(leftUp===true){directionArray[0]=lu;}
		if(leftDown===true){directionArray[1]=ld;}
		if(rightUp===true){directionArray[2]=ru;}
		if(rightDown===true){directionArray[3]=rd;}
		
		return directionArray;
	}

	function move(piecehtmlid,totile) {
		if(totile.occupied===false){
			move_checker=checkBlackOrWhite(piecehtmlid)[piecehtmlid.match(/\d+/)[0]];
			
			console.log(piecehtmlid+" from tile with id: "+move_checker.tileId+", to -> "+ totile.htmlid);
			document.getElementById(totile.htmlid).appendChild(document.getElementById(move_checker.htmlid));
			
					
			//update origin and destination tile 

			tiles[move_checker.tileId].occupied=false;
			tiles[move_checker.tileId].pieceId=undefined;
			
			totile.occupied=true;
			totile.pieceId=piecehtmlid;
			
			move_checker.tileId=totile.htmlid;
			move_checker.checkIfKing();
			
			if (turn == gs.getPlayerType())
				let outgoingMsg = Messages.O_MADE_A_MOVE; 
				outgoingMsg.data = this.playertype;
				outgoingMsg.pieceid = piecehtmlid;
				outgoingMsg.to = totile;
				socket.send(JSON.stringify(outgoingMsg));
		}
		
	}

	function switchturns(){
		if(turn=="WHITE"){
			turn="BLACK";
		}
		else if(turn=="BLACK"){
			turn="WHITE";
		}
		// if (turn == gs.getPlayerType()) {
		// 	enableTiles();
		// }
		// else {
		// 	disableTiles();
		// }
		removeActiveCss();
		var possiblemoves=[];
		var current_checker=undefined;
		var span=document.getElementById("turn");
		
		span.innerHTML="Turn: "+ turn;
		console.log("current color: "+turn +"span: "+span);
		span.style.color=""+turn;
		
		// let outgoingMsg = Messages.O_MADE_A_MOVE;   //moved to function move(piecehtmlid,totile)
        // outgoingMsg.data = this.playertype;
        // socket.send(JSON.stringify(outgoingMsg));
	}

	function selectPiecesCss(currenttile,possiblemoves){
		removeActiveCss();
		
		document.getElementById(currenttile.htmlid).className += " active";
		for(let i=0;i<possiblemoves.length;i++){
			document.getElementById(possiblemoves[i][0].htmlid).className += " active";
		}
	}

	function removeActiveCss(){
		//remove previous active
		var current = document.getElementsByClassName("active");
		while(current.length>0){
			current = document.getElementsByClassName("active");
			for(let i=0;i<current.length;i++){
				current[i].className = current[i].className.replace(" active","");
			}
		}
	}

	function endGame(){
		playSound(winSound);
		document.getElementById('status').style.display = "block";
		var statusbar=document.getElementById('statusbar');
		statusbar.style.display = "block";
		
		if(whiteLeft == 0){
			statusbar.innerHTML = "Black wins";
			this.blackWin=true;
		}
		else{
			statusbar.innerHTML = "White wins";
			this.whiteWin=true;
		}
		//socket.close();
	}

	function playSound(sound){
		if(sound) sound.play();
	}

	buildBoard();
	placeInitPieces(0,0);
	placeInitPieces(1,1);
}


(function setup(){
	var socket = new WebSocket(Setup.WEB_SOCKET_URL);
	var gs = new GameState(socket);
	
	socket.onmessage = function (event) {

        let incomingMsg = JSON.parse(event.data);
 
        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) { 
            
            gs.setPlayerType( incomingMsg.data );//should be "WHITE" or "BLACK"

            //if player type is WHITE, do nothing
            if (gs.getPlayerType() == "WHITE") {
				//gs.disableTiles();													//MISSING FORMULA
            }
            else {   //PLAYER IS BLACK AND THE GAME HAS JUST STARTED
                //gs.disableTiles();												//MISSING FORMULA
            }
        }

        if (incomingMsg.type == Messages.T_MADE_A_MOVE && incomingMsg.data != gs.getPlayerType()){
			//Opponents move
			// 1: move the opponents piece
			// 2: switch turns
			
			let pieceIdHtml = incomingMsg.pieceid;
			let toTileNumber = incomingMsg.to;
			move(pieceIdHtml,toTileNumber);
			switchturns();
		}
    };

    socket.onopen = function(){
        socket.send("{}");
    };
    
    //server sends a close event only if the game was aborted from some side
    socket.onclose = function(){
        if(gs.blackWin==null||gs.whiteWin==null){
            console.log("aborted");
        }
    };

    socket.onerror = function(){  
    };
})();
//move("black6",this.tiles[19]);
//move("black9",this.tiles[18]);
//move("black5",this.tiles[9]);

//move("white12",this.tiles[12]);


//updateScore("black1",1);
//updateScore("black2",1);
//updateScore("black3",1);
//updateScore("black4",1);
//updateScore("black5",1);
//updateScore("black6",1);
//updateScore("black7",1);
//updateScore("black8",1);
//updateScore("black9",1);
//updateScore("black10",1);
//updateScore("black11",1);

//updateScore("white1",0);
//updateScore("white2",0);
//updateScore("white3",0);
//updateScore("white4",0);
//updateScore("white5",0);