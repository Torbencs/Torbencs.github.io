let permissionGranted = false
let nonios13device = false
let cx, cy

function setup() {
  createCanvas(windowWidth, windowHeight)
  colorMode(HSB, 360, 100, 100, 100)
  
  cx = width / 2
  cy = height / 2
  textSize(36)

  if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permission dialog only the first time
        // it needs to be a user gesture (requirement) in this case, click
        let askButton = createButton("Allow acess to sensors")
        askButton.style("font-size", "24px")
        askButton.position(0, 0)
        askButton.mousePressed(onAskButtonClicked)
        throw error // keep the promise chain as rejected
      })
      .then(() => {
        // this runs on subsequent visits
        permissionGranted = true
      })
  } else {
    // it's up to you how to handle non ios 13 devices
    text("non ios 13 devices", 50, 50)
    nonios13device = true
  }
}

// will handle first time visiting to grant access
function onAskButtonClicked() {
  DeviceOrientationEvent.requestPermission().then(response => {
    if (response === 'granted') {
      permissionGranted = true
    } else {
      permissionGranted = false
    }
    this.remove()
  }).catch(console.error)
}

function draw() {
  // I am just skipping sketch entirely for demonstration purpose,
  // but you can still continue to show sketch without access to sensors.
  if (!permissionGranted) return

  // rotationX and rotationY keep track of device orientation (provided by p5js library)
  cx += map(rotationY, -90, 90, -100, 100)
  cy += map(rotationX, -90, 90, -100, 100)
  if (cx >= width) cx = 0
  else if (cx <= 0) cx = width
  if (cy >= height) cy = 0
  else if (cy <= 0) cy = height

  const pulse = sin(frameCount / 20) * 50
  fill(sin(frameCount/60) * 30 + 30, 100, 100)
  ellipse(cx, cy, 100 + abs(rotationX*20) + pulse, 100 + abs(rotationX*20) + pulse)

}