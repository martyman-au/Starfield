StarsClass = Class.extend({
	ctx: null,
	bgclouds: [],
	bgstars: [],
	offscreenbuffer: null,
	offscreenctx: null,
	nebulas: [[20,30,20],[30,0,10],[10,30,30],[20,20,0]],
	stars: { perlinoctaves:2,
			 perlinfalloff:0.5,
			 colorvar:50,
			 density:0.007,
			 brightness:120,
			 sizeoffset:-10,
			 featurescale:0.002},
	
	init: function () {
		this.ctx = cv.layers.stars.context;
		this.offscreenbuffer = document.createElement("canvas");
		this.offscreenbuffer.width = game.canvaswidth;
		this.offscreenbuffer.height = game.canvasheight;
		this.offscreenctx = this.offscreenbuffer.getContext('2d');
	},
	
	draw: function () {
		if(!this.bgclouds[game.location]) {
			this.bgclouds[game.location] = this.renderClouds();
			this.bgstars[game.location] = this.renderStars();
		}
		var bgclouds = new Image();
		bgclouds.src = this.bgclouds[game.location];
		bgclouds.onload = function() {
			stars.ctx.drawImage(bgclouds, 0, 0);
		};
		var bgstars = new Image();
		bgstars.src = this.bgstars[game.location];
		bgstars.onload = function() {
			stars.ctx.drawImage(bgstars, 0, 0);
		};
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
	
	renderClouds: function () {
		this.offscreenctx.clearRect ( 0 , 0 , game.canvaswidth , game.canvasheight );
		width = game.canvaswidth;
		height = game.canvasheight;
		random = new MersenneTwister(game.location);
		PerlinSimplex.setRng(random);
		PerlinSimplex.noiseDetail(4,0.5);

		// create a new pixel array
		imageData = this.offscreenctx.createImageData(width, height);
		var data = imageData.data
		var fScl = 0.002;
		
		var noise = 0;
		
		for(var i=1; i < width*height; i++){
				x = i % width;
				y = Math.floor(i / height);
				xx = 0+x*fScl;
				yy = 0+y*fScl;
				noise = Math.floor(PerlinSimplex.noise( xx,yy )*60);
				data[i*4] = Math.max( noise - 20, 0);
				data[i*4+1] = Math.max( noise - 30, 0);
				data[i*4+2] = Math.max( noise - 20, 0);
				data[i*4+3] = 255;
		}

		// copy the image data back onto the canvas
		this.offscreenctx.putImageData(imageData, 0, 0); // at coords 0,0
		return this.offscreenbuffer.toDataURL();
	},

	renderStars: function () {
		this.offscreenctx.clearRect ( 0 , 0 , game.canvaswidth , game.canvasheight ); // clear offscreen buffer
		
		rnd = new MersenneTwister(game.location+1);
		PerlinSimplex.setRng(rnd);
		PerlinSimplex.noiseDetail(this.stars.perlinoctaves,this.stars.perlinfalloff);

		// create a new pixel arrays to render star images to
		star1 = this.ctx.createImageData(1, 1);
		var data1 = star1.data
		star2 = this.ctx.createImageData(2, 2);
		var data2 = star2.data
		star3 = this.ctx.createImageData(7, 7);
		var data3 = star3.data
		
		var noise = null;
		
		for(var i=1; i < game.canvaswidth*game.canvasheight; i++){
				x = i % game.canvaswidth;
				y = Math.floor(i / game.canvaswidth);
				xx = 0+x*this.stars.featurescale;
				yy = 0+y*this.stars.featurescale;
				noise = PerlinSimplex.noise( xx,yy );
				
				var starchance = rnd.random();
				var starbright = rnd.random();
				var starred = rnd.random()*this.stars.colorvar - this.stars.colorvar/2;
				var stargreen = rnd.random()*this.stars.colorvar - this.stars.colorvar/2;
				var starblue = rnd.random()*this.stars.colorvar - this.stars.colorvar/2;
				if( starchance < noise * this.stars.density ) {
					// copy the image data back onto the canvas
					var brightness = [];
					brightness [0] = Math.min(255,(starbright * 225) + (noise * this.stars.brightness) - this.stars.brightness/2 + this.stars.sizeoffset + starred);
					brightness [1] = Math.min(255,(starbright * 225) + (noise * this.stars.brightness) - this.stars.brightness/2 + this.stars.sizeoffset + stargreen);
					brightness [2] = Math.min(255,(starbright * 225) + (noise * this.stars.brightness) - this.stars.brightness/2 + this.stars.sizeoffset + starblue);
					if(brightness[0] > 250) {
							var pixels = [16,17,18,23,24,25,30,31,32];
							for ( var p = 0; p < pixels.length; p++ ) {
								data3[pixels[p]*4+0] = brightness[0];
								data3[pixels[p]*4+1] = brightness[1];
								data3[pixels[p]*4+2] = brightness[2];
								data3[pixels[p]*4+3] = 255;
							}
							var pixels = [10,15,19,22,26,29,33,38];
							for ( var p = 0; p < pixels.length; p++ ) {
								data3[pixels[p]*4+0] = brightness[0] - 30;
								data3[pixels[p]*4+1] = brightness[1] - 30;
								data3[pixels[p]*4+2] = brightness[2] - 30;
								data3[pixels[p]*4+3] = 255;
							}
							var pixels = [9,11,37,39];
							for ( var p = 0; p < pixels.length; p++ ) {
								data3[pixels[p]*4+0] = brightness[0] - 110;
								data3[pixels[p]*4+1] = brightness[1] - 110;
								data3[pixels[p]*4+2] = brightness[2] - 110;
								data3[pixels[p]*4+3] = 255;
							}
							var pixels = [3,21,27,45];
							for ( var p = 0; p < pixels.length; p++ ) {
								data3[pixels[p]*4+0] = brightness[0] - 170;
								data3[pixels[p]*4+1] = brightness[1] - 170;
								data3[pixels[p]*4+2] = brightness[2] - 170;
								data3[pixels[p]*4+3] = 255;
							}
							this.offscreenctx.putImageData(star3, x, y);
							console.log('extra big star '+x+' '+y);
					}
					else {
						if(brightness[0] > 210) {
							var pixels = [0,1,2,3];
							for ( var p = 0; p < pixels.length; p++ ) {
								data2[pixels[p]*4+0] = brightness[0];
								data2[pixels[p]*4+1] = brightness[1];
								data2[pixels[p]*4+2] = brightness[2];
								data2[pixels[p]*4+3] = 255;
							}
							this.offscreenctx.putImageData(star2, x, y);
							console.log('big star');
						}
						else {
							data1[0] = brightness[0];
							data1[1] = brightness[1];
							data1[2] = brightness[2];
							data1[3] = 255
							this.offscreenctx.putImageData(star1, x, y);
						}
					}
				}
		}
		return this.offscreenbuffer.toDataURL();
	},
	
	
})