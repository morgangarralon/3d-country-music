function getPositionOnScreen(camera, object3d) {
    var vector = object3d.getWorldPosition().project(camera);

    vector.x = Math.round((vector.x + 1) / 2 * window.innerWidth);
    vector.y = Math.round(-(vector.y - 1) / 2 * window.innerHeight);
  
    return vector;
}

function getPositionOnObject(object3d) {
    const center = new THREE.Vector3();
    var vector = object3d.getWorldPosition(center).project(camera)

    console.log(vector)
    vector.x = Math.round((vector.x + 1) / 2 * object3d.uv.x);
    vector.y = Math.round(-(vector.y - 1) / 2 * object3d.uv.y);
  
    return vector;
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