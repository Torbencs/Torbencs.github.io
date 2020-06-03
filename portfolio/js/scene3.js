var createScene3 = function () {

    //Camera move animations
    var canvas = document.getElementById('renderCanvas');
    
    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);
    


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

   
    

    //Model positioning
   
    var assetsManager = new BABYLON.AssetsManager(scene);
    var mountainMeshTask = assetsManager.addMeshTask("", "", "models/mountain_merged_scene_2.glb");
    

    
    assetsManager.load();
    var bezierEase = new BABYLON.BezierCurveEase(.41,.08,.55,1);

        let animCameraLandingPos = new BABYLON.Animation("cameralandingPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
        let keysCameraLandingPos = [];

        keysCameraLandingPos.push({
        frame: 0,
        value: new BABYLON.Vector3(29.3,28, 2)
        });

        keysCameraLandingPos.push({
        frame: 500,
        value: new BABYLON.Vector3(-8.4629191 ,35.5, -10.9129811883)
        });

        keysCameraLandingPos.push({
        frame: 560,
        value: new BABYLON.Vector3(-8.4629191 ,35.5, -10.9129811883)
        });

        keysCameraLandingPos.push({
        frame: 730,
        value: new BABYLON.Vector3(-8.273084616, 31.7, -10.0018)
        });
        let bezierEase2 = new BABYLON.BezierCurveEase(.34,.16,.05,.85);
        animCameraLandingPos.setKeys(keysCameraLandingPos);
        animCameraLandingPos.setEasingFunction(bezierEase2);


        //Target animation

        let animCameraLandingTarget = new BABYLON.Animation("cameralandingTargetAnimation", "lockedTarget", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
        let keysCameraLandingTarget = [];

        keysCameraLandingTarget.push({
        frame: 0,
        value: new BABYLON.Vector3(25.25,29.02,-4.8)
        });
        
        keysCameraLandingTarget.push({
        frame: 150,
        value: new BABYLON.Vector3(-12.4023117,36,-15.2198993)
        });

        keysCameraLandingTarget.push({
        frame: 500,
        value: new BABYLON.Vector3(-12.4023117,36,-15.2198993)
        });

        keysCameraLandingTarget.push({
        frame: 750,
        value: new BABYLON.Vector3(-9.57924162818 , 29, -8.817296324 )
        });



        animCameraLandingTarget.setKeys(keysCameraLandingTarget);
        animCameraLandingTarget.setEasingFunction(bezierEase);

        scene.beginDirectAnimation(camera, [animCameraLandingPos,animCameraLandingTarget], 0, 830, false, 0.6);
    
    
  

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