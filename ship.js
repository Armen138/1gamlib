define([
	"events",
	"resources",
	"trail",
	"easing"], function(
		Events,
		Resources,
		Trail,
		easing) {
	var PARTICLECOUNT = 50;
	var limits = {
		rotation: 0.7,
		strafes: 135,
		ttl: 100,
		jump: 500
	};
	var speed = {
		max: 10,
		current: 0,
		sideways: 0,
		gravity: 1,
		jump: 4
	};
	var Ship = function(scene, camera) {
	    var shipMesh =  new THREE.Mesh(Resources.ship.geometry, Resources.ship.material);
	    shipMesh.rotation.x += Math.PI / 2;
	    shipMesh.rotation.y = Math.PI;
	    shipMesh.scale.set(2, 2, 2);
	    shipMesh.castShadow = true;
	    shipMesh.name = "ship";
		var groundCheck = new THREE.Raycaster();//shipMesh.position, );
		var noseCheck = new THREE.Raycaster();
		var front = new THREE.Vector3(0, 1, 0);
		var down = new THREE.Vector3(0, 0, -1);
		var jumpStart = 0;
		scene.add(shipMesh);


		var trail = Trail(scene, shipMesh, new THREE.Vector3(0, -5, 0));

		function particleUpdate() {
			trail.update();
		}

		function limit() {
			if(shipMesh.position.x < -limits.strafes) {
				shipMesh.position.x = -limits.strafes;
			}
			if(shipMesh.position.x > limits.strafes) {
				shipMesh.position.x = limits.strafes;
			}
			if(shipMesh.rotation.z < -limits.rotation) {
				shipMesh.rotation.z = -limits.rotation;
			}
			if(shipMesh.rotation.z > limits.rotation) {
				shipMesh.rotation.z = limits.rotation;
			}
			if(!ship.turbo && speed.current > speed.max) {
				speed.current = speed.max;
			}
			if(ship.turbo && speed.current > speed.max * 2) {
				speed.current = speed.max * 2;
			}
			if(speed.current < 0) {
				speed.current = 0;
			}
			if(speed.sideways > speed.max) {
				speed.sidways = speed.max;
			}
			if(speed.sideways < -speed.max) {
				speed.sideways = -speed.max;
			}
		}
		var ship = {
			turbo: false,
			mesh: shipMesh,
			control: {
				left: false,
				right: false,
				jump: function() {
					jumpStart = Date.now();

				}
			},
			update: function(d) {
				var now = Date.now();
				var noseRayPosition = shipMesh.position.clone();
				noseRayPosition.y -= 10;
				noseRayPosition.z += 5;
				noseCheck.set(noseRayPosition, front);
				groundCheck.set(shipMesh.position, down);
				var c = groundCheck.intersectObject(scene, true);
				var f = noseCheck.intersectObject(scene, true);
				if(c.length > 0) {
					if(c[0].distance > 10) {
						shipMesh.position.z -= speed.gravity;
					}
					if(c[0].distance < 10) {
						shipMesh.position.z += 10 - c[0].distance;
					}
				} else {
					console.log("no more ground!");
					shipMesh.position.z -= speed.gravity;
					if(shipMesh.position.z < -100) {
						ship.fire("death");
					}
				}

				if(f.length > 0) {
					for(var i = 0; i < f.length; i++) {
						if(shipMesh.position.y > 20 && f[i].object.name !== "ship" && f[i].distance < 20) {
							// console.log(f[i]);
							console.log("die");
							shipMesh.position.y -= 20 - f[i].distance;
							camera.position.y -= 20 - f[i].distance;
							speed.current = 0;
							// console.log("bloo");
						}
					}
				}
				if(now - jumpStart < limits.jump) {
					var upforce = speed.jump - speed.jump * (now - jumpStart) / limits.jump;
					shipMesh.position.z += upforce;
				}

				// console.log(c);
				// if(ship.control.jump) {
				// 	shipMesh.position.z += d / 5;
				// }
				particleUpdate();
				if(ship.control.left) {
					speed.sideways -= d / 500;
					// shipMesh.position.x -= d / 5;
					shipMesh.rotation.z -= d / 500;
				}
				if(ship.control.right) {
					speed.sideways += d / 500;
					// shipMesh.position.x += d / 5;
					shipMesh.rotation.z += d / 500;
				}
				if(ship.control.up) {
					//shipMesh.position.y += d / 5;
					trail.emit = true;
					speed.current += d / 500;
				} else {
					trail.emit = false;
					speed.current -= d / 500;
				}
				// if(ship.control.down) {
				// 	shipMesh.position.y -= d / 5;
				// 	camera.position.y -= d / 5;
				// }
				if(!ship.control.left && !ship.control.right && shipMesh.rotation.z !== 0) {
					if(shipMesh.rotation.z < 0) {
						shipMesh.rotation.z += d /500;
					}
					if(shipMesh.rotation.z > 0) {
						shipMesh.rotation.z -= d /500;
					}
					if(speed.sideways < 0) {
						speed.sideways += d / 800;
					}
					if(speed.sideways > 0) {
						speed.sideways -= d / 800;
					}
				}
				limit();
				shipMesh.position.y += speed.current;
				shipMesh.position.x += speed.sideways;
				camera.position.y += speed.current;

			}

		};
		window.ship = ship;
		Events.attach(ship);
		return ship;
	};
	return Ship;
});