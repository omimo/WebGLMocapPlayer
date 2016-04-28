function setParticleSystem() {
			console.log("Setting the particle system options.");
			// options passed during each spawned
			options1 = {
				position: new THREE.Vector3(),
				positionRandomness: .9,
				velocity: new THREE.Vector3(),
				velocityRandomness: .5,
				color: 0xaa88ff,
				colorRandomness: .2,
				turbulence: .5,
				lifetime: 10,
				size: 2,
				sizeRandomness: 1
			};
			
			spawnerOptions1 = {
				spawnRate: 2000,
				horizontalSpeed: 1.5,
				verticalSpeed: 1.33,
				timeScale: 1
			}
			
			options2 = {
				position: new THREE.Vector3(),
				positionRandomness: .9,
				velocity: new THREE.Vector3(),
				velocityRandomness: .5,
				color: 0xaa8844,
				colorRandomness: .1,
				turbulence: .5,
				lifetime: 4,
				size: 3,
				sizeRandomness: 1
			};
			
			spawnerOptions2 = {
				spawnRate: 2000,
				horizontalSpeed: 1.5,
				verticalSpeed: 1.33,
				timeScale: 0.5
			}
		}

		function addPS(joint,c) {
			particleSystem = new THREE.GPUJointParticleSystem({
				maxParticles: 25000
			});
			particleSystem.joint = joint;
			c.particleSystems.push(particleSystem);
			scene.add(particleSystem);
		}

		function setPSCharacter(c) {
			c.particleSystems = [];
			c.jointMeshes[0].traverse(function(joint) {
				if (typeof joint.bvhIndex === "undefined")
					return;

				addPS(joint,c);
			});
		}