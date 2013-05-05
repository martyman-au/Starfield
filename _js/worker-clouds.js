importScripts('mersenne-twister.js','PerlinSimplex.js');

var stars = { perlinoctaves:2,
			  perlinfalloff:0.5,
			  featurescale:0.002,
			  colorvar:50,
			  density:0.007,
			  brightness:120,
			  sizeoffset:-10};
			 
var nebulacolors: [[2,10,2],[20,-10,0],[0,20,10],[0,0,-10],[-10,-10,5],[-5,0,-5],[0,0,0],[10,10,10]];
var nebulatypes: [[[0,0],
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
				 ];
	
var clouds: { perlinoctaves:5,
			  perlinfalloff:0.5,
			  featurescale:0.001};
	
	
	
	renderClouds: function () {
		var tempbuffer = document.createElement("canvas");
		tempbuffer.width = game.canvaswidth;
		tempbuffer.height = game.canvasheight;
		var tempctx = tempbuffer.getContext('2d');
		
		random = new MersenneTwister(game.location);
		PerlinSimplex.setRng(random);
		PerlinSimplex.noiseDetail(this.clouds.perlinoctaves,this.clouds.perlinfalloff);

		// create a new pixel array
		imageData = this.offscreenctx.createImageData(game.canvaswidth, game.canvasheight);
		var data = imageData.data
		var fScl = this.clouds.featurescale;
		
		var noise = null;
		
		var nebulacolor = this.nebulacolors[Math.floor(random.random()*this.nebulacolors.length)];
		var nebulatype = this.nebulatypes[Math.floor(random.random()*this.nebulatypes.length)];

		for(var i=1; i < game.canvaswidth*game.canvasheight; i++){
				x = i % game.canvaswidth;
				y = Math.floor(i / game.canvasheight);
				xx = 0+x*fScl;
				yy = 0+y*fScl;
				noise = Math.floor(PerlinSimplex.noise( xx,yy )*40)-20;

				data[i*4] = Math.max( noise + nebulacolor[0] + nebulatype[0][0]*(x/game.canvaswidth) + nebulatype[0][1]*(y/game.canvasheight) + Math.random() - 1, 0);
				data[i*4+1] = Math.max( noise + nebulacolor[1] + nebulatype[1][0]*(x/game.canvaswidth) + nebulatype[1][1]*(y/game.canvasheight) + Math.random() - 1, 0);
				data[i*4+2] = Math.max( noise + nebulacolor[2] + nebulatype[2][0]*(x/game.canvaswidth) + nebulatype[2][1]*(y/game.canvasheight) + Math.random() - 1, 0);
				data[i*4+3] = 255;
		}

		tempctx.putImageData(imageData, 0, 0); // at coords 0,0
		return tempbuffer;
	},

	renderStars: function () {
		var tempbuffer = document.createElement("canvas");
		tempbuffer.width = game.canvaswidth;
		tempbuffer.height = game.canvasheight;
		var tempctx = tempbuffer.getContext('2d');
		
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
							tempctx.putImageData(star3, x, y);
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
							tempctx.putImageData(star2, x, y);
						}
						else {
							data1[0] = brightness[0]*1.2;
							data1[1] = brightness[1]*1.2;
							data1[2] = brightness[2]*1.2;
							data1[3] = brightness[0];
							tempctx.putImageData(star1, x, y);
						}
					}
				}
		}
		return tempbuffer;
	},
	
	loading: function () {
		this.ctx.font = "normal 400 50px 'Roboto Condensed','Trebuchet MS',sans-serif";
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = '#e04545';
		var x = game.canvaswidth/2;
		var y = game.canvasheight/2;
		this.ctx.fillText('Loading', x, y);
	},
	
})