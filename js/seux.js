// Global constants:
var PLAYGROUND_WIDTH	= 500;
var PLAYGROUND_HEIGHT	= 500;
var REFRESH_RATE		= 25;

// Gloabl animation holder
var playerAnimation = new Array();


// Game state
var gameOver = false;

// Some hellper functions : 

// Function to restart the game:
function restartgame(){
	window.location.reload();
};

// Game objects:
function Player(node){

	this.node = node;
	//this.animations = animations;
	
	return true;
}

// --------------------------------------------------------------------------------------------------------------------
// --                                      the main declaration:                                                     --
// --------------------------------------------------------------------------------------------------------------------
$(function(){
	// Animations declaration: 
	
	// Player space shipannimations:
	playerAnimation["idle"]		= new $.gQ.Animation({imageURL: "images/hero.png"});
	
	// Initialize the game:
	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true});
				
	// Initialize the background
	$.playground().addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
							.addSprite("player",{animation: playerAnimation["idle"], posx: (PLAYGROUND_WIDTH/2)-20, posy: 455, width: 40, height: 40})
						.end()
					.end();
	
	$("#player")[0].player = new Player($("#player"));
		
	//initialize the start button
	$("#startbutton").click(function(){
		$("#console").html('click');
		$.playground().startGame(function(){
			$("#welcomeScreen").fadeTo(1000,0,function(){$(this).remove();});
			$("#console").html('Game Started');
		});
	})
	
	// this is the function that control most of the game logic 
	$.playground().registerCallback(function(){


			//Update the movement of the ship:
				if(jQuery.gameQuery.keyTracker[37] || jQuery.gameQuery.keyTracker[87]){ //this is left! (<- or w)
					var nextpos = $("#player").x()-5;
					if(nextpos > 0){
						$("#player").x(nextpos);
					}
				}
				if(jQuery.gameQuery.keyTracker[39] || jQuery.gameQuery.keyTracker[88]){ //this is right! (-> or x)
					var nextpos = $("#player").x()+5;
					if(nextpos < PLAYGROUND_WIDTH - 40){
						$("#player").x(nextpos);
					}
				}
	}, REFRESH_RATE);

});

