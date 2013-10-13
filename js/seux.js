
// Global constants:
var PLAYGROUND_WIDTH	= 500;
var PLAYGROUND_HEIGHT	= 500;
var REFRESH_RATE		= 30;

// Global animation holder
var mouseMarker     = new Array();
var playerAnimation = new Array();
var enemies         = new Array(2); // There are two (three soon... ) kind of enemies in the game
var missile         = new Array();


// Global movement constants://px per frame
var playerMove = 10;
var enemies1SpeedX = 4;
var enemies2SpeedX = 6;
var BOMB_1_SPEED = 4;
var TRACKER_RAY_SPEED = 10;
var MISSILE_PLAYER_SPEED = -12;

// Game state
var gameOver = false;
var bomber_1 = bomber_2 = tracker = heroDetectedByTracker = false;
var playerAnimationState = 0;
var score = 0;
var playerShootingOn = true;
var enemiesBomb_1_number = 0;
var playerBullet_1_number = 0;
var trackerRay_number = 0;
var timeSeconds = 0;
var level = 1;


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
	this.shield	= 1;
	this.speedx	= enemies1SpeedX;
	this.speedy	= 0;
	this.node = $(node);
	
		// deals with damage endured by an enemy
	this.damage = function(){
		this.shield--;
		if(this.shield == 0){
			return true;
		}
		return false;
	};

	
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
	
	// Mouse marker
	mouseMarker["idle"]					= new $.gQ.Animation({imageURL: "images/mouse-marker.png"}); 
	
	// Player space ship animations:
	playerAnimation["idle"]				= new $.gQ.Animation({imageURL: "images/hero.png"});
	playerAnimation["hitted-1"]			= new $.gQ.Animation({imageURL: "images/hero-hitted-1.png", numberOfFrame: 2, delta: 40, rate: 250, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});
	playerAnimation["damaged-1"]		= new $.gQ.Animation({imageURL: "images/hero-damaged-1.png"});
	playerAnimation["damaged-2"]		= new $.gQ.Animation({imageURL: "images/hero-damaged-2.png"});
	playerAnimation["damaged-3"]		= new $.gQ.Animation({imageURL: "images/hero-damaged-3.png"});
	playerAnimation["damaged-4"]		= new $.gQ.Animation({imageURL: "images/hero-damaged-4.png"});
	playerAnimation["damaged-5"]		= new $.gQ.Animation({imageURL: "images/hero-damaged-5.png"});
	
	//  List of enemies animations :
	// 1st kind of enemy:
	enemies[0] 							= new Array(); // enemies have two animations
	enemies[0]["idle"]					= new $.gQ.Animation({imageURL: "images/ennemy-bomber-1.png"});
	enemies[0]["explode"]				= new $.gQ.Animation({imageURL: "images/ennemy-bomber-1-explode.png", numberOfFrame: 4, delta: 40, rate: 60, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});
	enemies[1] 							= new Array(); // enemies have two animations
	enemies[1]["idle"]					= new $.gQ.Animation({imageURL: "images/ennemy-tracker.png"});
	enemies[1]["explode"]				= new $.gQ.Animation({imageURL: "images/ennemy-tracker-1-explode.png", numberOfFrame: 4, delta: 36, rate: 60, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});
	
	// Weapon missile:
	missile["player"] = new $.gQ.Animation({imageURL: "images/bullet-hero-1.png"});
	missile["enemies"] = new Array(); // enemies's missiles have two animations
	missile["enemies"] = new $.gQ.Animation({imageURL: "images/ennemy-bomb-1.png"});
	missile["explode"]	= new $.gQ.Animation({imageURL: "images/ennemy-bomb-1-explode.png", numberOfFrame: 4, delta: 30, rate: 60, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});
	missile["tracker-ray"] = new $.gQ.Animation({imageURL: "images/tracker-ray.png"});
	
	// Initialize the game:
	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true, mouseTracker: true});
				
	// Initialize the background
	$.playground().addGroup("enemiesMissileLayer",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
					.end()
					.addGroup("enemiesActors",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
					.end()
					
					.addGroup("heroActor", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
							.addSprite("player",{animation: playerAnimation["idle"], posx: (PLAYGROUND_WIDTH/2)-20, posy: 455, width: 40, height: 40})
							.addSprite("mouseMarker",{animation: mouseMarker["idle"], posx: (PLAYGROUND_WIDTH/2)-20, posy: 498, width: 40, height: 2})
							.end()
							.addGroup("playerMissileLayer",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT});
	
	$("#player")[0].player = new Player($("#player"));
		
	//initialize the start button
	$("#startbutton").click(function(){
		$("#console").html('click');
		$.playground().startGame(function(){
			$("#welcomeScreen").fadeTo(1000,0,function(){$(this).remove();});
			$("#playground").css("cursor", "none");			
			$("#console").html('Game Started');
		});
	})
	
	// this is the function that control most of the game logic 
	$.playground().registerCallback(function(){
		
			// Gather PosX needed
			mousePosX=$.gQ.mouseTracker['x'];
			playerPosX=$("#player").x();
		
		
			//Update the position of the mouseMarker
			mouseTrackerPosX=mousePosX;
			if(mousePosX>459){ mouseTrackerPosX = 460;}
			$("#mouseMarker").x(mouseTrackerPosX);


			
			//Update the movement of the player:
				//if( $.gQ.keyTracker[37] ||  $.gQ.keyTracker[87] ||  $.gQ.keyTracker[81] || ( mousePosX<playerPosX && mousePosX<playerPosX-20 ) ){ //this is left! (<- or w or q or mouse on the left) reminder
				if( mousePosX<playerPosX && mousePosX<playerPosX-10 ){ //this is left! (<- or w or q or mouse on the left)
					var nextpos = playerPosX-playerMove;
					if(nextpos > 0){
						$("#player").x(nextpos);
					}
				}
				//if( $.gQ.keyTracker[39] ||  $.gQ.keyTracker[88] ||  $.gQ.keyTracker[68] || ( mousePosX>playerPosX && mousePosX>playerPosX+20 ) ){ //this is right! (-> or x or d or mouse on the right)
				if( mousePosX>playerPosX && mousePosX>playerPosX+10 ){ //this is right! (-> or x or d or mouse on the right)
					var nextpos = playerPosX+playerMove;
					if(nextpos < PLAYGROUND_WIDTH - 45){
						$("#player").x(nextpos);
					}
				}
				//The player shoots:
				//if(( $.gQ.keyTracker[75] || $.gQ.mouseTracker[1]) && playerShootingOn ){ // this is k to shoot!  reminder
				if( $.gQ.mouseTracker[1]  && playerShootingOn ){
				//shoot missile here
				if(playerBullet_1_number<10){
						playerBullet_1_number++;
					}else{
						playerBullet_1_number=0;
					}
					var playerposx = $("#player").x();
					var playerposy = $("#player").y();
					var name = "playerMissle_"+playerBullet_1_number;
					$("#playerMissileLayer").addSprite(name,{animation: missile["player"], posx: playerposx + 17, posy: playerposy, width: 6,height: 14});
					$("#"+name).addClass("playerMissiles");
					playerShootingOn = false;
				}
			//Update the movement of the enemies
				$(".enemy").each(function(){
						this.enemy.update($("#player"));
						var posx = $(this).x();
						var posy = $(this).y();// Used for the tracker
						if(this.enemy instanceof Bomber){
							
							if(posx < -60 || posx > 560){    
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
							if(posy > 550){
								$(this).remove();
								heroDetectedByTracker=false;
								return;   
							}
							
							// Random value use for going down and firing
							xTrackerFactor = Math.random();
							// Detect if the hero is near below
							if(nextpos>posx-60 && nextpos<posx+140 && !heroDetectedByTracker){
								xTrackerFactor = Math.random();
								if( xTrackerFactor < 0.05){// Go down
									$("#tracker")[0].enemy.speedx=0;
									$("#tracker")[0].enemy.speedy=33;
									heroDetectedByTracker=true;
									return;
								}
								//
								
								if( xTrackerFactor > 0.35){// Fire
										if(trackerRay_number<100){
											trackerRay_number++;
										}else{
											trackerRay_number=0;
										}
										var name = "trackerRay_1-"+trackerRay_number;
										$("#enemiesMissileLayer").addSprite(name,{animation: missile["tracker-ray"], posx: posx+4, posy: posy + 36, width: 2,height: 17});
										$("#"+name).addClass("enemiesMissiles").addClass("trackerRay");
										var name = "trackerRay_2-"+trackerRay_number;
										$("#enemiesMissileLayer").addSprite(name,{animation: missile["tracker-ray"], posx: posx+36, posy: posy + 36, width: 2,height: 17});
										$("#"+name).addClass("enemiesMissiles").addClass("trackerRay");
								}
							}
							
							//Test for collision with the tracker
							var collidedTracker = $(this).collision("#player,."+$.gQ.groupCssClass);
							if(collidedTracker.length > 0){
																
								//The player has been hit!
								
								heroDetectedByTracker=false;
								
								collidedTracker.each(function(){
									
										$("#player").setAnimation(playerAnimation["hitted-1"],callback=playerAnimationStateSwitch);
										playerAnimationState++;// See the callback fonction that managed the look of the player : playerAnimationStateSwitch 
									})
									
								$(this).remove();
																
								if(playerAnimationState == 6){
									alert('gameover');
									}
							}
							
							
						}
					//Make the enemies fire
					if(this.enemy instanceof Bomber){
						if(Math.random() < 0.015){
							var enemyposx = $(this).x();
							var enemyposy = $(this).y();
							if(enemiesBomb_1_number<100){
								enemiesBomb_1_number++;
							}else{
								enemiesBomb_1_number=0;
							}
							var name = "enemiesBomb_1_"+enemiesBomb_1_number;
							$("#enemiesMissileLayer").addSprite(name,{animation: missile["enemies"], posx: enemyposx+20, posy: enemyposy + 25, width: 20,height: 30});
							$("#"+name).addClass("enemiesMissiles");
						}
					}

					});
			//Update the movement of the missiles
			$(".playerMissiles").each(function(){
					var posy = $(this).y();
					if(posy < 0){
						$(this).remove();
						return;
					}
					
					$(this).y(MISSILE_PLAYER_SPEED, true);

					//Test for collisions with enemies
					var collided = $(this).collision(".enemy,."+$.gQ.groupCssClass);

					if(collided.length > 0){

						//An enemy has been hit!
						collided.each(function(){
						
									if(this.enemy instanceof Bomber) {										
										
										$(this).setAnimation(enemies[0]["explode"], function(node){$(node).remove();});
										 score = score+10; 
										 
										   
									} else if(this.enemy instanceof Tracker){
										
										$(this).setAnimation(enemies[1]["explode"], function(node){$(node).remove();heroDetectedByTracker=false;});
										score = score+20;
										
									}
									
									$(this).removeClass("enemy");
									
							
							})
							
						$(this).removeClass("playerMissiles").remove();
						
					}
					
					//Test for collisions with enemies's missiles
					var collidedMissile = $(this).collision(".enemiesMissiles,."+$.gQ.groupCssClass);

					if(collidedMissile.length > 0){

						//An enemy missile has been hit!
						collidedMissile.each(function(){						

							$(this).setAnimation(missile["explode"], function(node){$(node).remove();});
										 
							score = score+7;
							
							$(this).removeClass("enemiesMissiles");
														
							})
							
						$(this).removeClass("playerMissiles").remove();
						
					}
					
					
				});
				
				

			$(".enemiesMissiles").each(function(){
					var posy = $(this).y();
					if(posy > 500){
						$(this).remove();
						return;
					}
					if($(this).hasClass( "trackerRay" )){// Tracker Rays
						$(this).y(TRACKER_RAY_SPEED, true);
					}else{// Bombs
						$(this).y(BOMB_1_SPEED, true);
					}
					//Test for collisions
					var collided = $(this).collision("#player,."+$.gQ.groupCssClass);
					if(collided.length > 0){
						//The player has been hit!
						collided.each(function(){
								$("#player").setAnimation(playerAnimation["hitted-1"],callback=playerAnimationStateSwitch);
								playerAnimationState++;// See the callback fonction that managed the look of the player : playerAnimationStateSwitch 
							})
						$(this).remove();
						if(playerAnimationState == 6){
							alert('gameover');
							}
					}
				});
				
				$("#console").html('Game Started / SCORE : ' + score + ' ' + heroDetectedByTracker + 'width : ' + $('body,html').width() + ' mousePosX : ' + mousePosX + ' mouseTracker x' + $.gQ.mouseTracker['x']);
		
	}, REFRESH_RATE);
	
		//This function manage the creation of the bombers and the creation of the tracker// And the shooting of the player
	$.playground().registerCallback(function(){
		if(!gameOver){
			
			// Bomber 1
			if(!$(".bomber_1").length && Math.random() > 0.75){
					var name = "bomber_1";
					// Appears on the right or on the left ?
					if(Math.random() > 0.5){//Right
							bomber_1_posx = 560;
							bomber_1_speedx = -enemies1SpeedX;						
						}else{//Left
							bomber_1_posx = -60;
							bomber_1_speedx = enemies1SpeedX;
					}
					$("#enemiesActors").addSprite(name, {animation: enemies[0]["idle"], posx: bomber_1_posx, posy: 5,width: 60, height: 40});
					$("#"+name).addClass("enemy").addClass(name);
					$("#"+name)[0].enemy = new Bomber($("#"+name));
					$("#"+name)[0].enemy.speedx=bomber_1_speedx;
			}
			
			// Bomber 2
			if(!$(".bomber_2").length && Math.random() > 0.65  && level >= 2){
					var name = "bomber_2";
					// Appears on the right or on the left ?
					if(Math.random() > 0.5){//Right
							bomber_2_posx = 560;
							bomber_2_speedx = -enemies1SpeedX;						
						}else{//Left
							bomber_2_posx = -60;
							bomber_2_speedx = enemies1SpeedX;
					}
					$("#enemiesActors").addSprite(name, {animation: enemies[0]["idle"], posx: bomber_2_posx, posy: 65,width: 60, height: 40});
					$("#"+name).addClass("enemy").addClass(name);
					$("#"+name)[0].enemy = new Bomber($("#"+name));
					$("#"+name)[0].enemy.speedx=bomber_2_speedx;
			}
			
			// tracker
			if(!$(".tracker").length && Math.random() > 0.75 && level >= 3){
					var name = "tracker";
					// Appears on the right or on the left ?
					if(Math.random() > 0.5){//Right
							tracker_posx = 540;
							tracker_speedx = -enemies2SpeedX;						
						}else{//Left
							tracker_posx = -40;
							tracker_speedx = enemies2SpeedX;
					}
					$("#enemiesActors").addSprite(name, {animation: enemies[1]["idle"], posx: tracker_posx, posy: 120,width: 40, height: 36});
					$("#"+name).addClass("enemy").addClass(name);
					$("#"+name)[0].enemy = new Tracker($("#"+name));
					$("#"+name)[0].enemy.speedx=tracker_speedx;
			}
			
			// Shotting of the player
			if(!playerShootingOn){// For the shooting of the player
				playerShootingOn = true;
			} 
			

			
		}
		

		
	}, 500); //once per 1/2 second is enough for this
	
	
		//This function manage the time and the level
	$.playground().registerCallback(function(){
		if(!gameOver){
			timeSeconds++; // Incrementation seconds
			if( timeSeconds % 15 == 0 ){ // Modulo sur 15
				level++;
				$("#level").html(level);
				}
			if(timeSeconds <10){
				timeSeconds = '0'+timeSeconds;
			}
			$("#timeSeconds").html(timeSeconds);
	
		} 
		
	}, 1000); //once per 1 second
	
});

