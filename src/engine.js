var cameraPosition = [0, 80, 300];

var envmap = [
	'assets/cubemap/CornellBox'
];

var guiParams = {
	envmapId: 0
}

var cubeMaps = [];

var resolution = 2048;
let brdflut, eavglut;
let envMapPass = null;
let bouns = 1;
GAMES202Main();	
async function GAMES202Main() {
	// Init canvas and gl
	const canvas = document.querySelector('#glcanvas');
	canvas.width = window.screen.width;
	canvas.height = window.screen.height;
	const gl = canvas.getContext('webgl');
	gl.getExtension("EXT_frag_depth");
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	// Add camera

	const camera = new THREE.PerspectiveCamera(75, gl.canvas.clientWidth / gl.canvas.clientHeight, 1e-2, 1000000);
	camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

	// Add resize listener
	function setSize(width, height) {
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
	setSize(canvas.clientWidth, canvas.clientHeight);
	window.addEventListener('resize', () => setSize(canvas.clientWidth, canvas.clientHeight));
	camera.up.set(0,-1,0)
	// Add camera control
	const cameraControls = new THREE.OrbitControls(camera, canvas);
	cameraControls.enableZoom = true;
	cameraControls.enableRotate = true;
	cameraControls.enablePan = true;
	cameraControls.rotateSpeed = 0.3;
	cameraControls.zoomSpeed = 1.0;
	cameraControls.panSpeed = 0.8;
	cameraControls.target.set(0, 0, 0);

	// Add renderer
	const renderer = new WebGLRenderer(gl, camera);

	// Add lights
	// light - is open shadow map == true
	// let lightPos = [0, 50, 100];
	let lightPos = [0, -50, -50];
	let lightPosInv = [0, 50,-100];
	let lightRadiance = [25, 25, 25];
	// let lightRadiance = [500,500,500];

	let lightRadianceNerfed = [0.01,0.01,0.01];
	lightDir = {
		'x': 0,
		'y': 0,
		'z': 0,
	};
	let lightUp = [1, 0, 0];

	Lights.addLight([0,350,-500],[70,70,70]);
	Lights.addLight(lightPos,lightRadiance);
	Lights.addLight([0,-100,-50],lightRadiance);
	Lights.addLight([0,-150,-50],lightRadiance);
	Lights.addLight([0,0,50],lightRadiance);
	Lights.addLight([0,0,-50],lightRadiance);
	// Lights.addLight([0, 500, 500],lightRadiance);
	// Lights.addLight(lightPosInv,lightRadiance);

	// for(let i = -200;i <= 200;i+=20) 
	// Lights.addLight([3000,i,10],lightRadianceNerfed);

	// for(let i = -200;i <= 200;i+=20) 
	// Lights.addLight([-3000,i,10],lightRadianceNerfed);
	const directionLight = 
	new DirectionalLight(lightRadiance, lightPos, lightDir, lightUp, renderer.gl);
	renderer.addLight(directionLight);

	// directionLight = new DirectionalLight(lightRadiance, lightPos2, lightDir, lightUp, renderer.gl);
	// renderer.addLight(directionLight);


	// Lights.addLight([0,0,0],[0,0,-1]);
	// Add Sphere
	let img = new Image(); // brdfLUT
	img.src = 'assets/ball/GGX_E_LUT.png';
	var loadImage = async img => {
		return new Promise((resolve, reject) => {
			img.onload = async () => {
				console.log("Image Loaded");
				resolve(true);
			};
		});
	};
	await loadImage(img);
	brdflut = new Texture();
	brdflut.CreateImageTexture(gl, img);

	let img1 = new Image(); // eavgLUT
	img1.src = 'assets/ball/GGX_Eavg_LUT.png';
	var loadImage = async img => {
		return new Promise((resolve, reject) => {
			img.onload = async () => {
				console.log("Image Loaded");
				resolve(true);
			};
		});
	};
	await loadImage(img1);
	eavglut = new Texture();
	eavglut.CreateImageTexture(gl, img1);

	let metallic = 1.0;
	// let Sphere0Transform = setTransform(180, 60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'KullaContyMaterial', Sphere0Transform, metallic, 0.15);
	// let Sphere1Transform = setTransform(100, 60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'KullaContyMaterial', Sphere1Transform, metallic, 0.35);
	// let Sphere2Transform = setTransform(20, 60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'KullaContyMaterial', Sphere2Transform, metallic, 0.55);
	// let Sphere3Transform = setTransform(-60, 60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'KullaContyMaterial', Sphere3Transform, metallic, 0.75);
	// let Sphere4Transform = setTransform(-140, 60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'KullaContyMaterial', Sphere4Transform, metallic, 0.95);
	

	//Tag 护手
	let tmpTrans = setTransform(0,-5,5,50,65,60,0,Math.PI/2,0);
	loadOBJ(renderer,'assets/testObj/','untitled','PBRMaterial',tmpTrans,metallic,0.9);

	let tmpTrans2 = setTransform(0,-90,5,4.6,30,1.4,0,0,0);
	loadOBJ(renderer,'assets/testObj/','bing','PBRMaterial',tmpTrans2,metallic,0.9);
	// Tag end


	// let Sphere5Transform = setTransform(7, 250, 5, 7, 250, 1, 0, Math.PI, 0);
	// let Sphere52Transform = setTransform(-7, 250, 5, 0.7, 250, 0.1, 0, Math.PI, 0);
	
	// // loadGLTF(renderer, 'assets/ball/', 'ball', 'PBRMaterial', Sphere5Transform, metallic, 0.15);
	// //0.61,0.2);0.1 ,0.17);
	// loadOBJ(renderer, 'assets/testObj/', 'di', 'anistropicMaterial', Sphere5Transform, metallic,0.1 ,0.17);
	// loadOBJ(renderer, 'assets/testObj/', 'ren', 'anistropicMaterial', Sphere52Transform, metallic,0.2,1);

	let Sphere5Transform = setTransform(9, 500, 5, 18/7.188224, 150, 1, 0, Math.PI, 0);
	let Sphere52Transform = setTransform(-9, 500, 5, 18/7.188224, 150, 0.5, 0, Math.PI, 0);
	
	//Tag sword
	loadOBJ(renderer, 'assets/testObj/', 'testObj', 'anistropicMaterial', Sphere5Transform, metallic, 0.17,0.1);
	loadOBJ(renderer, 'assets/testObj/', 'testObj', 'anistropicMaterial', Sphere52Transform, metallic, 0.4, 0.61);
	//end Tag

	// genTwist(renderer);
	
	// genTwist(renderer,[0,0,0],[100,0,0],1);
	// genTwist(renderer,[100,0,0],[150,50,0],1);
	// genTwist(renderer,[0,20,0],[100,20,0],1);
	// genTwist(renderer,[100,20,0],[150,70,0],1);
	// genTwist(renderer,[],[]);
	// genTwist(renderer,[],[]);


	// let Sphere6Transform = setTransform(100, -60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'PBRMaterial', Sphere6Transform, metallic, 0.35);
	// let Sphere7Transform = setTransform(20, -60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'PBRMaterial', Sphere7Transform, metallic, 0.55);
	// let Sphere8Transform = setTransform(-60, -60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'PBRMaterial', Sphere8Transform, metallic, 0.75);
	// let Sphere9Transform = setTransform(-140, -60, 0, 180, 180, 180, 0, Math.PI, 0);
	// loadGLTF(renderer, 'assets/ball/', 'ball', 'PBRMaterial', Sphere9Transform, metallic, 0.95);
	// Add SkyBox
	for (let i = 0; i < envmap.length; i++) {
		let urls = [
			envmap[i] + '/negx.jpg',
			envmap[i] + '/posx.jpg',
			// envmap[i] + '/blue.png',
			// envmap[i] + '/yellow.png',
			envmap[i] + '/negy.jpg',
			// envmap[i] + '/ice.png',
			
			envmap[i] + '/negy.jpg',
			// envmap[i] + '/blue.png',
			envmap[i] + '/posz.jpg',
			envmap[i] + '/negz.jpg',
			
		];
		cubeMaps.push(new CubeTexture(gl, urls))
		await cubeMaps[i].init();
	}
	let skyBoxTransform = setTransform(0, 50, 50, 1500, 1500, 1500);
	loadOBJ(renderer, 'assets/testObj/', 'testObj', 'SkyBoxMaterial', skyBoxTransform);


	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	// genTwistByR(renderer,1,7);
	THETA = [0,0,0,0];
	THETA2 = [0,0,0,0];

	let quq = genTwistByR(renderer,1,7,10);
	let quq2 = genTwistByR3(renderer,1,7,10); 
	

	for(let i = 1;i<=11;i++)
	{
		quq2 = genTwistByR4(renderer,1,7,10,quq2);
		quq2 = genTwistByR3(renderer,1,7,10,quq2);
		quq = genTwistByR2(renderer,1,7,10,quq);
		quq = genTwistByR(renderer,1,7,10,quq);
	}

	// genCircleTwist(renderer,1,[-8*2+2,-1,22],5/4,7,[-Math.PI/2,Math.PI,0]);
	// genTwist(renderer);

	function createGUI() {
		const gui = new dat.gui.GUI();
		const panelModel = gui.addFolder('Switch Environemtn Map');
		panelModel.add(guiParams, 'envmapId', { 'CornellBox':0}).name('Envmap Name');
		
		panelModel.open();
	}

	createGUI();
	var cnt = 0;
	function mainLoop() {
		// console.log(cnt++);
		cameraControls.update();

		renderer.render();

		requestAnimationFrame(mainLoop);
	}
	console.log("Start!!");
	requestAnimationFrame(mainLoop);
}

function setTransform(t_x, t_y, t_z, s_x, s_y, s_z, r_x = 0, r_y = 0, r_z = 0) {
	return {
		modelTransX: t_x,
		modelTransY: t_y,
		modelTransZ: t_z,
		modelScaleX: s_x * bouns,
		modelScaleY: s_y * bouns,
		modelScaleZ: s_z * bouns,
		modelRotateX: r_x,
		modelRotateY: r_y,
		modelRotateZ: r_z,
	};
}