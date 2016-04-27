jointmaterial =  new THREE.MeshLambertMaterial({
		color: 0xc57206,
		emissive: 0x271c18,
		side: THREE.DoubleSide,
		// shading: THREE.FlatShading,
		wireframe: false,
		shininess: 90,
	});

bonematerial = new THREE.MeshLambertMaterial({
		color: 0xbd9a6d,
		emissive: 0x271c18,
		side: THREE.DoubleSide,
		// shading: THREE.FlatShading,
		wireframe: false
	});

jointmaterial2 = new THREE.MeshPhongMaterial({
		color: 0x1562a2,
		emissive: 0x072554,
		//color: 0x302221,
		emissive: 0x501111,
		side: THREE.DoubleSide,
		// shading: THREE.FlatShading
	});

bonematerial2 = new THREE.MeshPhongMaterial({
		color: 0x552211,
		emissive: 0x551111,
		side: THREE.DoubleSide,
		// shading: THREE.FlatShading
	});

bonematerial3 = new THREE.MeshPhongMaterial({
		color: 0x176793,
		emissive: 0x000000,
		specular: 0x111111,
		shininess: 90,
		side: THREE.DoubleSide
	});

markermaterial =  new THREE.MeshPhongMaterial({
		color: 0xc57206,
		emissive: 0x271c18,
		side: THREE.DoubleSide,
		// shading: THREE.FlatShading,
		wireframe: false,
		shininess: 20,
	});

markermaterial2 =  new THREE.MeshPhongMaterial({
		color: 0x1562a2,
		emissive: 0x271c18,
		side: THREE.DoubleSide,
		// shading: THREE.FlatShading,
		wireframe: false,
		shininess: 20,
	});

markermaterial3 =  new THREE.MeshPhongMaterial({
		color: 0x555555,
		emissive: 0x999999,
		side: THREE.DoubleSide,
		// shading: THREE.FlatShading,
		wireframe: false,
		shininess: 20,
	});


var makeMarkerGeometry_Sphere10 = function (markerName, scale) {
	return new THREE.SphereGeometry(10,60,60);
};

var makeMarkerGeometry_Sphere3 = function (markerName, scale) {
	return new THREE.SphereGeometry(3,60,60);
};

var makeMarkerGeometry_SphereX = function (markerName, scale) {
	return new THREE.SphereGeometry(5,60,60);
};


var makeJointGeometry_Sphere1 = function (jointName, scale) {
	return new THREE.SphereGeometry(2/scale,60,60);
};

var makeJointGeometry_Sphere2 = function (jointName, scale) {
	return new THREE.SphereGeometry(1/scale,60,60);
};

var makeJointGeometry_Dode = function (jointName, scale) {
	return new THREE.DodecahedronGeometry(1/scale,0);
};

var makeBoneGeometry_Cylinder1 = function (joint1Name, joint2Name, length, scale) {
	return 	new THREE.CylinderGeometry(1.5/scale,0.7/scale,length,40);
};

var makeBoneGeometry_Cylinder2 = function (joint1Name, joint2Name, length, scale) {
	return 	new THREE.CylinderGeometry(1.5/scale,0.2/scale,length,40);
};

var makeBoneGeometry_Cylinder3 = function (joint1Name, joint2Name, length, scale) {
	var c1 = new THREE.CylinderGeometry(1.5/scale,0.2/scale,length/1,20);
	var c2 = new THREE.CylinderGeometry(0.2/scale,1.5/scale,length/1,40);

	var material = new THREE.MeshPhongMaterial({color: 0xF7FE2E}); 
	var mmesh = new THREE.Mesh(c1,material);
	mmesh.updateMatrix();
	c2.merge(mmesh.geometry, mmesh.matrix);
	return c2;
};

var makeBoneGeometry_Box1 = function (joint1Name, joint2Name, length, scale) {
	return 	new THREE.BoxGeometry(1/scale,length,1/scale,40);
};