StarsClass = Class.extend({
	workers: {stars:null, clouds:null},
	ctx: null,
	bg: [],
	stars: { perlinoctaves:2,
			 perlinfalloff:0.5,
			 featurescale:0.002,
			 colorvar:50,
			 density:0.007,
			 brightness:120,
			 sizeoffset:-10},
			 
	nebulacolors: [[2,10,2],[20,-10,0],[0,20,10],[0,0,-10],[-10,-10,5],[-5,0,-5],[0,0,0],[10,10,10]],
	nebulatypes: [[[0,0],
				   [0,0],
				   [0,0]],
				   
				  [[0,0],
				   [10,0],
				   [0,0]],
				   
				  [[15,0],
				   [0,0],
				   [0,0]],
				   
				  [[0,0],
				   [20,0],
				   [0,0]],
				   
				  [[0,0],
				   [10,-10],
				   [0,0]],
				   
				  [[0,-10],
				   [20,0],
				   [0,0]],
				   
				  [[-10,0],
				   [0,0],
				   [10,0]],
				   
				  [[0,0],
				   [20,0],
				   [0,20]],
				 ],
	
	clouds: { perlinoctaves:5,
			  perlinfalloff:0.5,
			  featurescale:0.001},
	
	init: function () {
		this.ctx = cv.layers.stars.context;
		this.workers.stars = new Worker('_js/worker-stars.js');
		this.workers.clouds = new Worker('_js/worker-clouds.js');
	},
	
	draw: function () {
		if(!this.bg[game.location]) {
			this.bg[game.location] = new BackgroundClass();
			console.log('loading');
			
			this.workers.stars.addEventListener('message', function(e) {
				if( e.data.type == 'log' ) {
					console.log(e.data.message);
				}
				else if( e.data.type == 'data' ) {
					console.log('Star data received');
					stars.bg[game.location].saveStars(e.data.message);
					stars.bg[game.location].drawStars();
				}
			}, false);
			
			this.workers.clouds.addEventListener('message', function(e) {
				if( e.data.type == 'log' ) {
					console.log(e.data.message);
				}
				else if( e.data.type == 'data' ) {
					console.log('Cloud data received');
//					console.log(e.data.message);
					stars.bg[game.location].saveClouds(e.data.message);
					stars.bg[game.location].drawClouds();
				}
			}, false);
			
			this.workers.stars.postMessage(game.location);
			this.workers.clouds.postMessage(game.location);
		}
		else {
		  stars.bg[game.location].drawClouds();
		  stars.bg[game.location].drawStars();
		}
	},
	
	wipe: function () {
		this.ctx.clearRect ( 0 , 0 , game.canvaswidth , game.canvasheight );
	},
	
	redraw: function () {
		this.draw();
	},
	
	animFrame: function () {
//		this.redraw();
	},
	
	loading: function () {
		this.ctx.font = "normal 400 50px 'Roboto Condensed','Trebuchet MS',sans-serif";
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = '#e04545';
		var x = game.canvaswidth/2;
		var y = game.canvasheight/2;
		this.ctx.fillText('Loading', x, y);
	},
	
});

BackgroundClass = Class.extend({
	state: null,
	starscv: null,
	starsctx: null,
	cloudscv: null,
	cloudsctx: null,
	
	init: function () {
		this.starscv = document.createElement("canvas");
		this.starscv.width = game.canvaswidth;
		this.starscv.height = game.canvasheight;
		this.starsctx = this.starscv.getContext('2d');
		this.cloudscv = document.createElement("canvas");
		this.cloudscv.width = game.canvaswidth;
		this.cloudscv.height = game.canvasheight;
		this.cloudsctx = this.cloudscv.getContext('2d');
	},
	
	saveStars: function (pixeldata) {
		var imageData = this.starsctx.createImageData(game.canvaswidth, game.canvasheight);
		for( var i = 0; i < imageData.data.length; i++) imageData.data[i] = pixeldata[i];
		this.starsctx.putImageData(imageData, 0, 0);
	},
	
	drawStars: function () {
		stars.ctx.drawImage(this.starscv, 0,0);
		console.log('Canvas updated (stars)');
	},

	saveClouds: function (pixeldata) {
		var imageData = this.cloudsctx.createImageData(game.canvaswidth, game.canvasheight);
		for( var i = 0; i < imageData.data.length; i++) imageData.data[i] = pixeldata[i];
		this.cloudsctx.putImageData(imageData, 0, 0);
	},
	
	drawClouds: function () {
		stars.ctx.drawImage(this.cloudscv, 0,0);
		console.log('Canvas updated (clouds)');
	},
});