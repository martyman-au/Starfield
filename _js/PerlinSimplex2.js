// PerlinSimplex 1.2
// Ported from Stefan Gustavson's java implementation by Sean McCullough banksean@gmail.com
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
// octaves and falloff implementation (and passing jslint) by Ron Valstar
// also implemented Karsten Schmidt's implementation
if (!this.PerlinSimplex) {
	var PerlinSimplex = function() {
		var F2 = 0.5*(Math.sqrt(3)-1);
		var G2 = (3-Math.sqrt(3))/6;
		var G22 = 2*G2 - 1;
		var F3 = 1/3;
		var G3 = 1/6;
		var F4 = (Math.sqrt(5) - 1)/4;
		var G4 = (5 - Math.sqrt(5))/20;
		var G42 = G4*2;
		var G43 = G4*3;
		var G44 = G4*4 - 1;
		// Gradient vectors for 3D (pointing to mid points of all edges of a unit cube)
		var aGrad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
		// Gradient vectors for 4D (pointing to mid points of all edges of a unit 4D hypercube)
//		var grad4 = [[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]];
		// To remove the need for index wrapping, double the permutation table length
		var aPerm;
		// A lookup table to traverse the simplex around a given point in 4D. 
		// Details can be found where this table is used, in the 4D noise method. 
		var simplex = [[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]];
		//
		var g;
		var n0, n1, n2, n3, n4;
		var s;
		var c;
		var sc;
		var i, j, k, l;
		var t;
		var x0, y0, z0, w0;
		var i1, j1, k1, l1;
		var i2, j2, k2, l2;
		var i3, j3, k3, l3;
		var x1, y1, z1, w1;
		var x2, y2, z2, w2;
		var x3, y3, z3, w3;
		var x4, y4, z4, w4;
		var ii, jj, kk, ll;
		var gi0, gi1, gi2, gi3, gi4;
		var t0, t1, t2, t3, t4;
		//
		//
		var oRng = Math;
		var iOctaves = 1;
		var fPersistence = 0.5;
		var fResult, fFreq, fPers;
		var aOctFreq; // frequency per octave
		var aOctPers; // persistence per octave
		var fPersMax; // 1 / max persistence
		//
		// octFreqPers
		var octFreqPers = function octFreqPers() {
			var fFreq, fPers;
			aOctFreq = [];
			aOctPers = [];
			fPersMax = 0;
			for (var i=0;i<iOctaves;i++) {
				fFreq = Math.pow(2,i);
				fPers = Math.pow(fPersistence,i);
				fPersMax += fPers;
				aOctFreq.push( fFreq );
				aOctPers.push( fPers );
			}
			fPersMax = 1 / fPersMax;
		};
		// 1D dotproduct
		var dot1 = function dot1(g, x) { 
			return g[0]*x;
		};
		// 2D dotproduct
		var dot2 = function dot2(g, x, y) {
			return g[0]*x + g[1]*y;
		};
		// 3D dotproduct
		var dot3 = function dot3(g, x, y, z) {
			return g[0]*x + g[1]*y + g[2]*z;
		};
		// 4D dotproduct
		var dot4 = function dot4(g, x, y, z, w) {
			return g[0]*x + g[1]*y + g[2]*z + g[3]*w;
		};
		// setPerm
		var setPerm = function setPerm() {
			var i;
			var p = [];
			for (i=0; i<256; i++) {	
				p[i] = Math.floor(oRng.random()*256);
			}
			// To remove the need for index wrapping, double the permutation table length 
			aPerm = []; 
			for(i=0; i<512; i++) {
				aPerm[i] = p[i & 255];
			}
		};
		// noise2d
		var noise2d = function noise2d(x, y) {
			// Skew the input space to determine which simplex cell we're in 
			s = (x+y)*F2; // Hairy factor for 2D 
			i = ~~(x+s); 
			j = ~~(y+s); 
			t = (i+j)*G2; 
			x0 = x - (i - t); // Unskew the cell origin back to (x,y) space 
			y0 = y - (j - t); // The x,y distances from the cell origin 
			// For the 2D case, the simplex shape is an equilateral triangle. 
			// Determine which simplex we are in. 
			// Offsets for second (middle) corner of simplex in (i,j) coords 
			if (x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
				i1 = 1;
				j1 = 0;
			}  else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
				i1 = 0;
				j1 = 1;
			}
			// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and 
			// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where 
			// c = (3-sqrt(3))/6 
			x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords 
			y1 = y0 - j1 + G2; 
			x2 = x0 + G22; // Offsets for last corner in (x,y) unskewed coords 
			y2 = y0 + G22; 
			// Work out the hashed gradient indices of the three simplex corners 
			ii = i&255; 
			jj = j&255; 
			// Calculate the contribution from the three corners 
			t0 = 0.5 - x0*x0-y0*y0; 
			if (t0<0) {
				n0 = 0; 
			} else { 
				t0 *= t0; 
				gi0 = aPerm[ii+aPerm[jj]] % 12; 
				n0 = t0 * t0 * dot2(aGrad3[gi0], x0, y0);  // (x,y) of aGrad3 used for 2D gradient 
			} 
			t1 = 0.5 - x1*x1-y1*y1; 
			if (t1<0) {
				n1 = 0; 
			} else { 
				t1 *= t1; 
				gi1 = aPerm[ii+i1+aPerm[jj+j1]] % 12; 
				n1 = t1 * t1 * dot2(aGrad3[gi1], x1, y1); 
			}
			t2 = 0.5 - x2*x2-y2*y2; 
			if (t2<0) {
				n2 = 0; 
			} else { 
				t2 *= t2; 
				gi2 = aPerm[ii+1+aPerm[jj+1]] % 12; 
				n2 = t2 * t2 * dot2(aGrad3[gi2], x2, y2); 
			} 
			// Add contributions from each corner to get the final noise value. 
			// The result is scaled to return values in the interval [0,1].
			return 70 * (n0 + n1 + n2);
		};

		// init
		setPerm();
		// return
		return {
			noise: function(x,y,z,w) {
				fResult = 0;
				for (g=0;g<iOctaves;g++) {
					fFreq = aOctFreq[g];
					fPers = aOctPers[g];
					fResult += fPers*noise2d(fFreq*x,fFreq*y);
				}
				return ( fResult*fPersMax + 1 )*0.5;
			},noiseDetail: function(octaves,falloff) {
				iOctaves = octaves||iOctaves;
				fPersistence = falloff||fPersistence;
				octFreqPers();
			},setRng: function(r) {
				oRng = r;
				setPerm();
			},toString: function() {
				return "[object PerlinSimplex "+iOctaves+" "+fPersistence+"]";
			}
		};
	}();
}