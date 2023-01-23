import * as THREE from "three"
let textureLoaderEarthInBloom = new THREE.TextureLoader()
let textureEarthInBloom = textureLoaderEarthInBloom.load(
  "img/earth_colorv2.jpg"
)

let imageCanvas = new Image()

let canvasWrapper = document.getElementById("canvas-wrapper")
let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")
const settings = {
  max_width: 400,
  max_height: 230,
}

function resizeImage(img) {
  let canvasCopy = document.createElement("canvas")
  let contextCopy = canvasCopy.getContext("2d")
  let ratio = 1

  if (img.width > settings.max_width) ratio = settings.max_width / img.width
  else if (img.height > settings.max_height)
    ratio = settings.max_height / img.height

  canvasCopy.width = img.width
  canvasCopy.height = img.height
  contextCopy.drawImage(img, 0, 0)

  canvas.width = img.width * ratio
  canvas.height = img.height * ratio
  context.drawImage(
    canvasCopy,
    0,
    0,
    canvasCopy.width,
    canvasCopy.height,
    0,
    0,
    canvas.width,
    canvas.height
  )
}

export function loadPlanisphere(dataURL) {
  imageCanvas.onload = function () {
    resizeImage(this)
    extractDifferentColors()
  }
  imageCanvas.src = dataURL
}

function extractDifferentColors() {
  let pixels = []

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      let pixel = context.getImageData(i, j, 1, 1).data
      if (
        typeof pixels[pixel[0]] == "undefined" &&
        (pixel[0] === 0 || pixel[0] === 255)
      ) {
        pixels[pixel[0]] = []
      }
      if (
        typeof pixels[pixel[0]] != "undefined" &&
        typeof pixels[pixel[0]][pixel[1]] == "undefined" &&
        (pixel[1] === 0 || pixel[1] === 255)
      ) {
        pixels[pixel[0]][pixel[1]] = []
      }
      if (
        typeof pixels[pixel[0]] != "undefined" &&
        typeof pixels[pixel[0]][pixel[1]] != "undefined" &&
        typeof pixels[pixel[0]][pixel[1]] != "undefined" &&
        (pixel[2] === 0 || pixel[2] === 255) &&
        pixel[2] != "undefined"
      ) {
        pixels[pixel[0]][pixel[1]][pixel[2]] = "./audio/file.mp3"
      }
    }
  }

  return pixels
}

function getPositionOnObject(selected, camera) {
  let vector = new THREE.Vector3()
  selected.object.getWorldPosition(vector).project(camera)
  vector = selected.uv

  return vector
}

function getSelected(position, camera, selectables) {
  let selectedIndex = -1
  let raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(position, camera)
  let selecteds = raycaster.intersectObjects(selectables.children)

  selecteds.forEach(function (selected, key) {
    let selectedName = selected.object.name
    if (selectedName === "earth") {
      selectedIndex = key
    } else if (selectedName === "moon") {
      selectedIndex = key
    }
  })

  if (selectedIndex !== -1) {
    return selecteds[selectedIndex]
  } else {
    return null
  }
}

function getPositionOnCanvas(objectTexture, positionOnObject) {
  let image = new THREE.Vector2()

  image.x = Math.round(positionOnObject.x * objectTexture.image.width)
  image.y = Math.round(positionOnObject.y * objectTexture.image.height)

  return image
}

function getPixelFromTexture(objectTexture, positionOnObject) {
  let image = new THREE.Vector2()

  image.x = Math.round(positionOnObject.x * canvas.width)
  image.y = Math.round((1 - positionOnObject.y) * canvas.height)

  let imageData = context.getImageData(image.x, image.y, 1, 1)

  let pixel = imageData.data

  return pixel
}

export function onMouseClick(event, camera, payloadEarth) {
  let position = new THREE.Vector2()
  let { selectables, geometryEarth, groupEarth } = payloadEarth
  let domRect = renderer.getBoundingClientRect()
  position.x = (event.clientX / domRect.width) * 2 - 1 + domRect.left
  position.y = -(event.clientY / domRect.height) * 2 + 1 + domRect.top
  let selected = getSelected(position, camera, selectables)

  if (selected && typeof selected.object != "undefined") {
    let selectedName = selected.object.name
    if (selectedName === "earth") {
      let positionOnObject = getPositionOnObject(selected, camera)
      let positionOnCanvas = getPositionOnCanvas(
        textureEarthInBloom,
        positionOnObject
      )
      let inBloomPixel = getPixelFromTexture(
        textureEarthInBloom,
        positionOnObject
      )
      drawCircle(textureEarthInBloom, positionOnCanvas)
      playMusic(selectedName, inBloomPixel)
      drawSphere(selected, geometryEarth, groupEarth)
    } else if (selectedName === "moon") {
      playMusic(selectedName)
    }
  } else {
    playMusic()
  }
}

function drawSphere(selected, geometryEarth, groupEarth) {
  let sphere = new THREE.Mesh(
    geometryEarth,
    new THREE.MeshPhongMaterial({ color: 0x341d2f, transparent: true })
  )

  sphere.scale.set(0.04, 0.04, 0.04)
  sphere.position.set(selected.point.x, selected.point.y, selected.point.z)
  for (let i = 2; i < groupEarth.children.length; i++) {
    groupEarth.remove(groupEarth.children[i])
  }
  let i = 1
  let timer = setInterval(function () {
    if (i % 10 === 0) {
      sphere.material.opacity = (100 - i) / 100
    }
  }, 10)
  setTimeout(() => {
    clearInterval(timer)
    groupEarth.remove(sphere)
  }, 1000)
  groupEarth.add(sphere)
}

function drawCircle(objectTexture, positionOnCanvas) {
  let div = document.createElement("div")
  div.innerText = "o"
  div.setAttribute("class", "circle-on-plan")
  let positionx =
    (positionOnCanvas.x / objectTexture.image.width) * canvas.width
  let positiony =
    canvas.height -
    (positionOnCanvas.y / objectTexture.image.height) * canvas.height
  div.setAttribute("style", "left:" + positionx + "px; top:" + positiony + "px")

  document.getElementById("canvas-wrapper").appendChild(div)
}

export function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function playMusic(selectedName = null, pixel = null) {
  let audio = document.getElementById("audio")
  audio.src = "./audio/file.mp3"

  if (selectedName === "moon") {
    audio.src = "./audio/moon.mp3"
  } else if (selectedName === "earth" && pixel.length === 4) {
    let r = pixel[0]
    let g = pixel[1]
    let b = pixel[2]
    let a = pixel[3]

    if (!a) {
      //ocean
      audio.src = "./audio/ocean.mp3"
    } else if (g === 255 && r === 0 && b === 0) {
      audio.src = "./audio/africa.mp3"
    } else if (r === 255 && g === 0 && b === 0) {
      audio.src = "./audio/north_america.mp3"
    } else if (r === 0 && g === 0 && b === 255) {
      audio.src = "./audio/europe.mp3"
    } else if (r === 0 && g === 0 && b === 0) {
      audio.src = "./audio/south_america.mp3"
    } else if (r === 255 && g === 255 && b === 255) {
      audio.src = "./audio/asia.mp3"
    }
  } else {
    audio.src = "./audio/milky_way.mp3"
  }

  if (audio.src !== "./audio/file.mp3") {
    audio.play()
  }
}

export function onOffCanvas(event) {
  let onOffSwitch = event.target
  if (onOffSwitch.classList.contains("toggle-on")) {
    canvasWrapper.style.display = "none"
  } else {
    canvasWrapper.style.display = "block"
  }
}
