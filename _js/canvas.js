CanvasClass = Class.extend({
	// Class for the canvases used to render the game
	Offset: {x:0, y:0},	// Offset required to center rendering in canvas
	scale: null,		// Scale required to fit board into canvas
	screenRatio: null,	// Apect ratio of the dipslay window
	screenMode: null,	// sreen mode setting used to switch UI layout for portrait layout
	layers: {},			// each of our game rendering layers is stored here
	resized: false,		// Keeps track of if the window has been resized nad needs scaling and redrawing

	init: function () {
		// Create canvases for the various game layers base don the config file
		var body = document.getElementById("body"), layer; 
		for( i in config.layers )
		{
			name = config.layers[i].name;
			this.layers[name] = {};
			this.layers[name].canvas = document.createElement("canvas");
			this.layers[name].canvas.style.position=config.layers[i].position;
			this.layers[name].canvas.style.top=config.layers[i].top;
			this.layers[name].canvas.style.left=config.layers[i].left;
			this.layers[name].canvas.style.zIndex=config.layers[i].zindex;
			body.appendChild(this.layers[name].canvas);
			this.layers[name].context = this.layers[name].canvas.getContext('2d');
		}
	},
	
	getMouse: function(e) {
		// return an object with sx and sy being the X and Y position of the click on the scaled canvases and x and y being the unscaled canvas click location
		// TODO: Is this the best place for this?
		return {sx: e.pageX / this.scale, sy: e.pageY / this.scale, x: e.pageX, y: e.pageY };
	},
 
	
	setSize: function (width, height) {
		// Sets the size of all of the cavases to the window size
		var i;
		for( i in config.layers )
		{
			this.layers[config.layers[i].name].canvas.width = width;
			this.layers[config.layers[i].name].canvas.height = height;
		}
	},
	
	setScale: function () {
		// Set the scale for the canvases so as to fit the game on any screen size
		
		this.scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080); // Scale needed to fit board in canvas
		this.screenRatio = window.innerWidth / window.innerHeight;
		
		this.setSize( Math.min(window.innerWidth,1920*this.scale), Math.min(window.innerHeight,1080*this.scale) ); // canvas = full window size
		
		// Apply scale to canvases
		this.layers['stars'].context.scale(this.scale,this.scale);
		this.layers['stars'].canvas.style.top = (window.innerHeight - 1080*this.scale) /2+'px';
		this.layers['stars'].canvas.style.left = (window.innerWidth - 1920*this.scale) /2+'px';

//		this.layers['systems'].context.scale(this.scale,this.scale);
//		this.layers['systems'].canvas.style.top = (window.innerHeight - 1080*this.scale) /2+'px';
//		this.layers['systems'].canvas.style.left = (window.innerWidth - 1920*this.scale) /2+'px';
	},
	
	animFrame: function () {
		if(this.resized) {
			this.resized = false;
			this.setScale();
			stars.redraw();
			systems.redraw();
		}
	}
	
});