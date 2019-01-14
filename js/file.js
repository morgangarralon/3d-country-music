var canvas;
var loader = new THREE.ImageLoader();

// load a image resource
loader.load(
    // resource URL
    "img/earth_color.jpg",

    // onLoad callback
    function ( image ) {
        // use the image, e.g. draw part of it on a canvas
        canvas = document.createElement( 'canvas' );
        context = canvas.getContext( '2d' );
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function () {
        console.error( 'An error happened.' );
    }
);

function getPixelColor(imagedata, x, y ) {
    var position = ( x * imagedata.height * y ) * 4
    var data = imagedata.data

    console.log(imagedata)

    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ] }
}

var speedEarth = .001;
var speedMoon = speedEarth/27;
var speedCloud = speedEarth/0.7;
var scene = new THREE.Scene();
var groupMoon = new THREE.Group();
var groupEarth = new THREE.Group();
var moonPanel = new THREE.Object3D();
var raycaster = new THREE.Raycaster();
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
document.body.appendChild(renderer.domElement);
cloud.scale.setScalar(1.03);
controls.maxDistance = 30;
groupEarth.add(groupMoon);
controls.minDistance = 2;
groupEarth.add(earth);
groupEarth.add(cloud);
selectionables.add(earth);
moonPanel.position.x = .75;
moonPanel.position.y = .75;
moon.add(moonPanel)
groupMoon.add(moon);

scene.add(groupEarth);
scene.add(selectionables);

scene.background = new THREE.CubeTextureLoader()
.setPath( 'img/' )
.load( [
    'cosmos_1.jpg',
    'cosmos_2.jpg',
    'cosmos_3.jpg',
    'cosmos_4.jpg',
    'cosmos_5.jpg',
    'cosmos_6.jpg'
] );
textureLoaderEarth.load("img/earth_color.jpg ", function(texture) {
    earth.material.map = texture;
    earth.material.needsUpdate = true;
})
textureLoaderEarth.load("img/earth_normal.jpg ", function(texture) {
    earth.material.normalMap = texture;
    earth.material.needsUpdate = true;
})
textureLoaderCloud.load("img/earth_cloud.jpg ", function(texture) {
    cloud.material.alphaMap = texture;
    cloud.material.needsUpdate = true;
})
textureLoaderMoon.load("img/moon_color.jpg ", function(texture) {
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

var raycaster = new THREE.Raycaster();

function getSelectionneLePlusProche(position) {
    raycaster.setFromCamera(position, camera);
    var selectionnes = raycaster.intersectObjects(selectionables.children);
    if (selectionnes.length) {
        return selectionnes[0];
    }
}

function onMouseClick(event) {
    var position = new THREE.Vector2();
    var domRect = renderer.domElement.getBoundingClientRect();
    position.x = (event.clientX / domRect.width) * 2 - 1 + domRect.left;
    position.y = - (event.clientY / domRect.height) * 2 + 1 + domRect.top;

    var object = getSelectionneLePlusProche(position);
    if(object) {
        console.log(loader)
        /* console.log(object);
        color = getPixelColor(imageData, 10, 10);
        console.log(color); */
        var pixelData = canvas.getContext('2d').getImageData(position.x, position.y, 1, 1).data; 
        console.log(pixelData)
        /* alert("Vous avez sélectionné l'objet " + object.name); */
    } else {
        alert("Vous n'avez rien sélectionné");
    };
}

renderer.domElement.addEventListener('click', onMouseClick);

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