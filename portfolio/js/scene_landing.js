window.addEventListener('DOMContentLoaded', function(){
    let heliMesh;
    let sizeX = window.innerWidth;
    let sizeY = window.innerHeight;
    let newPosX,newPosY,modeX,modeY;

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
    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(-5, 17, 5), scene);
        camera.minZ = 0.1;
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.maxZ = 50;        //camera.position = new BABYLON.Vector3(13.3, 15.3, 3);

       
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
        var cityMeshTask = assetsManager.addMeshTask("", "", "models/city_merged.glb");
        var heliMeshTask = assetsManager.addMeshTask("", "", "models/helicopter.glb");
        heliMeshTask.onSuccess = task => {
            heliMesh = task.loadedMeshes[0];
            heliMesh.position.x = 0;
                   
            scene.registerBeforeRender( () => {
                if (heliMesh && rotationY){

                    positionX = heliMesh.position.x;
                    positionY = heliMesh.position.z;

                    if (!modeY) {
                        modeX = findMode(rotationX);
                        modeY = findMode(rotationY);
                    }
                  
                    calibrateGyroX = findCal(modeX, rotationX);
                    calibrateGyroY = findCal(modeY, rotationY);

                    document.getElementById('text_1').innerHTML = rotationX;
                    document.getElementById('text_2').innerHTML = calibrateGyroX;

                    newPosX = positionX + ( -0.001 * rotationY);
                    newPosY = positionY + ( -0.001 * rotationX);
                   
                    
                    heliMesh.position.x = newPosX;
                    heliMesh.position.z = newPosY; 
                    
                }
            });
        };
        assetsManager.load();

        
        
    
        
      
    
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
    //Finds mode from array
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
