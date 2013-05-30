importScripts('mersenne-twister.js','PerlinSimplex2.js');
			 
var nebulacolors = [[2,10,2],[20,-10,0],[0,20,10],[0,0,-10],[-5,-5,5],[-5,0,-5],[0,0,0],[10,10,10]];
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
	
var clouds = { perlinoctaves:4,
			  perlinfalloff:0.5,
			  featurescale:0.001};

var width = 1920;
var height = 1080;
var buf = new ArrayBuffer(width*height*4);
var buf8 = new Uint8ClampedArray(buf);
var data = new Uint32Array(buf);

function renderClouds(location) {
	random = new MersenneTwister(location);
	PerlinSimplex.setRng(random);
	PerlinSimplex.noiseDetail(clouds.perlinoctaves,clouds.perlinfalloff);

	var fScl = clouds.featurescale;
	var x = y = xx = yy = noise = null;
	
	var nebulacolor = nebulacolors[Math.floor(random.random()*nebulacolors.length)];
	var nebulatype = nebulatypes[Math.floor(random.random()*nebulatypes.length)];
	
	for(var i=0; i < width*height; i++){
			x = i % width;
			y = Math.floor(i / width);
			xx = 0+x*fScl;
			yy = 0+y*fScl;
			noise = Math.floor(PerlinSimplex.noise( xx,yy )*40)-20;
			
			data[x + y*width] = 
				(255 << 24) |
				(Math.floor(Math.max( noise + nebulacolor[2] + nebulatype[2][0]*(x/width) + nebulatype[2][1]*(y/height) + Math.random() - 1, 0)) << 16) |
				(Math.floor(Math.max( noise + nebulacolor[1] + nebulatype[1][0]*(x/width) + nebulatype[1][1]*(y/height) + Math.random() - 1, 0)) << 8) |
				Math.floor(Math.max( noise + nebulacolor[0] + nebulatype[0][0]*(x/width) + nebulatype[0][1]*(y/height) + Math.random() - 1, 0));
	}
};

self.addEventListener('message', function(e) {
	renderClouds(e.data)
	self.postMessage(buf8.buffer, [buf8.buffer]);
	self.close();
}, false);
