let permissionGranted = false;
let nonios13device = false;
let gravityY;
let gravityX;
//let cx, cy    

function setup() {
  
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
  if (!permissionGranted) return
  
  document.getElementById('text_1').innerHTML = rotationY;
  document.getElementById('text_2').innerHTML = rotationX;
  gravityX = rotationX;
  gravityY = rotationY;

};