SystemsClass = Class.extend({
	ctx: null,
	skew: 0.2,
	planets: [],
	
	init: function () {
		this.ctx = cv.layers.systems.context;
		
		this.planets.push( new PlanetClass(5, 140, 100, 1.3) );
		this.planets.push( new PlanetClass(9, 200, 120, 0.9) );
		this.planets.push( new PlanetClass(20, 400, 220, 0.5) );
		this.planets.push( new PlanetClass(30, 700, 320, 0.3) );
		this.planets.push( new PlanetClass(10, 800, 190, 0.2) );
	},
	
	draw: function () {
		this.ctx.beginPath();
		var diameter = 35;
		this.ctx.arc( game.canvaswidth/2, game.canvasheight/2, diameter, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = '#FFFFDD';
		this.ctx.fill();
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = '#FFFF77';
		this.ctx.stroke();

		for( var i = 0; i < this.planets.length; i++) {
			this.planets[i].draw();
		}
	},
	
	wipe: function () {
		this.ctx.clearRect ( 0 , 0 , game.canvaswidth , game.canvasheight );
	},
	
	redraw: function () {
		this.wipe();
		this.draw();
	},
	
	animFrame: function () {
		for( var i = 0; i < this.planets.length; i++) {
			this.planets[i].animFrame();
		}
		this.redraw();
	}

});

PlanetClass = Class.extend({
	size: null,
	orbitdistance: null,
	orbitangle: null,
	ctx: null,
	speed: null, // Degrees orbit per animFrame
	
	init: function (size, orbitdistance, orbitangle, speed) {
		this.size = size;
		this.orbitdistance = orbitdistance;
		this.orbitangle = orbitangle;
		this.speed = speed;
	},
	
	draw: function () {

		systems.ctx.save();
		systems.ctx.scale(1, systems.skew);
		systems.ctx.beginPath();
		systems.ctx.arc( game.canvaswidth/2, game.canvasheight/(2*systems.skew), this.orbitdistance, 0, Math.PI*2, false);
		systems.ctx.lineWidth = 1;
		systems.ctx.strokeStyle = "rgba(150,150,150, 0.2)";
		systems.ctx.stroke();
		systems.ctx.closePath();
		systems.ctx.restore();

		
		var x = game.canvaswidth/2 + Math.cos(this.orbitangle * Math.PI / 180) * this.orbitdistance;
		var y = game.canvasheight/2 + Math.cos((this.orbitangle - 90) * Math.PI / 180) * this.orbitdistance * systems.skew;
		systems.ctx.beginPath();
		systems.ctx.arc( x, y, this.size, 0, Math.PI*2, false);
		systems.ctx.fillStyle = '#228833';
		systems.ctx.fill();
		systems.ctx.closePath();
		
		if(x > game.canvaswidth/2) {
			var leftoffset = -this.size*Math.cos((this.orbitangle-90) * Math.PI / 180)*1.35;
			var rightoffset = this.size*1.35;
		}
		else {
			var leftoffset = -this.size*1.35;
			var rightoffset = this.size*Math.cos((this.orbitangle-90) * Math.PI / 180)*1.35;
		}
		systems.ctx.beginPath();
		systems.ctx.moveTo(x,y-this.size);
		systems.ctx.lineWidth = 2;
		systems.ctx.strokeStyle = "rgba(0,0,0, 0.4)";
		systems.ctx.bezierCurveTo(x+leftoffset,y-this.size,x+leftoffset,y+this.size,x,y+this.size);
		systems.ctx.bezierCurveTo(x+rightoffset,y+this.size,x+rightoffset,y-this.size,x,y-this.size);
		systems.ctx.stroke();		
		systems.ctx.fillStyle = '#000000';
		systems.ctx.fill();
		systems.ctx.closePath();
	},
	
	animFrame: function () {
		this.orbitangle = this.orbitangle + (this.speed * game.gamespeed);
		if(this.orbitangle > 360) this.orbitangle = 0;
	},
});