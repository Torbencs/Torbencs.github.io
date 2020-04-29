window.addEventListener('DOMContentLoaded', function(){
    let heliMesh;
    let sizeX = window.innerWidth;
    let sizeY = window.innerHeight;
    let newPosX,newPosY,modeX,modeY,calibrateGyroX,calibrateGyroY,newRotationX, newRotationY,oldRotationX,oldRotationY,euler;
    let landSwitch;
  

    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');
    
    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

  
    // createScene function that creates and return the scene
    var createScene = function () {

        //Camera move animations
        BABYLON.ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
            var ease = new BABYLON.CubicEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
        };

        BABYLON.ArcRotateCamera.prototype.moveTargetTo = function (newPos, speed) {
            var ease = new BABYLON.CubicEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            BABYLON.Animation.CreateAndStartAnimation('at5', this, 'target', speed, 120, this.target, newPos, 0, ease);
        };

        BABYLON.ArcRotateCamera.prototype.moveRadiusTo = function (newVal, speed) {
            var ease = new BABYLON.CubicEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, 'radius', speed, 120, this.radius, newVal, 0, ease);
        }

        BABYLON.ArcRotateCamera.prototype.movePosiTo = function (newPos, speed) {
            var ease = new BABYLON.CubicEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, 'position', speed, 120, this.position, newPos, 0, ease);
        }
    

    
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        var gravityVector = new BABYLON.Vector3(-.05, -1, -0.3);
        var physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);
    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(23.1, 42, 1.5), scene);
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(25.25,29.02,-4.8));
        camera.maxZ = 500;        //camera.position = new BABYLON.Vector3(13.3, 15.3, 3);

       
        //var camera = new BABYLON.FreeCamera("freeCam", new BABYLON.Vector3( 0, 5, 4), scene);
        
    
        // Camera controls
        camera.attachControl(canvas, false);
        
        //Lights
        // Old - var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-2, 20, 15), new BABYLON.Vector3(6, -9 ,-9), Math.PI, 20, scene);
    
        var light_spot_r = new BABYLON.SpotLight("spotLightR", new BABYLON.Vector3(4, 25, 18), new BABYLON.Vector3(0, -1,-1), Math.PI/2, 2, scene);       
        var light_spot_l = new BABYLON.SpotLight("spotLightL", new BABYLON.Vector3(25, 17, 10), new BABYLON.Vector3(-4, -1, -1), Math.PI/2, 2, scene);
        var light_spot_r2 = new BABYLON.SpotLight("spotLightL", new BABYLON.Vector3(18, 20, 5), new BABYLON.Vector3(-1, -1, -1), Math.PI/2, 2, scene);

        

        var light_hemi = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 10, 3), scene);
        
        light_spot_r.intensity = 1;
        light_spot_l.intensity = 1
        light_spot_r2.intensity = 1.4;
        light_hemi.intensity = 1.2;
   
        //Light visual helpers
        var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 16, 3, scene);
        lightSphere1.position = light_spot_r2.position;
        lightSphere1.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere1.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

       
        //Shadows
        shadowGenerator = new BABYLON.ShadowGenerator(1024, light_spot_r2);
        //Switch to test different shadow configs
        let shadow_options = 1;
        switch (shadow_options) {
            case 1:
                shadowGenerator.bias = 0.00002;
                shadowGenerator.usePoissonSampling = true;
                //shadowGenerator.useBlurExponentialShadowMap = true;
                shadowGenerator.frustumEdgeFalloff = 2;
                shadowGenerator.darkness = 0;
                break;
            case 2:
                shadowGenerator.bias = 0.000018;
                shadowGenerator.usePoissonSampling = true;
                //shadowGenerator.useBlurExponentialShadowMap = true;
                shadowGenerator.frustumEdgeFalloff = 2.7;
                shadowGenerator.darkness = 0.3;
                break;
    
        };
        

        //Model positioning
       
        var assetsManager = new BABYLON.AssetsManager(scene);
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/mountain_merged.glb");
        var heliMeshTask = assetsManager.addMeshTask("heli", "", "models/helicopter.glb");

        mountainMeshTask.onSuccess = task => {
            mountainMesh = task.loadedMeshes[0];
            //mountainMesh.scaling = new BABYLON.Vector3(0.1, 0.1,0.1);
        }
        heliMeshTask.onSuccess = task => {
            heliMesh = task.loadedMeshes[0];
            heliMesh.name = "work";
            heliMesh.alwaysSelectAsActiveMesh = true;
            heliMesh.position.x = 18.8;
            heliMesh.position.z = 0.11;
            heliMesh.position.y = 33.02; 
            heliMesh.rotationQuaternion = null;
            heliMesh.rotation.y = 0.58;
            
            let landingPad = {x:22.536,y:29.02,z:-2.14};
            
            
          

            scene.registerBeforeRender( () => {
                //Initiate landing timer
                
                let landingTimer = new Timer(2000, scene, ()=>{
                    alert('still working')
                });
                
                
                if (heliMesh && rotationY){
                    //If heli is over landing pad start timer 
                    if (pythagorean(heliMesh.position.x,heliMesh.position.z,landingPad.x,landingPad.z) < 0.8 && !landSwitch){
                        
                        landingTimer.start();
                        
                        var bezierEase = new BABYLON.BezierCurveEase(.4,.1,.3,.9);
                        var bezierBounce = new BABYLON.BezierCurveEase(.4,.1,.73,2.40);
                
                        var animLandingPos = new BABYLON.Animation("landingPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
                    
                        //Landing position animation
                        var keysLandingPos = []; 
                    
                        keysLandingPos.push({
                            frame: 0,
                            value: heliMesh.position,
                        });
                        
                
                        keysLandingPos.push({
                            frame: 150,
                            value: new BABYLON.Vector3(22.8,29.02,-4.1),
                        });
                        
                        
                        animLandingPos.setKeys(keysLandingPos);
                        animLandingPos.setEasingFunction(bezierEase);
                
                        //Landing rotation animation
                        var animLandingRot = new BABYLON.Animation("landingRotationAnimation", "rotation.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
                    
                        var keysLandingRot = []; 
                    
                        keysLandingRot.push({
                            frame: 0,
                            value: heliMesh.rotation.z,
                        });
                        
                
                        keysLandingRot.push({
                            frame: 130,
                            value: 0,
                        });
                        
                        animLandingRot.setKeys(keysLandingRot);
                        animLandingRot.setEasingFunction(bezierBounce);
                
                
                        heliMesh.animations = [];
                        heliMesh.animations.push(animLandingPos);
                        heliMesh.animations.push(animLandingRot);
                        
                        //scene.beginAnimation(heliMesh, 0, 150, false);
                        //landSwitch = 1;
                        
                        
                    } else if (!landSwitch){
                    //Else if heli not over landing pad and landing animation hasn't started reset timer and use gyro for position 
                    landingTimer.reset();
                        

                    positionX = heliMesh.position.x;
                    positionY = heliMesh.position.z;

                   
            
                    if (rotationX > 85 && rotationX < 95) {
                        return;
                    }
                    
                    if (rotationY > 85 && rotationY < 95) {
                        return;
                    }
                    
                    const TILT_LIMIT = 60;

                    if (rotationX > 0) {
                        rotationX = Math.min(rotationX, TILT_LIMIT);
                    } else {
                        rotationX = Math.max(rotationX, TILT_LIMIT * -1);
                    }

                    if (rotationY > 0) {
                        rotationY = Math.min(rotationY, TILT_LIMIT);
                    } else {
                        rotationY = Math.max(rotationY, TILT_LIMIT * -1);
                    }
                

                    
                    if (!modeY) {
                        modeX = findMode(rotationX);
                        modeY = findMode(rotationY);
                    }
                    
                    //Adjust gyro data so zero is natural hand help position and then apply dampening
                    calibrateGyroX = findCal(modeX, rotationX) * -0.0007; //-0.0008
                    calibrateGyroY = findCal(modeY, rotationY) * -0.0007;

                    //Find new coords adjusted for camera offset. Args: axis ( 'x' || 'y'), rotationDataX, rotationDataY
                    
                    newPosX = positionX + findOffset( 'x', calibrateGyroX, calibrateGyroY);
                    newPosY = positionY + findOffset( 'y', calibrateGyroX, calibrateGyroY);

                    //document.getElementById("text_1").innerHTML = newRotationX;
                    
                    

                    
                   
                   // heliMesh.rotation.x = 2 * findOffset( 'x', calibrateGyroX, calibrateGyroY);
                    //heliMesh.rotation.z = 2 * -(findOffset( 'y', calibrateGyroX, calibrateGyroY));
                   
                    
                    heliMesh.position.x = newPosX;
                    heliMesh.position.z = newPosY; 

                    heliMesh.rotation.z = 13 * -findOffset( 'x', calibrateGyroX, calibrateGyroY);
                    heliMesh.rotation.x = 9.3 * findOffset( 'y', calibrateGyroX, calibrateGyroY);
                    };
                    
                    
                }
            });
        };
        assetsManager.load();

        
        
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    
                        console.log(pointerInfo.pickInfo.pickedPoint);
                    
            }
    });
        
      
    
    /* GRAIN and ANTI ALI        
        
        var pipeline = new BABYLON.DefaultRenderingPipeline("", true, scene);
        pipeline.grainEnabled = true;
        pipeline.grain.intensity = 4;
        //pipeline.samples = 3;
        
    
        var kernel = 4;	
        var postProcess0 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), kernel, 1.0, camera);
        */
     
       
    return scene;
    
        };
    
    //Call the createScene function
    var scene = createScene();
    //Run the render loop
    engine.runRenderLoop(function(){
        
            
            
            
        
        scene.render();
    });
    
    //Mobile quality
    engine.setHardwareScalingLevel(0.5)
    
  
    
    
    

    
    
    //Add the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });

    
    
    });

    let onAskButtonClicked = function() {
        DeviceOrientationEvent.requestPermission().then(response => {
          if (response === 'granted') {
            permissionGranted = true;
            
          } else {
            permissionGranted = false;
            
          }
        }).catch(console.error)
      };
      
    let findMode = function(rotationData) {
        let tempArray = [];
        while (tempArray.length < 2000) {
            tempArray.push(Math.floor(rotationData))
        }
        return mode(tempArray);
        
    }

    //Returns calibrated rotation 
    let findCal = function(mode, rotationData) {
      let calibrated;
      calibrated = Number(rotationData) - Number(mode);
      return calibrated
    }
  
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

    let findOffset = function(axis, rotationDataX, rotationDataY) {
        if (axis == 'x') {
            return (Math.cos(57.4433342078932) * rotationDataY) + (Math.sin(57.4433342078932) * rotationDataX) ;
        } else if (axis == 'y') {
            return (-(Math.sin(57.4433342078932) * rotationDataY)) + (Math.cos(57.4433342078932) * rotationDataX);
        } else {
            console.log("Missing or incorrect axis argument in findOffset function call");
        }
    
    };

    let smooth = function(value){
        let x = value/8; 
        let inversePoly = (1/(Math.pow(2,(2/3)) * Math.cbrt(3) * Math.cbrt((Math.sqrt(3/2)) * Math.sqrt(54 * Math.pow(x,2) + 1) -9 * x))) - (Math.cbrt((Math.sqrt(3/2)) * Math.sqrt(54 * Math.pow(x,2) + 1) -9 * x) / (Math.cbrt(2) * Math.pow(3,(2/3))));
        return inversePoly*8;
    };
    
    // Pythag to find distance from specified point (x,y), in this case the center of the helicopter landing pad
    /**
     * @param {number} a - Helicopter position x
     * @param {number} b - Helicopter position z
     * @param {number} x - Center of helipad x axis
     * @param {number} y - Center of helipad z axis
     */
    let pythagorean = function(a,b,x,y) {
        return Math.sqrt(Math.pow((a - x), 2) + Math.pow((b - y), 2))
    };

    //Timer object
    Timer = function(time, scene, callback) {

        this.maxTime = this.currentTime = time;
        this.isOver = false;
        this.paused = false;
        this.started = false;
        this.callback = callback;
        this.scene  = scene;
    
        var _this = this;
        scene.registerBeforeRender(function() {
            if (_this.started && !_this.isOver && !_this.paused) {
                _this._update();
            }
        });
    };
    
    Timer.prototype.reset = function() {
        this.currentTime = this.maxTime;
        this.isOver = false;
        this.started = false;
    };
    
    Timer.prototype.start = function() {
        this.started = true;
    };
    
    Timer.prototype.pause = function() {
        this.paused = true;
    };
    
    Timer.prototype.resume = function() {
        this.paused = false;
    };
    
    Timer.prototype._update = function() {
        this.currentTime -= this.scene.getEngine().getDeltaTime();
        if (this.currentTime <= 0) {
            this.isOver = true;
            this.callback();
        }
    };
    
    
    