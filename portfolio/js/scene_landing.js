window.addEventListener('DOMContentLoaded', function(){
    let heliMesh;
    let sizeX = window.innerWidth;
    let sizeY = window.innerHeight;
    let newPosX,newPosY,modeX,modeY,calibrateGyroX,calibrateGyroY,newRotationX, newRotationY,oldRotationX,oldRotationY,euler;
    let landingStarted,landingAnimStarted,currentScene,scene2Started;
    let lastTime = 0;
    let meshNumber = 0;
  

    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');
    
    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

  
    // createScene function that creates and returns the scene
    var createScene1 = function () {
        currentScene = 1;

        //Camera move animations
        BABYLON.ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
            var ease = new BABYLON.SineEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
        };

        BABYLON.UniversalCamera.prototype.moveTargetTo = function (newPos, speed) {
            var ease = new BABYLON.CubicEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            BABYLON.Animation.CreateAndStartAnimation('at5', this, 'cameraDirection', speed, 120, this.cameraDirection, newPos, 0, ease);
        };

        BABYLON.ArcRotateCamera.prototype.moveRadiusTo = function (newVal, speed) {
            var ease = new BABYLON.CubicEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, 'radius', speed, 120, this.radius, newVal, 0, ease);
        }

        BABYLON.UniversalCamera.prototype.movePosiTo = function (newPos, speed, callback) {
            var ease = new BABYLON.SineEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, 'position', speed, 120, this.position, newPos, 0, ease, callback);
        }
    
        

    
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(32.70,10, 24.137), scene);
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(40.06,29.02,8.89));
        camera.maxZ = 500;      

        
    
        // Camera controls
        camera.attachControl(canvas, true);
        
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

     
        

        //Model positioning
       
        var assetsManager = new BABYLON.AssetsManager(scene);
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/mountain_merged_scene_1.glb");
        //var heliMeshTask = assetsManager.addMeshTask("heli", "", "models/helicopter.glb");

        mountainMeshTask.onSuccess = task => {
            mountainMesh = task.loadedMeshes[0];
            //mountainMesh.scaling = new BABYLON.Vector3(0.1, 0.1,0.1);
        }
        
        assetsManager.load();

        
        
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    
                        console.log(pointerInfo.pickInfo.pickedPoint);
                    
            }
         });
        
        //camera.lockedTarget = (new BABYLON.Vector3(25.25,29.02,-4.8));
        //camera.moveTargetTo(new BABYLON.Vector3(23.616, 42.1837, 2.203311), 15,);
        /*camera.cameraDirection = new BABYLON.Vector3(0,0,0);
        camera.movePosiTo(new BABYLON.Vector3(23.616, 42.1837, 2.203311), 15, ()=>{
            
            currentScene = 2;
        });
        */

        //Animation
        var keysTarget = [];
        var keysPosition = [];
        let ease = new BABYLON.BezierCurveEase(.54,0,.66,1);
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);


        keysPosition.push({
        frame: 0,
        value: new BABYLON.Vector3(3.33016,14, -7.457)
        });

        keysTarget.push({
        frame: 0,
        value: new BABYLON.Vector3(14.57387,12.615,9.7957)
        });  

        keysPosition.push({
        frame: 350,
        value: new BABYLON.Vector3(7,45,67)
        });

        keysTarget.push({
        frame: 350,
        value: new BABYLON.Vector3(0,21,0)
        });

        keysPosition.push({
        frame: 400,
        value: new BABYLON.Vector3(7,45,67)
        });

        keysTarget.push({
        frame: 400,
        value: new BABYLON.Vector3(0,21,0)
        });

        keysTarget.push({
        frame: 410,
        value: new BABYLON.Vector3(0,21,0)
        });

        keysPosition.push({
        frame: 470,
        value: new BABYLON.Vector3(29.258,18, 15.243)
        });


        keysTarget.push({
        frame: 470,
        value: new BABYLON.Vector3(38.211,18.40,8.0507)
        });



      
      

     
     
        var animationTarget = new BABYLON.Animation("animationTarget", "lockedTarget", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        animationTarget.setKeys(keysTarget);
        animationTarget.setEasingFunction(ease);
        camera.animations.push(animationTarget);
    
        var animationPosition = new BABYLON.Animation("animationPosition", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        animationPosition.setKeys(keysPosition);
        animationPosition.setEasingFunction(ease);
        camera.animations.push(animationPosition);
    
        var maxFrame = Math.max(keysTarget[keysTarget.length - 1].frame, keysPosition[keysPosition.length - 1].frame);
    
        scene.beginAnimation(camera, 0, maxFrame, false, 0.35, ()=>{
            currentScene = 2;
        });
       
        return scene;    
            };


    //Scene 2
    var createScene2 = function () {

        //Camera move animations
        BABYLON.ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
            var ease = new BABYLON.SineEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
        };

        BABYLON.ArcRotateCamera.prototype.moveTargetTo = function (newPos, speed) {
            var ease = new BABYLON.CubicEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            BABYLON.Animation.CreateAndStartAnimation('at5', this, 'target', speed, 120, this.target, newPos, 0, ease);
        };

        BABYLON.ArcRotateCamera.prototype.moveRadiusTo = function (newVal, speed) {
            var ease = new BABYLON.CubicEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, 'radius', speed, 120, this.radius, newVal, 0, ease);
        }

        BABYLON.ArcRotateCamera.prototype.movePosiTo = function (newPos, speed) {
            var ease = new BABYLON.SineEase();
            ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            BABYLON.Animation.CreateAndStartAnimation('at4', this, 'position', speed, 120, this.position, newPos, 0, ease);
        }
    
        

    
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        var gravityVector = new BABYLON.Vector3(-.05, -1, -0.3);
        var physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);
    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(29.258,18, 15.243), scene);
        //var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(27.1, 30, 4), scene);
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(38.211,18.40,8.0507));
        camera.maxZ = 500;        
        
       
        //var camera = new BABYLON.FreeCamera("freeCam", new BABYLON.Vector3( 0, 5, 4), scene);
        
    
        // Camera controls
        camera.attachControl(canvas, true);
        
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
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/mountain_merged_scene_2.glb");
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
            
            var landingTimer = new Timer(5000, scene, ()=>{
                landingStarted = true;
            });

           
            scene.registerBeforeRender( () => {
                //Initiate landing timer

                
                
                if (rotationY){
                    //Can remove this outer if statement when not supporting desktop
                    if (scene2Started && !landingStarted){
                    
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
                    
                    heliMesh.position.x = newPosX;
                    heliMesh.position.z = newPosY; 

                    //Model rotation effect
                    heliMesh.rotation.z = 13 * -findOffset( 'x', calibrateGyroX, calibrateGyroY);
                    heliMesh.rotation.x = 9.3 * findOffset( 'y', calibrateGyroX, calibrateGyroY);

                    //Check if heli is over the landing pad
                    
                    if (landingTimer.currentTime < lastTime - 0.27777 && meshNumber < 19){
                        let mesh = scene.getMeshByName(meshNumber);
                        
                        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);                          
                        myMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.6, 0.87);
                        mesh.material = myMaterial;

                        lastTime = landingTimer.currentTime;
                        meshNumber++;
                    }
                    
                    
                     else {
                    landingTimer.reset();
                    
                    };

                    }
                }
            });
        };
        assetsManager.load();

        //Camera Animation
        var keysTarget = [];
        var keysPosition = [];
        let ease = new BABYLON.BezierCurveEase(.54,0,.66,1);
        
        
        keysTarget.push({
        frame: 0,
        value: new BABYLON.Vector3(38.211,18.40,8.0507)
        });

        keysTarget.push({
        frame: 8,
        value: new BABYLON.Vector3(38.211,18.40,8.0507)
        });


        keysPosition.push({
        frame: 0,
        value: new BABYLON.Vector3(29.258,18, 15.243)
        });

       

        keysTarget.push({
        frame: 85,
        value: new BABYLON.Vector3(25.25,29.02,-4.8)
        });

        keysPosition.push({
        frame: 115,
        value: new BABYLON.Vector3(23.616, 42.1837, 2.203311)
        });
        
        var animationTarget = new BABYLON.Animation("animationTarget", "lockedTarget", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        animationTarget.setKeys(keysTarget);
        animationTarget.setEasingFunction(ease);
        camera.animations.push(animationTarget);
    
        var animationPosition = new BABYLON.Animation("animationPosition", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        animationPosition.setKeys(keysPosition);
        animationPosition.setEasingFunction(ease);
        camera.animations.push(animationPosition);
    
        var maxFrame = Math.max(keysTarget[keysTarget.length - 1].frame, keysPosition[keysPosition.length - 1].frame);
    
        scene.beginAnimation(camera, 0, maxFrame, false, 0.35, ()=>{
            scene2Started = true;
        });
        
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
    }
    
    //Call the createScene function
    var scene1 = createScene1();
    var scene2 = createScene2();
    //Run the render loop

    engine.runRenderLoop(function(){
    /*if (currentScene === 1 && scene1Started){
            scene1.render();
        } else if (currentScene === 2){
            scene1.dispose();
            scene2.render();
        } */
        scene2.render();
    });
    
    //Mobile quality
    //engine.setHardwareScalingLevel(0.5)
    
  
    
    
    

    
    
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
    
    
    