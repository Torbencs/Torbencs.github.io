window.addEventListener('DOMContentLoaded', function(){
    let permissionGranted;

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
    //Import Models
       
        //Add imported model

       
        
    
        
      
    
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
    //engine.setHardwareScalingLevel(0.5)
    var assetsManager = new BABYLON.AssetsManager(scene);
    var cityMeshTask = assetsManager.addMeshTask("", "", "models/city_merged.glb");
    var heliMeshTask = assetsManager.addMeshTask("", "", "models/helicopter.glb");
    
    heliMeshTask.onSuccess = task => {
        const heliMesh = task.loadedMeshes[0]
    };
    

    assetsManager.load();
    
    //Add the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });

   
    
    });

    let onAskButtonClicked = function() {
        DeviceOrientationEvent.requestPermission().then(response => {
          if (response === 'granted') {
            permissionGranted = true;
            
           
            document.getElementById('text_1').innerHTML = rotationY;
                   

          } else {
            permissionGranted = false;
            
          }
        }).catch(console.error)
      };
      

    