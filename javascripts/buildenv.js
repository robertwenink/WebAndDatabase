
var tiles = [];
var w_checker = [];
var b_checker = [];
var possiblemoves=[];
var leftUp=false, leftDown=false, rightUp=false, rightDown=false;

var playtile = function(tile){
	this.id = tile;
	this.htmlid=tile.id;
	this.occupied = false;//is the tile occupied?
	this.pieceId = undefined;//which piece is on it?
	//this.id.onclick = function  () {
	//	move(this.pieceId,tiles[15]);	
	//}
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
	
	this.id.onclick = function  () {
		showMoves(piece.id);
		//move(piece.id,tiles[15])
	}
}

checker.prototype.checkIfKing = function () {
	x=this.tileId.match(/\d+/)[0];
	if(x >= 29 && x <= 32 && !this.king &&this.color == "white"){
		this.king = true;
		this.id.style.border = "4px solid #FFFF00";
	}
	if(x >= 1 && x <= 4 && !this.king &&this.color == "black"){
		this.king = true;
		this.id.style.border = "4px solid #FFFF00";
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
	console.log(w_checker)
}

function updateScore(idpiece,PlayerOrOpponent){
	//BW 0 for white should be added
	//PlayerOrOpponent 0 for score should be added to players stack
	let scoreTile = document.createElement("div");
	scoreTile.className = "scoreTile";
	scoretileid="score"+idpiece;
	
	if(PlayerOrOpponent==0){
		id="scoreOpponent";
	}
	else{
		id="scorePlayer";
	}
		
	
	scoreTile.setAttribute("id", scoretileid);
	document.getElementById(id).appendChild(scoreTile);	
	document.getElementById(scoretileid).appendChild(document.getElementById(idpiece));
	
	//update javascript
	current_checker=checkBlackOrWhite(idpiece)[idpiece.match(/\d+/)[0]];
	console.log(current_checker);
	
	tiles[current_checker.tileId].occupied=false;
	tiles[current_checker.tileId].pieceId=undefined;
	
	current_checker.alive=false;
	current_checker.tileId=undefined;
}

function checkBlackOrWhite(idpiece){
	if (idpiece.indexOf("white") >= 0) { return w_checker }
	else { return b_checker}
}

function showMoves (piecehtmlid) {
	leftUp=false, leftDown=false, rightUp=false, rightDown=false;

	current_checker=checkBlackOrWhite(piecehtmlid)[piecehtmlid.match(/\d+/)[0]];
	var currenttile=tiles[current_checker.tileId];
	
	if(current_checker.king){
		//dan mag hij alle kanten op bewegen
		leftUp=true;leftDown=true;rightUp=true;rigthDown=true;
	}
	if(current_checker.color=="white"){
		leftUp=true;
		rightUp=true;
	}	
	else{
		leftDown=true;
		rightDown=true;
	}
	//console.log("booleans"+leftUp + leftDown + rightUp + rightDown)
	tileid=parseInt(currenttile.htmlid);
	
	var steps=defineStep(tileid);
	//console.log(steps)
	possiblemoves=[];
	for(let i=0;i<=3;i++){
		checkStep(tileid,steps[i],current_checker);
	}
	
	for(let i=0;i<possiblemoves.length;i++){
		console.log("Tile beschikbaar: "+possiblemoves[i][0].htmlid)
	}
}

function checkStep(tileid,step,current_checker){
	id=tileid+step;
	var targettile=tiles[id];
	console.log(targettile);
	if(targettile.occupied){
		var occupyingpiece=checkBlackOrWhite(targettile.pieceId)[targettile.pieceId.match(/\d+/)[0]];
		
		if(current_checker.color!=occupyingpiece.color){//attack might be possible.
			possiblemoves.push([targettile,targettile]);
		}
	}
	else{
		possiblemoves.push([targettile,undefined]);//possible step, attack possible or not (0)
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
		leftDown=false;
		rightDown=false;
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

function selectMove(piecehtmlid) {
	
}

function move(piecehtmlid,totile) {
	
	if(totile.occupied===false){
		console.log(piecehtmlid)
		current_checker=checkBlackOrWhite(piecehtmlid)[piecehtmlid.match(/\d+/)[0]];
		
		console.log(piecehtmlid+"<- from, to -> "+ totile.htmlid);
		document.getElementById(totile.htmlid).appendChild(document.getElementById(current_checker.htmlid));
		
				
		//update origin and destination tile 
		console.log(current_checker.tileId)
		tiles[current_checker.tileId].occupied=false;
		tiles[current_checker.tileId].pieceId=undefined;
		
		totile.occupied=true;
		totile.pieceId=piecehtmlid;
		
		current_checker.tileId=totile;
	}
}



buildBoard();
placeInitPieces(0,0);
placeInitPieces(1,1);
//updateScore("white1",0);
//updateScore("white2",0);
//updateScore("white3",0);
//updateScore("white4",0);
//updateScore("white5",0);
//updateScore("black1",1);
//updateScore("black2",1);
//updateScore("black3",1);
//updateScore("black4",1);
//updateScore("black5",1);