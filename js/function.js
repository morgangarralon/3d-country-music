function getPositionOnScreen(camera, object3d) {
    var vector = new THREE.Vector3()
    
    object3d.getWorldPosition(vector).project(camera)
    vector.x = Math.round((vector.x + 1) / 2 * window.innerWidth)
    vector.y = Math.round(-(vector.y - 1) / 2 * window.innerHeight)
  
    return vector
}

function loadCanvas(dataURL) {
  imageCanvas.onload = function() {
    canvas.width = this.width
    canvas.height = this.height
    context.drawImage(this, 0, 0, this.width, this.height);
    console.log(context)
  };
  imageCanvas.src = dataURL;
}

function getPositionOnObject(selectioned) {
    var vector = new THREE.Vector3();

    selectioned.object.getWorldPosition(vector).project(camera)
    vector = selectioned.uv
  
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

    var selectioned = getSelectionneLePlusProche(position)
    if(selectioned) {
        var positionOnObject = getPositionOnObject(selectioned)
        var earthPixel = getPixelFromTexture(earth.material.map, positionOnObject) 
        var inBloomPixel = getPixelFromTexture(textureEarthInBloom, positionOnObject) 
        /* alert("Vous avez sélectionné l'objet " + object.name); */
    } else {
        // alert("Vous n'avez rien sélectionné")
    };
}