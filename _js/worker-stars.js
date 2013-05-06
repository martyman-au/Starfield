importScripts('mersenne-twister.js','PerlinSimplex2.js');

var stars = { perlinoctaves:2,
			  perlinfalloff:0.5,
			  featurescale:0.002,
			  colorvar:50,
			  density:0.007,
			  brightness:120,
			  sizeoffset:-10};

function createBlankArray(length) {
	var output = [];
	for( var i = 0; i < length; i++) {
		output[i] = 0;
	}
	return output;
}
			  
function renderStars(location) {
	var buffer = {};
	buffer.width = 1920;
	buffer.height = 1080;
	buffer.data = createBlankArray(1920*1080*4);
	buffer.addPixels = function (data, x, y) {
		var datawidth = Math.sqrt(data.length/4)*4;
		for( var i = 0; i < data.length; i++) {
			var row = Math.floor(i / datawidth);
			var col = i % datawidth;
			
			var xindex = x*4 + col;
			var yindex = y + row;
			buffer.data[xindex + yindex*buffer.width*4] = data[i];
		}
	};
	
	var rnd = new MersenneTwister(location+1);
	PerlinSimplex.setRng(rnd);
	PerlinSimplex.noiseDetail(stars.perlinoctaves,stars.perlinfalloff);

	// create a new pixel arrays to render star images to
	var data1 = createBlankArray(1*1*4);
	var data2 = createBlankArray(2*2*4);
	var data3 = createBlankArray(7*7*4);
	
	var noise = null;
	var starchance = null;
	
	for(var i=1; i < 1920*1080; i++) {
			x = i % 1920
			y = Math.floor(i / 1920);
			xx = 0+x*stars.featurescale;
			yy = 0+y*stars.featurescale;
			noise = PerlinSimplex.noise( xx,yy );
			starchance = rnd.random();
			if( starchance < noise * stars.density ) {
				// copy the image data back onto the canvas
				var starbright = rnd.random();
				var starred = rnd.random()*stars.colorvar - stars.colorvar/2;
				var stargreen = rnd.random()*stars.colorvar - stars.colorvar/2;
				var starblue = rnd.random()*stars.colorvar - stars.colorvar/2;
				
				var brightness = [];
				brightness [0] = Math.min(255,(starbright * 225) + (noise * stars.brightness) - stars.brightness/2 + stars.sizeoffset + starred);
				brightness [1] = Math.min(255,(starbright * 225) + (noise * stars.brightness) - stars.brightness/2 + stars.sizeoffset + stargreen);
				brightness [2] = Math.min(255,(starbright * 225) + (noise * stars.brightness) - stars.brightness/2 + stars.sizeoffset + starblue);
				
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
//						buffer.putImageData(data3, x, y);
						buffer.addPixels(data3, x, y);
//						self.postMessage({ type: 'log', message: 'Extra Big Star'});
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
//						buffer.putImageData(data2, x, y);
						buffer.addPixels(data2, x, y);
					}
					else {
						data1[0] = brightness[0]*1.2;
						data1[1] = brightness[1]*1.2;
						data1[2] = brightness[2]*1.2;
						data1[3] = brightness[0];
//						buffer.putImageData(data1, x, y);
						buffer.addPixels(data1, x, y);
					}
				}
			}
	}
	return buffer.data;
};

self.addEventListener('message', function(e) {
  self.postMessage({ type: 'data', message: renderStars(e.data)});
  self.close();
}, false);
