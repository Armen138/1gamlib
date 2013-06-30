define("fuel", ["resources", "events"], function(Resources, Events) {
	var Fuel = function(scene, position, ship) {
		var dead = false;
	    var mesh =  new THREE.Mesh(Resources.fuel.geometry, Resources.fuel.material);
	    	mesh.rotation.x += Math.PI / 2;
	    	mesh.rotation.y = Math.PI;
	    	mesh.scale.set(5, 5, 5);	
	    	mesh.castShadow = true;
	    	mesh.position = position;//new THREE.Vector3(0, 10, 0);	
	    	mesh.name = "fuel";
		scene.add(mesh);		
		var fuel = {
			update: function(d) {
				if(!dead) {
					mesh.rotation.y += d / 500;					
					if(ship.mesh.position.distanceTo(mesh.position) < 25) {
						console.log("hit fuel");
						dead = true;
						scene.remove(mesh);
						fuel.fire("pick-up");
					}
				}

			}
		};
		Events.attach(fuel);
		return fuel;
	};
	return Fuel;
});