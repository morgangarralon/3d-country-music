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
  
    canvas2.width = img.width * canvasImageRatio
    canvas2.height = img.height * canvasImageRatio
    context2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas2.width, canvas2.height)
  }

function loadCanvas(dataURL) {
  imageCanvas.onload = function() {
    canvas.width = this.width;
    canvas.height = this.height;
    context.drawImage(this,0,0,this.width,this.height);
  };
  imageCanvas.src = dataURL;
}

function loadPlanisphere(dataURL) {
    imageCanvas2.onload = function() {
    resizeImage(this);
  };
  imageCanvas2.src = dataURL;
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

function getPositionOnCanvas(objectTexture, positionOnObject){
    var image = new THREE.Vector2()

    image.x = Math.round(positionOnObject.x * objectTexture.image.width)
    image.y = Math.round(positionOnObject.y * objectTexture.image.height)

    return image;
}

function getPixelFromTexture(objectTexture, positionOnObject) {
    var image = new THREE.Vector2()

    image.x = Math.round(positionOnObject.x * objectTexture.image.width)
    image.y = Math.round((1 - positionOnObject.y) * objectTexture.image.height)

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

    var selectioned = getSelectionneLePlusProche(position);
    if(selectioned) {
        var positionOnObject = getPositionOnObject(selectioned);
        
        var positionOnCanvas = getPositionOnCanvas(textureEarthInBloom, positionOnObject);

        var inBloomPixel = getPixelFromTexture(textureEarthInBloom, positionOnObject);

        DrawCircleOnPlan(positionOnCanvas);

        PlayMusic(inBloomPixel);

        /* alert("Vous avez sélectionné l'objet " + object.name); */
    } else {
        // alert("Vous n'avez rien sélectionné")
    };
}

function DrawCircleOnPlan(positionOnCanvas){
            var div = document.createElement("div");
            div.innerText = 'o';
            var positionx = positionOnCanvas.x /4000 * 202;
            var positiony = 101 - positionOnCanvas.y /2000 * 101;
            div.setAttribute('style','color:red;radius:0.5;position:fixed;z-index:1000;left:'+positionx+'px;top:'+positiony+'px');
            document.body.appendChild(div);
}

function PlayMusic(PixelColor){
    var audio =  document.getElementById('audio');

    var r = PixelColor[0];
    var g = PixelColor[1];
    var b = PixelColor[2];

    console.log(PixelColor);

    if(r=='0' && g=='255' && b=='235'){ //Red

    }
    if(r=='234' && g=='252' && b=='0'){ //Yellow
        
    }
    if(r=='' && g=='' && b==''){
        
    }
    if(r=='' && g=='' && b==''){
        
    }
    if(r=='' && g=='' && b==''){
        
    }
    if(r=='' && g=='' && b==''){
        
    }
    if(r=='' && g=='' && b==''){
        
    }

   // audio.src = '';
    audio.play();
    
}


function DrawCircleOnTerre(positionOnCanvas){
            var div = document.createElement("div");
            div.innerText = 'o';
            div.setAttribute('style','color:red;radius:0.5;position:fixed;z-index:1000;left:'+positionOnCanvas.x/600+'px;top:'+positionOnCanvas.y/200+'px');
            document.body.appendChild(div);
}

