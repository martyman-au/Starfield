StarsClass = Class.extend({
	ctx: null,
	bgclouds: [],
	bgstars: [],
	offscreenbuffer: null,
	offscreenctx: null,
	
	init: function () {
		this.ctx = cv.layers.stars.context;
		this.offscreenbuffer = document.createElement("canvas");
		this.offscreenbuffer.width = 1920;
		this.offscreenbuffer.height = 1080;
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
		this.ctx.clearRect ( 0 , 0 , 1920 , 1080 );
	},
	
	redraw: function () {
		this.draw();
	},
	
	animFrame: function () {
//		this.redraw();
	},
	
	renderClouds: function () {
		this.offscreenctx.clearRect ( 0 , 0 , 1920 , 1080 );
		width = 1920;
		height = 1080;
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
		this.offscreenctx.clearRect ( 0 , 0 , 1920 , 1080 );
		width = 1920;
		height = 1080;
		rnd = new MersenneTwister(game.location+1);
		PerlinSimplex.setRng(rnd);
		PerlinSimplex.noiseDetail(2,0.5);

		// create a new pixel array
		star1 = this.ctx.createImageData(1, 1);
		var data1 = star1.data
		
		star2 = this.ctx.createImageData(2, 2);
		var data2 = star2.data

		star3 = this.ctx.createImageData(3, 3);
		var data3 = star3.data
		
		var fScl = 0.002;
		
		var noise = 0;
		
		for(var i=1; i < width*height; i++){
				x = i % width;
				y = Math.floor(i / height);
				xx = 0+x*fScl;
				yy = 0+y*fScl;
				noise = PerlinSimplex.noise( xx,yy )*0.7;
				
				var starchance = rnd.random();
				var starbright = rnd.random();
				if( starchance < noise * 0.010 ) {
					// copy the image data back onto the canvas
					var brightness = Math.min(255,(starbright * 225) + (noise * 140) - 55);
					if(brightness > 250) {
							var pixels = [0,1,2,3,4,5,6,7,8];
							for ( var p = 0; p < pixels.length; p++ ) {
								data3[p*4+0] = data3[p*4+1] = data3[p*4+2] = data3[p*4+3] = brightness;
							}
							this.offscreenctx.putImageData(star3, x, y);
							console.log('extra big star');
					}
					else {
						if(brightness > 210) {
							var pixels = [0,1,2,3];
							for ( var p = 0; p < pixels.length; p++ ) {
								data2[p*4+0] = data2[p*4+1] = data2[p*4+2] = data2[p*4+3] = brightness;
							}
							this.offscreenctx.putImageData(star2, x, y);
							console.log('big star');
						}
						else {
							data1[0] = data1[1] = data1[2] = data1[3] = brightness;
							this.offscreenctx.putImageData(star1, x, y);
						}
					}
				}
		}
		return this.offscreenbuffer.toDataURL();
	},
	
	
})