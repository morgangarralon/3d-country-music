import * as THREE from "three"
import { OrbitControls } from "OrbitControls"
import {
  loadPlanisphere,
  onMouseClick,
  onResize,
  onOffCanvas,
} from "./function.js"

const delta = 6
let mousePositionStartX
let mousePositionStartY

let sphere = null
let radiusEarth = 1.5
let isOpacityUp = true
let speedMoon = 0.0003
let speedCloud = 0.001
let scene = new THREE.Scene()
let groupMoon = new THREE.Group()
let groupEarth = new THREE.Group()
let selectables = new THREE.Group()
let renderer = new THREE.WebGLRenderer()
let textureLoaderMoon = new THREE.TextureLoader()
let textureLoaderEarth = new THREE.TextureLoader()
let textureLoaderCloud = new THREE.TextureLoader()
let ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
let onOffSwitch = document.getElementById("onoffswitch")
let pointLight = new THREE.DirectionalLight(0xffffff, 0.3)
let geometryEarth = new THREE.SphereGeometry(radiusEarth, 32, 32)
let directionalLight = new THREE.DirectionalLight(0xffdddd, 0.7)
let moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshPhongMaterial({ color: 0xffffff })
)
moon.name = "moon"
let earth = new THREE.Mesh(
  geometryEarth,
  new THREE.MeshPhongMaterial({ color: 0xffffff })
)
earth.name = "earth"
let cloud = new THREE.Mesh(
  geometryEarth,
  new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true })
)
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
)
let controls = new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById("renderer").appendChild(renderer.domElement)
cloud.scale.setScalar(1.03)
controls.maxDistance = 30
groupMoon.add(moon)
groupEarth.add(groupMoon)
controls.minDistance = 2
groupEarth.add(earth)
groupEarth.add(cloud)
selectables.add(earth)
selectables.add(moon)

scene.add(groupEarth)
scene.add(selectables)

scene.background = new THREE.CubeTextureLoader()
  .setPath("img/")
  .load([
    "cosmos_1.jpg",
    "cosmos_2.jpg",
    "cosmos_3.jpg",
    "cosmos_4.jpg",
    "cosmos_5.jpg",
    "cosmos_6.jpg",
  ])
textureLoaderEarth.load("img/earth_color.jpg", function (texture) {
  earth.material.map = texture
  earth.material.needsUpdate = true
})
textureLoaderEarth.load("img/earth_normal.jpg", function (texture) {
  earth.material.normalMap = texture
  earth.material.needsUpdate = true
})
textureLoaderCloud.load("img/earth_cloud.jpg", function (texture) {
  cloud.material.alphaMap = texture
  cloud.material.needsUpdate = true
})
textureLoaderMoon.load("img/moon_color.jpg", function (texture) {
  moon.material.map = texture
  moon.material.needsUpdate = true
})
scene.add(ambientLight)
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight)
pointLight.position.set(-2, 1, 1)
scene.add(pointLight)
camera.position.z = 8
moon.lookAt(earth.position)

window.addEventListener("resize", onResize)
onOffSwitch.addEventListener("click", onOffCanvas)
renderer.domElement.addEventListener("mousedown", (event) => {
  mousePositionStartX = event.pageX
  mousePositionStartY = event.pageY
})
renderer.domElement.addEventListener("mouseup", (event) => {
  const diffX = Math.abs(event.pageX - mousePositionStartX)
  const diffY = Math.abs(event.pageY - mousePositionStartY)

  if (diffX < delta && diffY < delta) {
    onMouseClick(event, camera, { selectables, geometryEarth, groupEarth })
  }
})

loadPlanisphere("img/earth_map.png")

function animate() {
  if (typeof groupEarth.children[2] != "undefined") {
    sphere = groupEarth.children[2]

    if (sphere.material.opacity <= 1 && isOpacityUp) {
      sphere.material.opacity = sphere.material.opacity + 0.2
    } else {
      sphere.material.opacity = sphere.material.opacity - 0.06
      isOpacityUp = false

      if (sphere.material.opacity <= 0.2) {
        isOpacityUp = true
      }
    }
  }
  cloud.rotateY(speedCloud)
  moon.rotateY(speedMoon)
  moon.position.set(0, 0, 0)
  moon.translateX(6)
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()
