var wmp = wmp || {};
wmp.BVHCharacter = wmp.BVHCharacter || {};

wmp.BVHCharacter = function(n, jm, bm, jg, bg){
	this.name = n;
	
	this.jointMaterial = jm;
	this.boneMaterial = bm;
	this.makeJointGeometryFCN = jg;
	this.makeBoneGeometryFCN = bg;

	this.originPosition = new THREE.Vector3(0,0,0);

	this.bvh = [];
	this.ready = false;
	this.skelScale = 1;
	this.jointMeshes = [];
	this.boneMeshes = [];
	this.rootMeshes = [];


	this.frameTime = 1/30;
	this.frameCount = 0;
	this.animIndex = 0;
	this.animStartTimeRef = 0;
	this.animOffset = 0;
	this.playing = true;

	this.debug = true;

	var self = this;

	//

	this.log = function(m) {
		if (self.debug)
			console.log(self.name + ": "+m.toString());
	};

	this.loadFromURL = function(url, callback) {
		self.log("Loading the mocap file ...");
		Pace.start();
		reader = new BVHReader(this.name+"READER");
		this.url = url;
		reader.load(url, function (data) {
			self.bvh = data;
			self.frameCount = data.frameCount;
			self.frameTime = data.frameTime;

			self.log("Mocap file loaded.");

			self.log("Creating the WebGL Joints.");
			self.buildSkelJoints(self.bvh.getSkeleton(),0);

			self.log("Creating the WebGL Bones.");
			(self.buildSkelBones(self.jointMeshes[0])).forEach(function (c){
				self.rootMeshes.push(c);
				scene.add(c);
			});				
			scene.add(self.jointMeshes[0]);
			self.setSkeletonScale(self.skelScale);
			self.log("Ready!");
			self.ready = true;
			if (callback)
				callback();
		});
	};

	this.setOriginPosition = function (x, y, z) {
		self.originPosition.set(x,y,z);
	};

	this.setSkeletonScale = function(s) {
		self.rootMeshes.forEach(function (c) {
			c.scale.set(s,s,s);
		});
		self.jointMeshes[0].scale.set(s,s,s);
		self.jointMeshes[0].position.multiplyScalar(s);
	};

	this.buildSkelJoints = function (joint, parent) {
		var jointMesh = new THREE.Mesh(self.makeJointGeometryFCN(joint.name, self.skelScale), self.jointMaterial);
		jointMesh.bvhIndex = joint.jointIndex;
		jointMesh.offsetVec = new THREE.Vector3(joint.offset[0],joint.offset[1],joint.offset[2]);
		jointMesh.name = joint.name;
		jointMesh.jointparent = parent;
		var a,b,c;
				if (!joint.isEndSite()) {
					a = joint.channelNames[joint.channelNames.length - 3][0];
					b = joint.channelNames[joint.channelNames.length - 2][0];
					c = joint.channelNames[joint.channelNames.length - 1][0];
				}
		jointMesh.rotOrder = a+b+c;
		self.jointMeshes.push(jointMesh);
	
		joint.children.forEach(function (child) {
			jointMesh.add(self.buildSkelJoints(child, 1));
		});

		return jointMesh;
	};

	this.buildSkelBones = function (jointMesh) {
		var bones = [];
		jointMesh.children.forEach(function (childMesh) {
			// if (typeof childMesh.bvhIndex !== "undefined")
			{
				if (typeof childMesh.bvhIndex === "undefined")
					return;
				// move origin (.translate)
				// rotate
				// translate (offset + position)
				h = math.abs(childMesh.offsetVec.length());
				var bgeometry = self.makeBoneGeometryFCN("",childMesh.name,h,self.skelScale);

//Begin - Working for MS				
			    if (childMesh.offsetVec.x < 0)
					bgeometry.rotateZ(3*math.pi/2);
				else if (childMesh.offsetVec.x > 0)
					bgeometry.rotateZ(-3*math.pi/2);

				if (childMesh.offsetVec.z < 0)
					bgeometry.rotateX(3*math.pi/2);
				else if (childMesh.offsetVec.z > 0)
					bgeometry.rotateX(-3*math.pi/2);

				bgeometry.translate(childMesh.offsetVec.x/2, childMesh.offsetVec.y/2, childMesh.offsetVec.z/2 );

//END - Working for MS


				var boneMesh = new THREE.Mesh(bgeometry, self.boneMaterial);	
				boneMesh.joint = jointMesh;
				boneMesh.name = jointMesh.name + " > " + childMesh.name;
				self.boneMeshes.push(boneMesh);
				// scene.add(boneMesh);
				bones.push(boneMesh);		

				(self.buildSkelBones(childMesh)).forEach(function (b) {
					boneMesh.add(b);
				});				
			}
		});	
		return bones;		
		};

	this.animFrame = function (frame) {
	this.jointMeshes[0].traverse(function (joint) {
		if (typeof joint.bvhIndex === "undefined")
			return;

		var bj = self.bvh.jointArray[joint.bvhIndex];

		var offsetVec = joint.offsetVec;
		var torad = Math.PI / 180;
		var thisEuler = [];

		if (joint.jointparent != 0) {
		 thisEuler = new THREE.Euler(
			(bj.channels[frame][bj.rotationIndex.x] * torad),
			(bj.channels[frame][bj.rotationIndex.y] * torad),
			(bj.channels[frame][bj.rotationIndex.z] * torad),joint.rotOrder);
		} else {
		 thisEuler = new THREE.Euler(
			(bj.channels[frame][bj.rotationIndex.x] * torad),
			(bj.channels[frame][bj.rotationIndex.y] * torad),
			(bj.channels[frame][bj.rotationIndex.z] * torad),joint.rotOrder);	
		}

		joint.localRotMat = new THREE.Matrix4();
		joint.localRotMat.makeRotationFromEuler(thisEuler);
		joint.rotation.setFromRotationMatrix(joint.localRotMat);

		if (joint.jointparent != 0) {					
			joint.position.set(offsetVec.x, offsetVec.y, offsetVec.z);
		} else { // root
			joint.position.set(
				bj.positions[frame][0] * self.skelScale + self.originPosition.x,
				bj.positions[frame][1] * self.skelScale + self.originPosition.y,
				bj.positions[frame][2] * self.skelScale + self.originPosition.z);
		}
	});

	this.rootMeshes.forEach(function(rootMesh) {
		rootMesh.traverse(function(bone,index) {
		var bj = self.bvh.jointArray[bone.joint.bvhIndex];

		var offsetVec = new THREE.Vector3(bj.offset[0],bj.offset[1],bj.offset[2]);
		
		bone.rotation.copy(bone.joint.rotation);//setFromRotationMatrix(bone.joint.localRotMat);				

		if ( bone.parent.type === "Scene")  //root
		{
			bone.position.set(bj.positions[frame][0] * self.skelScale + self.originPosition.x,
						  bj.positions[frame][1] * self.skelScale + self.originPosition.y,
						  bj.positions[frame][2] * self.skelScale + self.originPosition.z);
		} else {
			bone.position.set(offsetVec.x,
							offsetVec.y,
							offsetVec.z);
		}

	});
	});
	};
};