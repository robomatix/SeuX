// Global constants:
var PLAYGROUND_WIDTH	= 500;
var PLAYGROUND_HEIGHT	= 500;
var REFRESH_RATE		= 30;

// Global animation holder
var playerAnimation = new Array();
var enemies = new Array(1); // There are one (three soon... ) kind of enemies in the game


// Global movement
var playerMove = 9;
var enemies1SpeedX = 4;

// Game state
var gameOver = false;
var bomber_1 = bomber_2 = false;


// Some helper functions : 

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
function Enemy(node){
	this.speedx	= enemies1SpeedX;
	this.speedy	= 0;
	this.node = $(node);
	

	
	// updates the position of the enemy
	this.update = function(playerNode){
		this.updateX(playerNode);
		this.updateY(playerNode);
	};	
	this.updateX = function(playerNode){
		this.node.x(this.speedx, true);
	};
	this.updateY= function(playerNode){
		var newpos = parseInt(this.node.css("top"))+this.speedy;
		this.node.y(this.speedy, true);
	};
}
function Bomber(node){
	this.node = $(node);
}
Bomber.prototype = new Enemy();


	//  List of enemies animations :
	// 1st kind of enemy:
	enemies[0] = new Array(); // enemies have two animations
	enemies[0]["idle"]	= new $.gQ.Animation({imageURL: "images/ennemy-bomber-1.png"});

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


			//Update the movement of the player:
				if(jQuery.gameQuery.keyTracker[37] || jQuery.gameQuery.keyTracker[87]){ //this is left! (<- or w)
					var nextpos = $("#player").x()-playerMove;
					if(nextpos > 0){
						$("#player").x(nextpos);
					}
				}
				if(jQuery.gameQuery.keyTracker[39] || jQuery.gameQuery.keyTracker[88]){ //this is right! (-> or x)
					var nextpos = $("#player").x()+playerMove;
					if(nextpos < PLAYGROUND_WIDTH - 40){
						$("#player").x(nextpos);
					}
				}
			//Update the movement of the enemies
				$(".enemy").each(function(){
						this.enemy.update($("#player"));
						var posx = $(this).x();
						if(this.enemy instanceof Bomber){
							if(posx < -60 || posx > 560){
							if (this.id === "bomber_1") {
								bomber_1=false;
							 } 
							if (this.id === "bomber_2") {
								bomber_2=false;
							 }    
								$(this).remove();
								return;
							}
						}

					});
	}, REFRESH_RATE);
	
		//This function manage the creation of the bombers
	$.playground().registerCallback(function(){
		if(!gameOver){
			if(!bomber_1 && Math.random() > 0.75){
					bomber_1=true;
					var name = "bomber_1";
					// Appears on the right or on the left ?
					if(Math.random() > 0.5){//Right
							bomber_1_posx = 560;
							bomber_1_speedx = -enemies1SpeedX;						
						}else{//Left
							bomber_1_posx = -60;
							bomber_1_speedx = enemies1SpeedX;
					}
					$("#actors").addSprite(name, {animation: enemies[0]["idle"], posx: bomber_1_posx, posy: 5,width: 60, height: 40});
					$("#"+name).addClass("enemy");
					$("#"+name)[0].enemy = new Bomber($("#"+name));
					$("#"+name)[0].enemy.speedx=bomber_1_speedx;
			}
			if(!bomber_2 && Math.random() > 0.65){
					bomber_2=true;
					var name = "bomber_2";
					// Appears on the right or on the left ?
					if(Math.random() > 0.5){//Right
							bomber_2_posx = 560;
							bomber_2_speedx = -enemies1SpeedX;						
						}else{//Left
							bomber_2_posx = -60;
							bomber_2_speedx = enemies1SpeedX;
					}
					$("#actors").addSprite(name, {animation: enemies[0]["idle"], posx: bomber_2_posx, posy: 65,width: 60, height: 40});
					$("#"+name).addClass("enemy");
					$("#"+name)[0].enemy = new Bomber($("#"+name));
					$("#"+name)[0].enemy = new Bomber($("#"+name));
					$("#"+name)[0].enemy.speedx=bomber_2_speedx;
			}
		} 
		
	}, 500); //once per 1/2 second is enough for this

});

