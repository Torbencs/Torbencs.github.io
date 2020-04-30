export var createScene1 = function() {
    currentScene = 1;

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

    BABYLON.UniversalCamera.prototype.movePosiTo = function (newPos, speed, callback) {
        var ease = new BABYLON.SineEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        BABYLON.Animation.CreateAndStartAnimation('at4', this, 'position', speed, 120, this.position, newPos, 0, ease, callback);
    }

    


    // Scene and Physics
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        
    var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0,40, 40), scene);
    camera.minZ = 0.1;
    camera.setTarget(new BABYLON.Vector3(25.25,29.02,-4.8));
    camera.maxZ = 500;      

    

    // Camera controls
    //camera.attachControl(canvas, true);
    
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
    var mountainMeshTask = assetsManager.addMeshTask("", "", "models/mountain_merged.glb");
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
    
  
    camera.movePosiTo(new BABYLON.Vector3(25.1, 30, 4), 15, ()=>{
        currentScene = 2;
    });
   
    return scene;    
        };