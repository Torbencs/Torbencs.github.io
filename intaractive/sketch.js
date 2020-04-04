let permissionGranted = false;
let nonios13device = false;
let gravityY;
let gravityX;
let positionX = 20;
let positionY = 20;
let sizeX = window.innerWidth;
let sizeY = window.innerHeight;
//let cx, cy    

function setup() {
  createCanvas(sizeX, sizeY);
  
  if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permission dialog only the first time
        // it needs to be a user gesture (requirement) in this case, click
        let askButton = createButton("Allow acess to sensors");
        askButton.style("font-size", "24px");
        askButton.position(0, 0);
        askButton.mousePressed(onAskButtonClicked);
        throw error // keep the promise chain as rejected
      })
      .then(() => {
        // this runs on subsequent visits
        permissionGranted = true
      })
  } else {
    // it's up to you how to handle non ios 13 devices
    permissionGranted = true
    console.log("Hit else on other device");
  };
};

// will handle first time visiting to grant access
function onAskButtonClicked() {
  DeviceOrientationEvent.requestPermission().then(response => {
    if (response === 'granted') {
      permissionGranted = true;
    } else {
      permissionGranted = false;
    }
    this.remove()
  }).catch(console.error)
};

function draw() {
  

  // I am just skipping sketch entirely for demonstration purpose,
  // but you can still continue to show sketch without access to sensors.
  
  if (!permissionGranted || !rotationX) {
      return
  } else {
    document.getElementById('text_1').innerHTML = rotationY;
    document.getElementById('text_2').innerHTML = rotationX;
    /*
    positionX < 0       ? positionX = 0
    : positionX > sizeX ? positionX = sizeX
                        : positionX += 0.1 * rotationY;

*/
    if (positionX <= 0) {
      positionX = 0
    } else if ( positionX > sizeX) {
      positionX = sizeX
    } else {
      positionX += 0.1 * rotationY
    }

    if (positionY <= 0) {
      positionY = 0
    } else if ( positionY > sizeY) {
      positionY = sizeY
    } else {
      positionY += 0.1 * rotationX
    }
    background(0);
    ellipse(positionX, positionY, 80, 80);
    
  };
  

};

let smooth = function(value) {
  return (Math.pow(value, 3) / 6) + (value / 4)  
}

//No idea
let norm = function(value) {
  return value - smooth(value)
}