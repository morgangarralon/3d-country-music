function getPositionOnScreen(camera, object3d) {
    var vector = new THREE.Vector3()
    
    object3d.getWorldPosition(vector).project(camera)
    vector.x = Math.round((vector.x + 1) / 2 * window.innerWidth)
    vector.y = Math.round(-(vector.y - 1) / 2 * window.innerHeight)
  
    return vector
}

function resizeImage(img){
    var canvasCopy = document.createElement("canvas")
    var contextCopy = canvasCopy.getContext("2d")
    
    if(img.width > settings.max_width)
        ratio = settings.max_width / img.width
    else if(img.height > settings.max_height)
        ratio = settings.max_height / img.height
  
    canvasCopy.width = img.width
    canvasCopy.height = img.height
    contextCopy.drawImage(img, 0, 0)
  
    canvas.width = img.width * ratio
    canvas.height = img.height * ratio
    context.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height)
}

function loadPlanisphere(dataURL) {
  imageCanvas.onload = function() {
    resizeImage(this);

    differentColors = extractDifferentColors();
  };
  imageCanvas.src = dataURL;
}

function extractDifferentColors() {
    pixels = [];

    for(i = 0; i < canvas.width; i++) {
        for(j = 0; j < canvas.height; j++) {
            pixel = context.getImageData(i, j, 1, 1).data;
            if(typeof pixels[pixel[0]] == "undefined"
               && (pixel[0] === 0 || pixel[0] === 255)) {
                pixels[pixel[0]] = [];
            }
            if(typeof pixels[pixel[0]] != "undefined"
               && typeof pixels[pixel[0]][pixel[1]] == "undefined"
               && (pixel[1] === 0 || pixel[1] === 255)) {
                pixels[pixel[0]][pixel[1]] = [];
            }
            if(typeof pixels[pixel[0]] != "undefined"
               && typeof pixels[pixel[0]][pixel[1]] != "undefined"
               && typeof pixels[pixel[0]][pixel[1]] != "undefined"            
               && (pixel[2] === 0 || pixel[2] === 255) && pixel[2] != "undefined") {
                pixels[pixel[0]][pixel[1]][pixel[2]] = './audio/file.mp3';
            }
        }
    }

    return pixels;
}

function getPositionOnObject(selected) {
    var vector = new THREE.Vector3();

    selected.object.getWorldPosition(vector).project(camera)
    vector = selected.uv
  
    return vector;
}

function getSelected(position) {
    var selectedIndex = -1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(position, camera);
    var selecteds = raycaster.intersectObjects(selectionables.children);
    
    selecteds.forEach(function(selected, key) {
        var selectedName = selected.object.name;

        if(selectedName === "earth") {
            selectedIndex = key;
        } else if(selectedName === "moon") {
            selectedIndex = key;
        } 
    });

    if(selectedIndex !== -1) {
        return selecteds[selectedIndex];
    } else {
        return null;
    }
}

function getPositionOnCanvas(objectTexture, positionOnObject){
    var image = new THREE.Vector2()

    image.x = Math.round(positionOnObject.x * objectTexture.image.width)
    image.y = Math.round(positionOnObject.y * objectTexture.image.height)

    return image;
}

function getPixelFromTexture(objectTexture, positionOnObject) {
    var image = new THREE.Vector2()

    image.x = Math.round(positionOnObject.x * canvas.width)
    image.y = Math.round((1 - positionOnObject.y) * canvas.height)

    var imageData = context.getImageData(image.x, image.y, 1, 1);

    var pixel = imageData.data;

    var r = pixel[0]
    var g = pixel[1]
    var b = pixel[2]
    var a = pixel[3]

    return pixel
}

function onMouseClick(event) {
    var position = new THREE.Vector2();
    var domRect = renderer.domElement.getBoundingClientRect();
    position.x = (event.clientX / domRect.width) * 2 - 1 + domRect.left;
    position.y = - (event.clientY / domRect.height) * 2 + 1 + domRect.top;
    var selected = getSelected(position);

    console.log(selected);

    if(selected && typeof selected.object != "undefined") {
        var selectedName = selected.object.name;
    
        if(selectedName === "earth") {
            var positionOnObject = getPositionOnObject(selected);
            var positionOnCanvas = getPositionOnCanvas(textureEarthInBloom, positionOnObject);
            var inBloomPixel = getPixelFromTexture(textureEarthInBloom, positionOnObject);
    
            drawCircle(textureEarthInBloom, positionOnCanvas);
            playMusic(selectedName, inBloomPixel);
            drawSphere(selected);
        } else if(selectedName === "moon") {
            var selected = getSelected(position);
    
            playMusic(selectedName);
        };
    } else {
        playMusic();
    }
}

function drawSphere(selected){
    var sphere = new THREE.Mesh(geometryEarth,
                  new THREE.MeshPhongMaterial({color: 0x341d2f, transparent: true}));
    
    sphere.scale.set(.04, .04, .04);
    sphere.position.set(selected.point.x, selected.point.y, selected.point.z)
    for(var i = 2; i < groupEarth.children.length; i++) {
        groupEarth.remove(groupEarth.children[i]);
    }

    console.log(sphere);

    groupEarth.add(sphere);
}

function drawCircle(objectTexture, positionOnCanvas){
    var div = document.createElement("div");

    div.innerText = 'o';
    div.setAttribute('class', 'circle-on-plan')
    var positionx = positionOnCanvas.x / objectTexture.image.width * canvas.width;
    var positiony = canvas.height - positionOnCanvas.y / objectTexture.image.height * canvas.height;
    div.setAttribute('style','left:' + positionx + 'px; top:' + positiony + 'px');
    
    document.body.appendChild(div);
}

function onResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function playMusic(selectedName = null, pixel = null){
    var audio =  document.getElementById('audio');
    audio.src = "./audio/file.mp3";

    if(selectedName === "moon") {
        audio.src = './audio/moon.mp3';
    } else if(selectedName === "earth" && pixel.length === 4) {
        var r = pixel[0];
        var g = pixel[1];
        var b = pixel[2];
        var a = pixel[3];
    
        console.log(pixel);
        if(!a) { //ocean
            audio.src = './audio/ocean.mp3';
        } else if(g === 255 && r === 0 && b === 0) {
            audio.src = './audio/africa.mp3';
        } else if(r === 255 && g === 0 && b === 0) {
            audio.src = './audio/north_america.mp3';
        } else if(r === 0 && g === 0 && b === 255) {
            audio.src = './audio/europe.mp3';
        } else if(r === 0 && g === 0 && b === 0) {
            audio.src = './audio/south_america.mp3';
        } else if(r === 255 && g === 255 && b === 255) {
            audio.src = './audio/asia.mp3';
        }
    } else { //milky way
        audio.src = './audio/milky_way.mp3'
    }

    if(audio.src !== "./audio/file.mp3") {
        audio.play();
    }
}




function onOffCanvas() {
  //document.getElementById("myonoffswitch").innerHTML += "Clicked!<br>";
  var onOffSwitch = document.getElementById("onoffswitch");

  console.log(onOffSwitch);
  console.log("toto");
  if(onOffSwitch.checked){
    canvas.style.zIndex="999"
  }
  else{
    canvas.style.zIndex="-999"
  }
}

