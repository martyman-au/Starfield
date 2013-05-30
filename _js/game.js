var gameClass = Class.extend({
	location: ~~(Math.random()*100),
	canvaswidth: 1920,
	canvasheight: 1080,
	gametime: 0.01,
	gamespeed: 0.2,
	
	init: function () {
	},

	setupGame: function () {
		// Create objects to look after game output, data and logic
		cv = new CanvasClass();  		// canvas layers and contexts
		stars = new StarsClass();
		systems = new SystemsClass();
		this.setupListners();			// Add some listners
		requestAnimationFrame( game.animFrame );		// Start animation loop
		cv.setScale();					// TODO: not sure about this line and the next
		this.redraw();
	},
	

	animFrame: function(){
		// Animation loop
//		game.gamespeed = game.gamespeed + 0.01;
		game.gametime =  game.gametime+game.gamespeed;
		requestAnimationFrame( game.animFrame ); 		// continue loop
		cv.animFrame();
		systems.animFrame();
	},
	
	setupListners: function () {
		window.onkeydown = game.keypress;	// send keypresses to this.keypress();
		
		window.onresize = function(event) {  	// on resize we should reset the canvas size and scale and redraw the board, ui and units
			cv.resized = true;
//			cv.setScale();						// Scale canvases
//			game.redraw();						// redraw all canvases
		}
	},
	
	keypress: function (e) {
		// Deal with keypresses
	},
	
	redraw: function () {
		// re-draw all of the game layers
//		board.render(); // render the playing board
//		units.redraw(); // render the playing board
//		ui.redraw();	// render the user interface
		stars.redraw();
		systems.redraw();
	},

});


// variables used to hold main game objects
var sprites = {};	// Sprites class
var cv = {};		// Canvas class
var ui = {};		// User interface class
var sound = {};		// Sound class
var stars = {};		// Stars class
var systems = {};	// Systems class
var game = new gameClass();	// Overall game class



