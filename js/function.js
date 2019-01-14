function getPositionOnScreen(camera, object3d) {
    var vector = new THREE.Vector3()
    
    object3d.getWorldPosition(vector).project(camera)
    vector.x = Math.round((vector.x + 1) / 2 * window.innerWidth)
    vector.y = Math.round(-(vector.y - 1) / 2 * window.innerHeight)
  
    return vector
}

function getPositionOnObject(selectioned) {
    var vector = new THREE.Vector3();

    selectioned.object.getWorldPosition(vector).project(camera)
    vector.x = (vector.x + 1) / 2 * selectioned.uv.x
    vector.y = -(vector.y - 1) / 2 * selectioned.uv.y
  
    console.log(vector)
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

function onMouseClick(event) {
    var position = new THREE.Vector2();
    var domRect = renderer.domElement.getBoundingClientRect();
    position.x = (event.clientX / domRect.width) * 2 - 1 + domRect.left;
    position.y = - (event.clientY / domRect.height) * 2 + 1 + domRect.top;

    var selectioned = getSelectionneLePlusProche(position)
    if(selectioned) {
        objectPosition = getPositionOnObject(selectioned)
        console.log(objectPosition)
        /* alert("Vous avez sélectionné l'objet " + object.name); */
    } else {
        // alert("Vous n'avez rien sélectionné")
    };
}

function getUVzedImageDimension() {
    var UVzed
}

function getPixelColor(imagedata, x, y ) {
    var position = ( x * imagedata.height * y ) * 4
    var data = imagedata.data

    console.log(imagedata)

    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ] }
}