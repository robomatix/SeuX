// Global constants:
var PLAYGROUND_WIDTH	= 500;
var PLAYGROUND_HEIGHT	= 500;
var REFRESH_RATE		= 30;

// Global animation holder
var playerAnimation = new Array();
var enemies = new Array(2); // There are two (three soon... ) kind of enemies in the game
var missile = new Array();


// Global movement constants://px per frame
var playerMove = 9;
var enemies1SpeedX = 4;
var enemies2SpeedX = 6;
var BOMB_1_SPEED = 4;

// Game state
var gameOver = false;
var bomber_1 = bomber_2 = tracker = false;
var playerAnimationState = 0;


// Some helper functions : 

// Function to restart the game:
function restartgame(){
	window.location.reload();
};

// Apparence of the hero according to his state
function playerAnimationStateSwitch(){
	switch(playerAnimationState){
				case 1:
					$("#player").setAnimation(playerAnimation["damaged-1"]);
					break;
				case 2:
					$("#player").setAnimation(playerAnimation["damaged-2"]);
					break;
				case 3:
					$("#player").setAnimation(playerAnimation["damaged-3"]);
					break;
				case 4:
					$("#player").setAnimation(playerAnimation["damaged-4"]);
					break;
				case 5:
					$("#player").setAnimation(playerAnimation["damaged-5"]);
					break;
				}
	}

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
function Tracker(node){
	this.node = $(node);
}
Tracker.prototype = new Enemy();

// --------------------------------------------------------------------------------------------------------------------
// --                                      the main declaration:                                                     --
// --------------------------------------------------------------------------------------------------------------------
$(function(){
	// Animations declaration: 
	
	// Player space shipannimations:
	playerAnimation["idle"]		= new $.gQ.Animation({imageURL: "images/hero.png"});
	playerAnimation["hitted-1"]	= new $.gQ.Animation({imageURL: "images/hero-hitted-1.png", numberOfFrame: 2, delta: 40, rate: 250, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});
	playerAnimation["damaged-1"]	= new $.gQ.Animation({imageURL: "images/hero-damaged-1.png"});
	playerAnimation["damaged-2"]	= new $.gQ.Animation({imageURL: "images/hero-damaged-2.png"});
	playerAnimation["damaged-3"]	= new $.gQ.Animation({imageURL: "images/hero-damaged-3.png"});
	playerAnimation["damaged-4"]	= new $.gQ.Animation({imageURL: "images/hero-damaged-4.png"});
	playerAnimation["damaged-5"]	= new $.gQ.Animation({imageURL: "images/hero-damaged-5.png"});
	
	//  List of enemies animations :
	// 1st kind of enemy:
	enemies[0] = new Array(); // enemies have two animations
	enemies[0]["idle"]	= new $.gQ.Animation({imageURL: "images/ennemy-bomber-1.png"});
	enemies[1] = new Array(); // enemies have two animations
	enemies[1]["idle"]	= new $.gQ.Animation({imageURL: "images/ennemy-tracker.png"});
	
	// Weapon missile:
	missile["enemies"] = new $.gQ.Animation({imageURL: "images/ennemy-bomb-1.png"});
	
	// Initialize the game:
	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true});
				
	// Initialize the background
	$.playground().addGroup("enemiesMissileLayer",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
					.end()
					.addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
							.addSprite("player",{animation: playerAnimation["idle"], posx: (PLAYGROUND_WIDTH/2)-20, posy: 455, width: 40, height: 40})
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
				if(jQuery.gameQuery.keyTracker[37] || jQuery.gameQuery.keyTracker[87] || jQuery.gameQuery.keyTracker[81]){ //this is left! (<- or w or q)
					var nextpos = $("#player").x()-playerMove;
					if(nextpos > 0){
						$("#player").x(nextpos);
					}
				}
				if(jQuery.gameQuery.keyTracker[39] || jQuery.gameQuery.keyTracker[88] || jQuery.gameQuery.keyTracker[68]){ //this is right! (-> or x d)
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
						if(this.enemy instanceof Tracker){
							if(posx < 0){
								$("#tracker")[0].enemy.speedx=enemies2SpeedX;   
								return;
							}
							if(posx > 460){
								$("#tracker")[0].enemy.speedx=-enemies2SpeedX;   
								return;
							}
						}
			//Make the enemies fire
					if(this.enemy instanceof Bomber){
						if(Math.random() < 0.02){
							var enemyposx = $(this).x();
							var enemyposy = $(this).y();
							var name = "enemiesBomb_1_"+Math.ceil(Math.random()*1000);
							$("#enemiesMissileLayer").addSprite(name,{animation: missile["enemies"], posx: enemyposx+20, posy: enemyposy + 25, width: 20,height: 30});
							$("#"+name).addClass("enemiesMissiles");
						}
					}

					});
		//Update the movement of the missiles
			$(".enemiesMissiles").each(function(){
					var posy = $(this).y();
					if(posy > 500){
						$(this).remove();
						return;
					}
					$(this).y(BOMB_1_SPEED, true);
					//Test for collisions
					var collided = $(this).collision("#player,."+$.gQ.groupCssClass);
					if(collided.length > 0){
						//The player has been hit!
						collided.each(function(){
								$("#player").setAnimation(playerAnimation["hitted-1"],callback=playerAnimationStateSwitch);
								playerAnimationState++;// See the callback fonction that managed the look of the player : playerAnimationStateSwitch 
							})
						$(this).remove();
						/*
						$(this).setAnimation(missile["enemiesexplode"], function(node){$(node).remove();});
						$(this).removeClass("enemiesMissiles");
						* */
						if(playerAnimationState == 6){
							alert('gameover');
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
	
			//This function manage the creation of the tracker
	$.playground().registerCallback(function(){
		if(!gameOver){
			if(!tracker && Math.random() > 0.75){
					tracker=true;
					var name = "tracker";
					// Appears on the right or on the left ?
					if(Math.random() > 0.5){//Right
							tracker_posx = 540;
							tracker_speedx = -enemies2SpeedX;						
						}else{//Left
							tracker_posx = -40;
							tracker_speedx = enemies2SpeedX;
					}
					$("#actors").addSprite(name, {animation: enemies[1]["idle"], posx: tracker_posx, posy: 120,width: 40, height: 36});
					$("#"+name).addClass("enemy");
					$("#"+name)[0].enemy = new Tracker($("#"+name));
					$("#"+name)[0].enemy.speedx=tracker_speedx;
			}
		} 
		
	}, 1000); //once per 1 second is enough for this

});

