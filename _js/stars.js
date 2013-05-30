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
			var bg = this.bg[game.location];
			bg.state = 'loading';
			
			console.log('loading');
			this.loading();
			
			this.workers.stars.addEventListener('message', function(e) {
				if( e.data.type == 'log' ) {
					console.log(e.data.message);
				}
				else {
					console.log('Star data received');
					bg.saveStars(e.data);
					bg.starsloaded = 1;
					if( bg.starsloaded & bg.cloudsloaded ) {
						bg.state = 'loaded';
						bg.drawClouds();
						bg.drawStars();
					}
				}
			}, false);
			
			this.workers.clouds.addEventListener('message', function(e) {
				if( e.data.type == 'log' ) {
					console.log(e.data.message);
				}
				else {
					console.log('Cloud data received');
					bg.saveClouds(e.data);
					bg.cloudsloaded = 1;
					if( bg.starsloaded & bg.cloudsloaded ) {
						bg.state = 'loaded';
						bg.drawClouds();
						bg.drawStars();
					}
				}
			}, false);
			
			this.workers.stars.postMessage(game.location);
			this.workers.clouds.postMessage(game.location);
		}
		else if(this.bg[game.location].state == 'loaded') {
		  this.bg[game.location].drawClouds();
		  this.bg[game.location].drawStars();
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
	starsloaded: 0,
	cloudsloaded: 0,
	
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
		var data = new Uint32Array(pixeldata);
		var buf8 = new Uint8ClampedArray(pixeldata);
		var imageData = this.starsctx.createImageData(game.canvaswidth, game.canvasheight);
		imageData.data.set(buf8);
		this.starsctx.putImageData(imageData, 0, 0);
	},
	
	drawStars: function () {
		stars.ctx.drawImage(this.starscv, 0,0);
		console.log('Canvas updated (stars)');
	},

	saveClouds: function (pixeldata) {
		var data = new Uint32Array(pixeldata);
		var buf8 = new Uint8ClampedArray(pixeldata);
		var imageData = this.cloudsctx.createImageData(game.canvaswidth, game.canvasheight);
		imageData.data.set(buf8);
		this.cloudsctx.putImageData(imageData, 0, 0);
	},
	
	drawClouds: function () {
		stars.ctx.drawImage(this.cloudscv, 0,0);
		console.log('Canvas updated (clouds)');
	},
});