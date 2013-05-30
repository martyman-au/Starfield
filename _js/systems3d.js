SystemsClass = Class.extend({
	planets: [],
	star: null,
	scene: null,
	camera: null,
	renderer: null,
	cube: null,
	light: null,
	ambientLight: null,
	textures: {},
	
	init: function () {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera.position.z = 10;
		this.camera.position.y = -20;
		
		var origin = new THREE.Vector3( 0, 0, 0 );
		this.camera.lookAt(origin);

		this.renderer = new THREE.WebGLRenderer( {antialias: true});
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		
		this.light = new THREE.PointLight( 0xFFFFFF );
		this.light.position.z = 0;
		this.scene.add( this.light );
		
		this.ambientLight = new THREE.AmbientLight( 0x09090f );
		this.scene.add( this.ambientLight );
		
		this.star = new StarClass({size:0.8, color:0xffff88})
		this.scene.add( this.star.object );


		this.planets.push( new PlanetClass({size:0.1, orbitdistance:2.5, orbitangle:100, speed:1.3, color:0xee4444, texture:textures.mercury}) );
		this.planets.push( new PlanetClass({size:0.2, orbitdistance:3.5, orbitangle:120, speed:0.9, color:0x0088ee, texture:textures.earth}) );
		this.planets.push( new PlanetClass({size:0.5, orbitdistance:7, orbitangle:220, speed:0.5, color:0x00ee22, texture:textures.saturn}) );
		this.planets.push( new PlanetClass({size:0.6, orbitdistance:10, orbitangle:320, speed:0.3, color:0x2266ee, texture:textures.jupiter}) );
		this.planets.push( new PlanetClass({size:0.3, orbitdistance:12, orbitangle:190, speed:0.2, color:0x00eeee, texture:textures.neptune}) );
		this.planets.push( new PlanetClass({size:0.1, orbitdistance:13, orbitangle:160, speed:0.15, color:0x7777ff, texture:textures.pluto}) );

		for( var i = 0; i < this.planets.length; i++) {
		console.log(this.planets[i]);
			this.scene.add( this.planets[i].object );
		}
	},
	
	draw: function () {
		for( var i = 0; i < this.planets.length; i++) {
			this.planets[i].draw();
		}
		
		
	},
	
	wipe: function () {
//		this.ctx.clearRect ( 0 , 0 , game.canvaswidth , game.canvasheight );
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
		
		this.star.animFrame();
		
		this.renderer.render(this.scene, this.camera);
	}

});

PlanetClass = Class.extend({
	size: null,
	orbitdistance: null,
	orbitangle: null,
	speed: null, // Degrees orbit per animFrame
	color: null,
	texture: null,
	object: null,
	
	init: function (settings) {
		if(settings.size) this.size = settings.size;
		if(settings.orbitdistance) this.orbitdistance = settings.orbitdistance;
		if(settings.orbitangle) this.orbitangle = settings.orbitangle;
		if(settings.speed) this.speed = settings.speed;
		if(settings.color) this.color = settings.color;
		if(settings.texture) this.texture = settings.texture;

		var geometry = new THREE.SphereGeometry(this.size,32,32);
		var material = new THREE.MeshLambertMaterial( );
		if(this.texture) material.map = this.texture;
		this.object = new THREE.Mesh( geometry, material );
		this.object.rotation.x = 90 * Math.PI/180;
//		this.cube.position.x = 3;
//		return this.object;
	},
	
	draw: function () {
		var x = Math.cos(this.orbitangle * Math.PI / 180) * this.orbitdistance;
		var y = Math.cos((this.orbitangle - 90) * Math.PI / 180) * this.orbitdistance;
		this.object.position.x = x;
		this.object.position.y = y;
	},
	
	animFrame: function () {
		this.orbitangle = this.orbitangle + (this.speed * game.gamespeed);
		if(this.orbitangle > 360) this.orbitangle = 0;
		this.object.rotation.y = this.object.rotation.y + 3*Math.PI/180;
	},
});

StarClass = Class.extend({
	size: null,
	color: null,
	object: null,
	
	init: function (settings) {
		if(settings.size) this.size = settings.size;
		if(settings.color) this.color = settings.color;

		var geometry = new THREE.SphereGeometry(this.size,32,32);
		var material = new THREE.MeshBasicMaterial( { map: textures.sun } );
		this.object = new THREE.Mesh( geometry, material );
//		return this.object;
	},
	
	draw: function () {
//		var x = Math.cos(this.orbitangle * Math.PI / 180) * this.orbitdistance;
//		var y = Math.cos((this.orbitangle - 90) * Math.PI / 180) * this.orbitdistance;
//		this.object.position.x = x;
//		this.object.position.y = y;
	},
	
	animFrame: function () {
//		this.orbitangle = this.orbitangle + (this.speed * game.gamespeed);
//		if(this.orbitangle > 360) this.orbitangle = 0;
		this.object.rotation.z = this.object.rotation.z + 1*Math.PI/180;
	},
});

var textures = {};
textures.earth = THREE.ImageUtils.loadTexture( "_images/earthmap1k.jpg" );
//textures.earth.repeat.set( 1,1 );

textures.mercury = THREE.ImageUtils.loadTexture( "_images/mercurymap.jpg" );
//textures.mercury.repeat.set( 1,1 );

textures.jupiter = THREE.ImageUtils.loadTexture( "_images/jupitermap.jpg" );
textures.uranus = THREE.ImageUtils.loadTexture( "_images/uranusmap.jpg" );
textures.pluto = THREE.ImageUtils.loadTexture( "_images/plutomap1k.jpg" );
textures.saturn = THREE.ImageUtils.loadTexture( "_images/saturnmap.jpg" );
textures.neptune = THREE.ImageUtils.loadTexture( "_images/neptunemap.jpg" );


textures.sun = THREE.ImageUtils.loadTexture( "_images/sunmap.jpg" );
//textures.sun.repeat.set( 1,1 );

