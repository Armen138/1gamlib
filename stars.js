define(["resources"], function(Resources) {
var PARTICLECOUNT = 500,
	MAXDISTANCE = 5000,
    particles = new THREE.Geometry();


	var Stars = function(scene, ship) {

		var texture = new THREE.Texture(Resources.star);
		var pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			size: 30,
			map: THREE.ImageUtils.loadTexture("images/star.png"),
			blending: THREE.AdditiveBlending,
			transparent: true
		});

		console.log(Resources.star);
		for(var p = 0; p < PARTICLECOUNT; p++) {

			var buffer = 500;
			var lr = 1;
			if(Math.random() < 0.5) {
				lr = -1;
			}

			var pX = ((Math.random() * 1500) + buffer) * lr ,
				pY = Math.random() * MAXDISTANCE,
				pZ = Math.random() * 1500 - 750,
				particle = new THREE.Vector3(pX, pY, pZ);


			// add it to the geometry
			particles.vertices.push(particle);
		}

		var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
		particleSystem.sortParticles = true;

		scene.add(particleSystem);
		var stars = {
			update: function() {
				for(var i = 0; i < particles.vertices.length; i++) {
					if(ship.mesh.position.y > particles.vertices[i].y + 100) {
						// console.log("relocating star");
						particles.vertices[i].y = ship.mesh.position.y + Math.random() * MAXDISTANCE + MAXDISTANCE;
					}
				}
			}
		};
		return stars;
	};
	return Stars;
});