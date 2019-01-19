let camera, scene, renderer;

let box;

const radius = 0.6;

const sphericalStart = new THREE.Spherical();
const sphericalEnd = new THREE.Spherical();
const sphericalCurrent = new THREE.Spherical();

const center = new THREE.Vector3();

const source = {
    phi: 0,
    theta: 0
};
const target = {
    phi: 0,
    theta: 0
};

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 2;

    scene = new THREE.Scene();

    // spheresample

    const sphereGeometry = new THREE.SphereBufferGeometry(radius, 16, 12);
    const sphereMaterial = new THREE.MeshBasicMaterial({ wireframe: true });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // box

    const boxGeometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.4);
    boxGeometry.translate(0, 0, - 0.2);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // animation

    initAnimation();

    const tween = new TWEEN.Tween(source).to(target, 1000).delay(100).onUpdate(
        function () {
            sphericalCurrent.set(radius, source.phi, source.theta);
            box.position.setFromSpherical(sphericalCurrent);
            box.lookAt(center);
        }
    ).onComplete(initAnimation);
    tween.chain(tween);
    tween.start();

}

function animate() {

    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);

}

function initAnimation() {

    sphericalStart.copy(sphericalEnd);
    sphericalEnd.set(radius, THREE.Math.randFloat(0, Math.PI), THREE.Math.randFloat(0, Math.PI * 2));
    sphericalEnd.makeSafe();

    source.phi = sphericalStart.phi;
    source.theta = sphericalStart.theta;

    target.phi = sphericalEnd.phi;
    target.theta = sphericalEnd.theta;

}