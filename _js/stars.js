StarsClass = Class.extend({
	ctx: null,
	
	init: function () {
		this.ctx = cv.layers.stars.context;
	},
	
	draw: function () {
		this.ctx.beginPath();
		this.ctx.rect(0, 0, 1920, 1080);
		this.ctx.fillStyle = 'black';
		this.ctx.fill();
		this.ctx.lineWidth = 7;
		this.ctx.strokeStyle = 'yellow';
		this.ctx.stroke();
	},
	
	wipe: function () {
		this.ctx.clearRect ( 0 , 0 , 1920 , 1080 );
	},
	
	redraw: function () {
//		this.wipe();
//		this.draw();
	},
	
	animFrame: function () {
		this.redraw();
	},
	
	renderClouds: function () {
		width = ~~(1920*cv.scale);
		height = ~~(1080*cv.scale);
		random = new MersenneTwister(100);
		PerlinSimplex.setRng(random);
		PerlinSimplex.noiseDetail(4,0.5);

		// create a new pixel array
		imageData = this.ctx.createImageData(width, height);
		var data = imageData.data
		var fScl = 0.002/cv.scale;
		
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
		this.ctx.putImageData(imageData, 0, 0); // at coords 0,0
	},

	renderStars: function () {
		width = 1920;
		height = 1080;
		random = new MersenneTwister(102);
		PerlinSimplex.setRng(random);
		PerlinSimplex.noiseDetail(2,0.5);

		// create a new pixel array
		star1 = this.ctx.createImageData(1, 1);
		var data = star1.data
		data[0] = data[1] = data[2] = data[3] = 100;
		
		var fScl = 0.002;
		
		var noise = 0;
		
		for(var i=1; i < width*height; i++){
				x = i % width;
				y = Math.floor(i / height);
				xx = 0+x*fScl;
				yy = 0+y*fScl;
				noise = PerlinSimplex.noise( xx,yy )*0.7;

				if( Math.random() < noise * 0.02 ) {
					// copy the image data back onto the canvas
					data[0] = data[1] = data[2] = data[3] = (Math.random() * 255) + (noise * 160) - 100;
					this.ctx.putImageData(star1, x*cv.scale, y*cv.scale); 
				}
		}
	},

})