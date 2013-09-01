var game = function() {
			
				// private methods/properties
				var private = {};
				
				private.PLAYGROUND_WIDTH = 500;
				private.PLAYGROUND_HEIGHT = 500;
				
				private.status = -1;
				
				// Ennemies
				private.bombers = 0
				
				
				var get = function(key) {
					return private[key];
				}
				
				var set = function(key, val) {
					private[key] = val;
				}

				// public methods/properties
				return {
					init: function() {
						
						$("#pause").hide();
						
						$("#playground").playground({
							height: get('PLAYGROUND_HEIGHT'),
							width: get('PLAYGROUND_WIDTH'),
							refreshRate: 30
						});

						$.playground().addSprite('heroSpaceship', {
							animation: new $.gameQuery.Animation({
								imageURL:"images/hero.png" }),
							width: 40,
							height: 40
						});

						
						$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH})
										  //.addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
										  .addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
										  //.addGroup("playerMissileLayer",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
										  //.addGroup("enemiesMissileLayer",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
										  ;
						
					

						this.initPlayer();


						
						var classObj = this;
						$.playground().registerCallback(function() {

							var status = get('status');


							if (status > 0) {
								
								//Game IS Running !!!
								
							}
						}, 30);
						
					},
					initPlayer: function() {
						var player = $('#heroSpaceship');
						player.addClass('player');
						player.xy(get('PLAYGROUND_WIDTH')/2-player.width(), 455 );
			
					},
					renderScores: function() {
						$('#score').text( $('#heroSpaceship').get(0).gameQuery.score );
					},
					movePlayer: function(player, dir){
						if (get('status') == 1) {
							var pos = $(player).position();
							var newPos = pos.left + dir;
							if (newPos > 0 && newPos+$(player).width() < get('PLAYGROUND_WIDTH')) {
								// move the player if within gamearea
								$(player).x(newPos);
							}
						}
					},
					keyDownHandler: function(evt) {
						// console.log(evt);
						var thisObj = this;
						switch(evt.keyCode) {
							case 13:
								if (get('status') == -1) {
									this.start();
								} else {
									this.pause();
								}
								break;
							case 37:// arrow left
							case 87:// w
								if (! this.moveRightInt) {
									this.moveRightInt = window.setInterval( function() { thisObj.movePlayer('#heroSpaceship', -4); }, 20);
								}
								break;
							case 39:// arrow right
							case 88:// x
								if (! this.moveRightInt) {
									this.moveRightInt = window.setInterval( function() { thisObj.movePlayer('#heroSpaceship', 4); }, 20);
								}
								break;
						}
					},
					keyUpHandler: function(evt) {
						switch(evt.keyCode) {
							case 37:
							case 87:
							case 39:
							case 88:
								window.clearInterval(this.moveRightInt);
								this.moveRightInt = null;
								break;
						}						
						
					},
					restart: function() {
						this.pause();
						this.renderScores();
						this.initPlayers();
					},
					start: function() {
						if (get('status') == -1) {
							set('status', 1);
							$.playground().startGame(function(){
								$("#welcome").remove();
							});
						}						
					},
					pause: function() {
						var status = get('status');
						if (status == 1) {
							status = 0;
							$("#pause").show();
						} else if (status == 0) {
							status = 1;
							$("#pause").hide();
						}
						set('status', status);
					}
				}
				
			}();
			
			
			$(function(){
				game.init();

				$('#welcome span').click(function(){
					game.start();				
				});
				
				$(document).keydown(function(evt){
					game.keyDownHandler(evt);
				});
				$(document).keyup(function(evt){
					game.keyUpHandler(evt);
				});
			});
