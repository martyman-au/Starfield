importScripts('mersenne-twister.js','PerlinSimplex2.js');

var stars = { perlinoctaves:2,
			  perlinfalloff:0.5,
			  featurescale:0.002,
			  colorvar:60,
			  density:0.007,
			  brightness:120,
			  sizeoffset:-10};

var width = 1920;
var height = 1080;
var buf = new ArrayBuffer(width*height*4);
var buf8 = new Uint8ClampedArray(buf);
var data = new Uint32Array(buf);
	
function renderStars(location) {

	
	var rnd = new MersenneTwister(location+1);
	PerlinSimplex.setRng(rnd);
	PerlinSimplex.noiseDetail(stars.perlinoctaves,stars.perlinfalloff);
	
	var noise = null;
	var starchance = null;
	var row = col = xindex = yindex = null;
	
	for(var i=1; i < width*height; i++) {
			x = i % width
			y = Math.floor(i / width);
			xx = 0+x*stars.featurescale;
			yy = 0+y*stars.featurescale;
			noise = PerlinSimplex.noise( xx,yy );
			starchance = rnd.random();
			if( starchance < noise * stars.density ) {
				// copy the image data back onto the canvas
				var basebright = ~~((rnd.random() * 225) + (noise * stars.brightness) - stars.brightness/2 + stars.sizeoffset);
				var starred = Math.floor((rnd.random()*stars.colorvar - stars.colorvar/2)*(basebright+100)/355);
				var stargreen = Math.floor((rnd.random()*stars.colorvar - stars.colorvar/2)*(basebright+100)/355);
				var starblue = Math.floor((rnd.random()*stars.colorvar - stars.colorvar/2)*(basebright+100)/355);
				
				var brightness = [];
				brightness[0] = Math.min(Math.max(basebright + starred,0),255);
				brightness[1] = Math.min(Math.max(basebright + stargreen,0),255);
				brightness[2] = Math.min(Math.max(basebright + starblue,0),255);
			
				if(brightness[0] > 250) {
						var pixels = [16,17,18,23,24,25,30,31,32];
						for ( var p = 0; p < pixels.length; p++ ) {
							row = Math.floor(pixels[p] / 7);
							col = pixels[p] % 7;
							xindex = x + col;
							yindex = y + row;
							data[xindex + yindex*width] = 
												(255 << 24) |
												(brightness[2] << 16) |
												(brightness[1] << 8) |
												brightness[0];
						}
						var pixels = [10,15,19,22,26,29,33,38];
						for ( var p = 0; p < pixels.length; p++ ) {
							row = Math.floor(pixels[p] / 7);
							col = pixels[p] % 7;
							xindex = x + col;
							yindex = y + row;
							data[xindex + yindex*width] = 
												(255 << 24) |
												((brightness[2]-30) << 16) |
												((brightness[1]-30) << 8) |
												(brightness[0]-30);
						}
						var pixels = [9,11,37,39];
						for ( var p = 0; p < pixels.length; p++ ) {
							row = Math.floor(pixels[p] / 7);
							col = pixels[p] % 7;
							xindex = x + col;
							yindex = y + row;
							data[xindex + yindex*width] = 
												(255 << 24) |
												((brightness[2]-110) << 16) |
												((brightness[1]-110) << 8) |
												(brightness[0]-110);
						}
						var pixels = [3,21,27,45];
						for ( var p = 0; p < pixels.length; p++ ) {
							row = Math.floor(pixels[p] / 7);
							col = pixels[p] % 7;
							xindex = x + col;
							yindex = y + row;
							data[xindex + yindex*width] = 
												(255 << 24) |
												((brightness[2]-170) << 16) |
												((brightness[1]-170) << 8) |
												(brightness[0]-170);
						}
//						self.postMessage({ type: 'log', message: 'Extra Big Star '+x+' '+y});
				}
				else if(brightness[0] > 210) {
						var pixels = [0,1,2,3];
						for ( var p = 0; p < pixels.length; p++ ) {
							row = Math.floor(pixels[p] / 2);
							col = pixels[p] % 2;
							xindex = x + col;
							yindex = y + row;
							data[xindex + yindex*width] = 
												(255 << 24) |
												(brightness[2] << 16) |
												(brightness[1] << 8) |
												brightness[0];
						}

				}
				else {
							data[x + y*width] = 
												(255 << 24) |
												(brightness[2] << 16) |
												(brightness[1] << 8) |
												brightness[0];
				}
			}
	}
};

self.addEventListener('message', function(e) {
	renderStars(e.data)
	self.postMessage(buf8.buffer, [buf8.buffer]);
	self.close();
}, false);
