function getPositionOnScreen(camera, object3d) {
    var vector = new THREE.Vector3()
    
    object3d.getWorldPosition(vector).project(camera)
    vector.x = Math.round((vector.x + 1) / 2 * window.innerWidth)
    vector.y = Math.round(-(vector.y - 1) / 2 * window.innerHeight)
  
    return vector
}

function resizeImage(img){
    var canvasCopy = document.createElement("canvas")
    var copyContext = canvasCopy.getContext("2d")
    
    if(img.width > settings.max_width)
        ratio = settings.max_width / img.width
    else if(img.height > settings.max_height)
        ratio = settings.max_height / img.height
  
    canvasCopy.width = img.width
    canvasCopy.height = img.height
    copyContext.drawImage(img, 0, 0)
  
    canvas.width = img.width * canvasImageRatio
    canvas.height = img.height * canvasImageRatio
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

function getPositionOnObject(selectioned) {
    var vector = new THREE.Vector3();

    selectioned.object.getWorldPosition(vector).project(camera)
    vector = selectioned.uv
  
    return vector;
}

function getSelectPointOnEarth(position) {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(position, camera);
    var selectionnes = raycaster.intersectObjects(selectionables.children);
    
    if (selectionnes.length) {
        return selectionnes[0];
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

    var selectioned = getSelectPointOnEarth(position);
    if(selectioned) {
        var positionOnObject = getPositionOnObject(selectioned);
        
        var positionOnCanvas = getPositionOnCanvas(textureEarthInBloom, positionOnObject);

        var inBloomPixel = getPixelFromTexture(textureEarthInBloom, positionOnObject);

        DrawCircle(textureEarthInBloom, positionOnCanvas);

        PlayMusic(inBloomPixel);

        DrawSphere(selectioned);

        /* alert("Vous avez sélectionné l'objet " + object.name); */
    } else {
        // alert("Vous n'avez rien sélectionné")
    };
}

function DrawSphere(selectioned){
    var point3d = new THREE.Mesh(geometryEarth,
                  new THREE.MeshPhongMaterial({color: 0xbb00aa, position: selectioned.point}));
    
    point3d.scale.set(.05, .05, .05);
    point3d.position.set(selectioned.point.x, selectioned.point.y, selectioned.point.z)
    for(var i = 2; i < groupEarth.children.length; i++) {
        groupEarth.remove(groupEarth.children[i]);
    }
    groupEarth.add(point3d);
}

function DrawCircle(objectTexture, positionOnCanvas){
    var div = document.createElement("div");

    div.innerText = 'o';
    div.setAttribute('class', 'circle-on-plan')
    var positionx = positionOnCanvas.x / objectTexture.image.width * canvas.width;
    var positiony = canvas.height - positionOnCanvas.y / objectTexture.image.height * canvas.height;
    div.setAttribute('style','left:' + positionx + 'px; top:' + positiony + 'px');
    
    document.body.appendChild(div);
}

function PlayMusic(pixel){
    var audio =  document.getElementById('audio');

    var r = pixel[0];
    var g = pixel[1];
    var b = pixel[2];

    console.log(pixel);

    if(r=='0' && g=='255' && b=='235') {

    }
    if(r=='234' && g=='252' && b=='0') {
        
    }
    if(r=='' && g=='' && b=='') {
        
    }
    if(r=='' && g=='' && b=='') {
        
    }
    if(r=='' && g=='' && b=='') {
        
    }
    if(r=='' && g=='' && b=='') {
        
    }
    if(r=='' && g=='' && b=='') {
        
    }

   // audio.src = '';
    audio.play();
}