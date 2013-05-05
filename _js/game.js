var gameClass = Class.extend({
	location: 7,
	canvaswidth: 1920,
	canvasheight: 1080,
	
	init: function () {
	},

	setupGame: function () {
		// Create objects to look after game output, data and logic
		cv = new CanvasClass();  		// canvas layers and contexts
		stars = new StarsClass();
		this.setupListners();			// Add some listners

//		requestAnimationFrame( game.animFrame );		// Start animation loop

		cv.setScale();					// TODO: not sure about this line and the next
		this.redraw();
	},
	

	animFrame: function(){
		// Animation loop
		requestAnimationFrame( game.animFrame ); 		// continue loop
//		effects.animFrame();							// render any currrent effects
//		units.animFrame();								// render any unit changes
	},
	
	setupListners: function () {
		window.onkeydown = game.keypress;	// send keypresses to this.keypress();
		
		window.onresize = function(event) {  	// on resize we should reset the canvas size and scale and redraw the board, ui and units
			cv.setScale();						// Scale canvases
			game.redraw();						// redraw all canvases
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
	},

});


// variables used to hold main game objects
var sprites = {};	// Sprites class
var cv = {};		// Canvas class
var ui = {};		// User interface class
var sound = {};		// Sound class
var stars = {};		// Sound class
var game = new gameClass();	// Overall game class



