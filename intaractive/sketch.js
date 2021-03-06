let permissionGranted = false;
let nonios13device = false;
let gravityY;
let gravityX;
let positionX = 60;
let positionY = 20;
let sizeX = window.innerWidth;
let sizeY = window.innerHeight;
let newPosX;
let newPosY;
let calibrateGyroX;
let calibrateGyroY;
let modeX;
let modeY;
let hasRun = false;
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
        permissionGranted = true;
      })
  } else {
    // it's up to you how to handle non ios 13 devices
    permissionGranted = true
    console.log("Hit else on other device");
  };

  
};

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
  
  if (!permissionGranted || !rotationX) {
      return
  } else {
    document.getElementById('text_1').innerHTML = rotationY;
    document.getElementById('text_2').innerHTML = rotationX;
   
    if (!modeY) {
      modeX = findMode(rotationX);
      modeY = findMode(rotationY);
    }

    calibrateGyroX = findCal(modeX, rotationX);
    calibrateGyroY = findCal(modeY, rotationY);

    document.getElementById('text_3').innerHTML = calibrateGyroX;
    document.getElementById('text_4').innerHTML = calibrateGyroY;


    newPosX = positionX;
    newPosY = positionY + ( 0.02 * calibrateGyroX);
   
    newPosX <= 0 ? positionX = 0 
      : newPosX >= sizeX ? positionX = sizeX
      : positionX = newPosX;
    
    newPosY <= 0 ? positionY = 0 
      : newPosY >= sizeY ? positionY = sizeY
      : positionY = newPosY;
   
    background(0);
    ellipse(positionX, positionY, 120, 120);
  };
};

let findMode = function(rotationData) {
    let tempArray = [];
    while (tempArray.length < 200) {
      tempArray.push(Math.floor(rotationData))
    }
    return mode(tempArray);
    
}
let findCal = function(mode, rotationData) {
  let calibrated;
  calibrated = Number(rotationData) - Number(mode);
  return calibrated
}
/*
function findMode(rotationData) {

  let tempArray = [];
  
  let id = setInterval(()=> {
    tempArray.push(Math.floor(rotationData));
    },500);
  
  setTimeout(()=> {
    clearInterval(id);
    return mode(tempArray);
  },5000);    
};

*/
let mode = function(numbers) {
  var mode = 0, count = [], i, number, maxIndex = 0;

  for (i = 0; i < numbers.length; i += 1) {
      number = numbers[i];
      count[number] = (count[number] || 0) + 1;
      if (count[number] > maxIndex) {
          maxIndex = count[number];
      };
  };

  for (i in count)
      if (count.hasOwnProperty(i)) {
          if (count[i] === maxIndex) {
              mode = i;
          };
      };

  return mode;
};




//------------------------ TEST CODE ---------------------

let smooth = function(value) {
  return (Math.pow(value, 3) / 6) + (value / 4)  
}

document.getElementById('text_5').innerHTML = rotationY;

/*

function calibrateGyro() {

  let tempArrayX = [];
  let tempArrayY = [];
  
  let id = setInterval(()=> {
    tempArrayX.push(Math.floor(rotationY));
    tempArrayY.push(Math.floor(rotationX));
    },500);
  
  setTimeout(()=> {
    clearInterval(id);
    

  },5000);    
};
*/