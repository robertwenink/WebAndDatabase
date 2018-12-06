function GameState(){
	this.tiles = [];
	this.this.w_checker = [];
	this.this.b_checker = [];
	this.this.possiblemoves=[];
	this.this.current_checker;
	this.this.leftUp=false, this.leftDown=false, this.rightUp=false, this.rightDown=false;
	this.this.turn="white";
	this.this.whiteLeft=12 ,this.blackLeft=12 ;
	this.this.mustAttack=false; //if a piece has to attack, makeMOve must have different behaviour
	this.this.attackPossible=false;
	this.this.possibleAttacks=[];

	this.playtile = function(tile){
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
		for(let i=0;i<this.possiblemoves.length;i++){
			if(this.possiblemoves[i][0]==this.tiles[tilehtmlid]){
				move(this.current_checker.htmlid,this.tiles[tilehtmlid]);
				if(this.possiblemoves[i][1]!=undefined){
					updateScore(this.possiblemoves[i][1].pieceId,this.turn);
					var currenttile=this.possiblemoves[i][0];
					this.possiblemoves=[];
					this.mustAttack=true;
					showMoves(currenttile.pieceId);
					if(this.possiblemoves.length==0){
						switchthis.turns();
						this.mustAttack=false;
					}
				}
				else{
					switchthis.turns();
					this.possiblemoves=[];
				}
			}
		}
		if(this.tiles[tilehtmlid].pieceId!=undefined){
				showMoves(this.tiles[tilehtmlid].pieceId);
		}
	}

	this.checker = function(piece,color,tile) {
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
				this.w_checker[j]= new checker(document.getElementById(id),idcolor,i);
				this.tiles[i].pieceId=this.w_checker[j].htmlid;
			}
			else{
				this.b_checker[j]= new checker(document.getElementById(id),idcolor,i);
				this.tiles[i].pieceId=this.b_checker[j].htmlid;
			}
			this.tiles[i].occupied=true;
			
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
		
		this.tiles[deletechecker.tileId].occupied=false;
		this.tiles[deletechecker.tileId].pieceId=undefined;
		
		deletechecker.alive=false;
		deletechecker.tileId=undefined;
		
		if(deletechecker.color=="white"){
			this.whiteLeft-=1;
		}
		else{
			this.blackLeft-=1;
		}
		
		if(this.blackLeft==0||this.whiteLeft==0){
			endGame();
		}
		
	}

	function checkBlackOrWhite(idpiece){
		if (idpiece.indexOf("white") >= 0) { return this.w_checker }
		else { return this.b_checker}
	}

	function showMoves (piecehtmlid) {
		this.leftUp=false, this.leftDown=false, this.rightUp=false, this.rightDown=false;
		if(this.mustAttack===false){//then selecting a new checker is forbidden
			if(this.attackPossible===false){
				this.current_checker=checkBlackOrWhite(piecehtmlid)[piecehtmlid.match(/\d+/)[0]];
			}
			else if(this.possibleAttacks.includes(piecehtmlid)){
				this.current_checker=checkBlackOrWhite(piecehtmlid)[piecehtmlid.match(/\d+/)[0]];
			}
		}
		
		if(this.current_checker.color==this.turn){	
			var currenttile=this.tiles[this.current_checker.tileId];
			
			if(this.current_checker.king){
				//dan mag hij alle kanten op bewegen
				this.leftUp=true;this.leftDown=true;this.rightUp=true;this.rightDown=true;
			}
			if(this.current_checker.color=="white"){
				this.leftUp=true;
				this.rightUp=true;
			}	
			else{
				this.leftDown=true;
				this.rightDown=true;
			}
			tileid=parseInt(currenttile.htmlid);
			
			var steps=defineStep(tileid);
			
			this.possiblemoves=[];
			for(let i=0;i<=3;i++){
				checkStep(tileid,steps[i],this.current_checker,i);
			}
			
			onlyAttackPossibleMoves();
			
			//controle
			console.log("currenttile"+currenttile.htmlid);
			for(let i=0;i<this.possiblemoves.length;i++){
				console.log("Tile beschikbaar: "+this.possiblemoves[i][0].htmlid)
			}
			
			
			selectPiecesCss(currenttile,this.possiblemoves);
		}
	}

	function onlyAttackPossibleMoves(){
		var newmoves=[];
		
		for(let i=0;i<this.possiblemoves.length;i++){
			if(this.possiblemoves[i][1]!=undefined){
				console.log("there is an attack move!");
				newmoves.push([this.possiblemoves[i][0],this.possiblemoves[i][1]]);
			}
		}
		if(newmoves.length!=0||this.mustAttack===true){
			this.possiblemoves=[];
			this.possiblemoves=newmoves;
		}
	}

	function checkStep(tileid,step,this.current_checker,directionindex){
		id=tileid+step;
		var targettile=this.tiles[id];
		
		if(targettile.occupied){
			var occupyingpiece=checkBlackOrWhite(targettile.pieceId)[targettile.pieceId.match(/\d+/)[0]];
			
			if(this.current_checker.color!=occupyingpiece.color){//attack might be possible.
				var steps=defineStep(id);
				if(steps[directionindex]!=0){
					var othertile=this.tiles[id+steps[directionindex]];
					if(othertile.occupied===false){
						this.possiblemoves.push([othertile,targettile]);
					}
				}
			}
		}
		else{
			this.possiblemoves.push([targettile,undefined]);//possible step, attack possible on tile ...
		}
	}

	function defineStep (tileid){
		if([5,13,21,29].includes(tileid)){
			this.leftUp=false;
			this.leftDown=false;
		}
		if([4,12,20,28].includes(tileid)){
			this.rightUp=false;
			this.rightDown=false;
		}
		if([1,2,3,4].includes(tileid)){
			this.leftUp=false;
			this.rightUp=false;
		}
		if([29,30,31,32].includes(tileid)){
			this.leftDown=false;
			this.rightDown=false;
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
		if(this.leftUp===true){directionArray[0]=lu;}
		if(this.leftDown===true){directionArray[1]=ld;}
		if(this.rightUp===true){directionArray[2]=ru;}
		if(this.rightDown===true){directionArray[3]=rd;}
		
		return directionArray;
	}

	function move(piecehtmlid,totile) {
		if(totile.occupied===false){
			move_checker=checkBlackOrWhite(piecehtmlid)[piecehtmlid.match(/\d+/)[0]];
			
			console.log(piecehtmlid+" from tile with id: "+move_checker.tileId+", to -> "+ totile.htmlid);
			document.getElementById(totile.htmlid).appendChild(document.getElementById(move_checker.htmlid));
			
					
			//update origin and destination tile 

			this.tiles[move_checker.tileId].occupied=false;
			this.tiles[move_checker.tileId].pieceId=undefined;
			
			totile.occupied=true;
			totile.pieceId=piecehtmlid;
			
			move_checker.tileId=totile.htmlid;
			move_checker.checkIfKing();
		}
		
	}

	function switchthis.turns(){
		if(this.turn=="white"){
			this.turn="black";
		}
		else if(this.turn=="black"){
			this.turn="white";
		}
		removeActiveCss();
		this.possiblemoves=[];
		this.current_checker=undefined;
		var span=document.getElementById("this.turn");
		
		span.innerHTML="Turn: "+ this.turn;
		console.log("current color: "+this.turn +"span: "+span);
		span.style.color=""+this.turn;
	}

	function selectPiecesCss(currenttile,this.possiblemoves){
		removeActiveCss();
		
		document.getElementById(currenttile.htmlid).className += " active";
		for(let i=0;i<this.possiblemoves.length;i++){
			document.getElementById(this.possiblemoves[i][0].htmlid).className += " active";
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
		
		if(this.whiteLeft == 0){
			statusbar.innerHTML = "Black wins";
		}
		else{
			statusbar.innerHTML = "White wins";
		}
	}

	function playSound(sound){
		if(sound) sound.play();
	}

	placeInitPieces(0,0);
	placeInitPieces(1,1);
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
		document.getElementById('this.tiles').innerHTML = text;
		for (let i = 1; i <=32; i++){
			this.tiles[i] =new playtile(document.getElementById(i));//square_class bevat de divs objecten met class square, de id gebruiken volstaat dus
		}
		console.log(this.tiles)
	}

	
(function setup(){
	
	buildBoard();
	var gs = new GameState();
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