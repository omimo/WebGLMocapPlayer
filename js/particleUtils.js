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