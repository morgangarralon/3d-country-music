var textureLoaderEarthInBloom = new THREE.TextureLoader();
var textureEarthInBloom = textureLoaderEarthInBloom.load('img/earth_colorv2.jpg');


var imageCanvas = new Image();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasImageRatio = 0.05
var settings = {
    max_width: 600,
    max_height: 200
  }


var imageCanvas2 = new Image();
var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext('2d');
var canvasImageRatio2 = 0.05
var settings2 = {
    max_width: 600,
    max_height: 200
  }

// document.body.appendChild(canvas);



var speedEarth = .001;
var speedMoon = speedEarth/27;
var speedCloud = speedEarth/0.7;
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
var geometryEarth = new THREE.SphereGeometry(1.5, 32, 32);
var directionalLight = new THREE.DirectionalLight(0xffdddd, .7);
var moon = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshPhongMaterial({color: 0xffffff}));
var earth = new THREE.Mesh(geometryEarth,
            new THREE.MeshPhongMaterial({color: 0xffffff}));
            earth.name = "earth"
var cloud = new THREE.Mesh(geometryEarth,
            new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true}));
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
var controls = new THREE.OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('renderer').appendChild(renderer.domElement);
cloud.scale.setScalar(1.03);
controls.maxDistance = 30;
groupEarth.add(groupMoon);
controls.minDistance = 2;
groupEarth.add(earth);
groupEarth.add(cloud);
selectionables.add(earth);
groupMoon.add(moon);

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

renderer.domElement.addEventListener('click', onMouseClick);

loadCanvas('img/earth_color.jpg');
loadPlanisphere('img/earth_color.jpg');


function animate() {
    earth.rotateY(speedEarth);
    cloud.rotateY(speedCloud);
    moon.rotateY(speedMoon);
    moon.position.set(0, 0, 0);
    moon.translateX(6);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();