var textureLoaderEarthInBloom = new THREE.TextureLoader();
var textureEarthInBloom = textureLoaderEarthInBloom.load('img/earth_colorv2.jpg');

var imageCanvas = new Image();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasImageRatio = 0.05
const settings = {
    max_width: 400,
    max_height: 230
}

var sphere = null;
var speedEarth = .001;
var radiusEarth = 1.5;
var isOpacityUp = true;
var speedMoon = .0003/*speedEarth/27*/;
var speedCloud = .001/*speedEarth/0.7*/;
var scene = new THREE.Scene();
var groupMoon = new THREE.Group();
var groupEarth = new THREE.Group();
var selectionables = new THREE.Group();
var renderer = new THREE.WebGLRenderer();
var textureLoaderMoon = new THREE.TextureLoader();
var textureLoaderEarth = new THREE.TextureLoader();
var textureLoaderCloud = new THREE.TextureLoader();
var ambientLight = new THREE.AmbientLight(0xffffff, .1);
var pointLight = new THREE.DirectionalLight(0xffffff, .3);
var geometryEarth = new THREE.SphereGeometry(radiusEarth, 32, 32);
var directionalLight = new THREE.DirectionalLight(0xffdddd, .7);
var moon = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshPhongMaterial({color: 0xffffff}));
    moon.name = "moon";
var earth = new THREE.Mesh(geometryEarth,
            new THREE.MeshPhongMaterial({color: 0xffffff}));
    earth.name = "earth";
var cloud = new THREE.Mesh(geometryEarth,
            new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true}));
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// var objectLoad = new THREE.OBJLoader();
// objectLoad.load(
// 	'model/africa.obj',
// 	function (object) {
//         var groupPoint = new THREE.Group();
//         object.scale.setScalar(.002);
//         object.translateX(1.3);
//         object.rotateZ(180.5);
//         groupPoint.add(object);
// 		scene.add(groupPoint);
// 	},
// 	function (xhr) {
// 		console.log( (xhr.loaded/xhr.total * 100) + '% loaded');
// 	},
// 	function (error) {
// 		console.log('An error happened');
// 	}
// );

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('renderer').appendChild(renderer.domElement);
cloud.scale.setScalar(1.03);
controls.maxDistance = 30;
groupMoon.add(moon);
groupEarth.add(groupMoon);
controls.minDistance = 2;
groupEarth.add(earth);
groupEarth.add(cloud);
selectionables.add(earth);
selectionables.add(moon);

scene.add(groupEarth);
scene.add(selectionables);

scene.background = new THREE.CubeTextureLoader()
    .setPath( 'img/' )
    .load([
        'cosmos_1.jpg',
        'cosmos_2.jpg',
        'cosmos_3.jpg',
        'cosmos_4.jpg',
        'cosmos_5.jpg',
        'cosmos_6.jpg'
]);
textureLoaderEarth.load('img/earth_color.jpg', function(texture) {
    earth.material.map = texture;
    earth.material.needsUpdate = true;
})
textureLoaderEarth.load('img/earth_normal.jpg', function(texture) {
    earth.material.normalMap = texture;
    earth.material.needsUpdate = true;
})
textureLoaderCloud.load('img/earth_cloud.jpg', function(texture) {
    cloud.material.alphaMap = texture;
    cloud.material.needsUpdate = true;
})
textureLoaderMoon.load('img/moon_color.jpg', function(texture) {
    moon.material.map = texture;
    moon.material.needsUpdate = true;
})
scene.add(ambientLight);
directionalLight.position.set(1,1,1);
scene.add(directionalLight);
pointLight.position.set(-2,1,1);
scene.add(pointLight);
camera.position.z = 8;
moon.lookAt(earth.position);

window.addEventListener('resize', onResize);
renderer.domElement.addEventListener('click', onMouseClick);

loadPlanisphere('img/earth_map.png');

function animate() {
    if(typeof groupEarth.children[2] != "undefined") {
        sphere = groupEarth.children[2];

        if(sphere.material.opacity <= 1 && isOpacityUp) {
            sphere.material.opacity = sphere.material.opacity + .2;
        } else {
            sphere.material.opacity = sphere.material.opacity - .06;
            isOpacityUp = false;

            if(sphere.material.opacity <= .2) {
                isOpacityUp = true;
            }
            
        } 
    }
    // earth.rotateY(speedEarth);
    // groupEarth.rotateY(speedEarth);
    cloud.rotateY(speedCloud);
    moon.rotateY(speedMoon);
    moon.position.set(0, 0, 0);
    moon.translateX(6);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();