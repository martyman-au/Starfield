importScripts('mersenne-twister.js','PerlinSimplex.js');
			 
var nebulacolors = [[2,10,2],[20,-10,0],[0,20,10],[0,0,-10],[-10,-10,5],[-5,0,-5],[0,0,0],[10,10,10]];
var nebulatypes = [[[0,0],
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
	
var clouds = { perlinoctaves:5,
			  perlinfalloff:0.5,
			  featurescale:0.001};

function createBlankArray(length) {
	var output = [];
	for( var i = 0; i < length; i++) {
		output[i] = 0;
	}
	return output;
};			  
	
function renderClouds(location) {
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
	
	random = new MersenneTwister(location);
	PerlinSimplex.setRng(random);
	PerlinSimplex.noiseDetail(clouds.perlinoctaves,clouds.perlinfalloff);

	// create a new pixel array
//	imageData = this.offscreenctx.createImageData(game.width, game.height);
	var fScl = clouds.featurescale;
	
	var noise = null;
	
	var nebulacolor = nebulacolors[Math.floor(random.random()*nebulacolors.length)];
	var nebulatype = nebulatypes[Math.floor(random.random()*nebulatypes.length)];

	for(var i=1; i < buffer.width*buffer.height; i++){
			x = i % buffer.width;
			y = Math.floor(i / buffer.height);
			xx = 0+x*fScl;
			yy = 0+y*fScl;
			noise = Math.floor(PerlinSimplex.noise( xx,yy )*40)-20;

			buffer.data[i*4] = Math.max( noise + nebulacolor[0] + nebulatype[0][0]*(x/buffer.width) + nebulatype[0][1]*(y/buffer.height) + Math.random() - 1, 0);
			buffer.data[i*4+1] = Math.max( noise + nebulacolor[1] + nebulatype[1][0]*(x/buffer.width) + nebulatype[1][1]*(y/buffer.height) + Math.random() - 1, 0);
			buffer.data[i*4+2] = Math.max( noise + nebulacolor[2] + nebulatype[2][0]*(x/buffer.width) + nebulatype[2][1]*(y/buffer.height) + Math.random() - 1, 0);
			buffer.data[i*4+3] = 255;
	}

	return buffer.data;
};

self.addEventListener('message', function(e) {
  self.postMessage({ type: 'data', message: renderClouds(e.data)});
}, false);
