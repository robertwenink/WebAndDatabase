function buildBoard(){
	var i =0;
	text="";
	for (var j = 0; j < 8; j++) { 
		if(j%2==0){
			text += '</div><div class="whitetile">';
		}
		i++;
		text += '</div><div id=tile'+ i +' class="darktile">';
		
		for (var k=0; k<3; k++){
			i++;
			text += '</div><div class="whitetile"></div><div id=tile'+ i +' class="darktile">';
		}
		
		if(j%2==1){
			text += '</div><div class="whitetile">';
		}
		
		
	}
	document.getElementById('tiles').innerHTML = text;
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
		idname="white";
	}
	else{
		classname="blackPiece";
		idname="black";
	}
	
	for ( let i=istart;i<= iend;i++){
		let b = document.createElement("div");
		b.className = classname;
		b.setAttribute("id", idname + j);
		document.getElementById("tile"+i).appendChild(b);
		j++;
	}
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
		scoreTile.style.position="absolute";
		scoreTile.style.bottom="0";
	}

	scoreTile.setAttribute("id", scoretileid);
	document.getElementById(id).appendChild(scoreTile);
	
	document.getElementById(scoretileid).appendChild(document.getElementById(idpiece));
}

buildBoard();
placeInitPieces(0,0);
placeInitPieces(1,1);