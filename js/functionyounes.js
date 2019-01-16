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
  
    canvas.width = img.width * canvasImageRatio
    canvas.height = img.height * canvasImageRatio
    context.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height)
  }

function loadCanvas(dataURL) {
  imageCanvas.onload = function() {
    resizeImage(this);

    console.log(context)
  };
  imageCanvas.src = dataURL;
}

function getPositionOnObject(selected) {
    var vector = new THREE.Vector3();

    selected.object.getWorldPosition(vector).project(camera)
    vector = selected.uv
  
    return vector;
}

function getSelectionneLePlusProche(position) {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(position, camera);
    var selectionnes = raycaster.intersectObjects(selectionables.children);
    
    if (selectionnes.length) {
        return selectionnes[0];
    }
}

function getPixelFromTexture(objectTexture, positionOnObject) {
    // var 
    // var pixelFromCanvas = []
    
    // for(var i = 0; i < objectTexture.image.width; i++) {

    //     var pixelFromCanvas[i] = []
    //     for(var y = 0; y < objectTexture.image.height; y++) {
    //         pixelFromCanvas[i][y]
    //     }
    // }

    console.log(objectTexture)
    console.log(positionOnObject)
    var image = new THREE.Vector2()

    image.x = Math.round(positionOnObject.x * objectTexture.image.width)
    image.y = Math.round(positionOnObject.y * objectTexture.image.height)

    console.log(image)
    console.log('tsé')

    var imageData = context.getImageData(image.x, image.y, 1, 1)

    var pixel = imageData.data

    var r = pixel[0]
    var g = pixel[1]
    var b = pixel[2]
    var a = pixel[3]

    console.log(pixel)

    return pixel
}

function getPixelColor(imagedata, x, y ) {
    var position = ( x * imagedata.height * y ) * 4
    var data = imagedata.data

    console.log(imagedata)

    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ] }
}

function onMouseClick(event) {
    var position = new THREE.Vector2();
    var domRect = renderer.domElement.getBoundingClientRect();
    position.x = (event.clientX / domRect.width) * 2 - 1 + domRect.left;
    position.y = - (event.clientY / domRect.height) * 2 + 1 + domRect.top;

    var selected = getSelectionneLePlusProche(position)
    if(selected) {
        var positionOnObject = getPositionOnObject(selected)
        var earthPixel = getPixelFromTexture(earth.material.map, positionOnObject) 
        var inBloomPixel = getPixelFromTexture(textureEarthInBloom, positionOnObject) 
        /* alert("Vous avez sélectionné l'objet " + object.name); */
    } else {
        // alert("Vous n'avez rien sélectionné")
    };
}