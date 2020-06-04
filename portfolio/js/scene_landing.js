window.addEventListener('DOMContentLoaded', function(){
    let heliMesh;
    let sizeX = window.innerWidth;
    let sizeY = window.innerHeight;
    let newPosX,newPosY,modeX,modeY,calibrateGyroX,calibrateGyroY,newRotationX, newRotationY,oldRotationX,oldRotationY,euler;
    let landingStarted,landingAnimStarted,currentScene,scene2Started;
    let lastTime = 2200;
    let meshNumber = 0;
  

    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');
    
    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

  
    // createScene function that creates and returns the scene
    var createScene1 = function () {
        currentScene = 1;
        

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
        lightSphere1.position = new BABYLON.Vector3(-8.6565837,36, 13.0086459);
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



      
      

     
     
        var animationTarget = new BABYLON.Animation("animationTarget", "lockedTarget", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        animationTarget.setKeys(keysTarget);
        animationTarget.setEasingFunction(ease);
        camera.animations.push(animationTarget);
    
        var animationPosition = new BABYLON.Animation("animationPosition", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    
            
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
        lightSphere1.position = new BABYLON.Vector3(-9.12078903 ,36, -1.278661083);
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
           /* let i;
            for (i=0; i < task.loadedMeshes.length;i++){
                console.log(task.loadedMeshes[i].name)
            }
*/


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
            
            let landingPad = {x:23,y:29.02,z:-2.55};
            
            var landingTimer = new Timer(2200, scene, ()=>{
                landingStarted = true;
            });

            var matLetterGreen = new BABYLON.StandardMaterial("myMaterial", scene);                          
            matLetterGreen.diffuseColor = new BABYLON.Color3(1, 0.184, 0);

            var matLetterWhite = new BABYLON.StandardMaterial("myMaterial", scene);                          
            matLetterWhite.diffuseColor = new BABYLON.Color3(1, 1, 1);

          

           
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
                    
                        if (pythagorean(heliMesh.position.x,heliMesh.position.z,landingPad.x,landingPad.z) < 0.6){
                            landingTimer.start();

                           
                            if (landingTimer.currentTime < lastTime - 60 && meshNumber < 19){
                                let mesh = scene.getMeshByName(meshNumber.toString());
                            
                                mesh.material = matLetterGreen;
                                meshNumber++;
                                lastTime = landingTimer.currentTime;
                            } 
                        
                        } else {
                            landingTimer.reset();
                            lastTime = 2200;
                            meshNumber = 0;
                            let i;
                            for (i=0; i<19; i++){
                                let mesh = scene.getMeshByName(i.toString());
                                mesh.material = matLetterWhite;
                            };
                        };
                    }; //Landing not started

                     if (landingStarted && !landingAnimStarted){


                        var bezierEase = new BABYLON.BezierCurveEase(.4,.1,.3,.9);
                        var bezierBounce = new BABYLON.BezierCurveEase(.4,.1,.73,2.40);
                    
                        var animLandingPos = new BABYLON.Animation("landingPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
                    
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
                        var animLandingRot = new BABYLON.Animation("landingRotationAnimation", "rotation.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
                    
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
                        
                        //Camera landing position animation
                        let animCameraLandingPos = new BABYLON.Animation("cameralandingPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
                        let keysCameraLandingPos = [];

                        keysCameraLandingPos.push({
                            frame: 0,
                            value: new BABYLON.Vector3(23.616, 42.1837, 2.203311)
                        });

                        keysCameraLandingPos.push({
                            frame: 200,
                            value: new BABYLON.Vector3(24.58403194696,28, -0.1610233)
                        });

                        let bezierEase2 = new BABYLON.BezierCurveEase(.22,1,.84,1);
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
                            frame: 100,
                            value: new BABYLON.Vector3(23,29.02,-2.55),
                        });

                       

                        animCameraLandingTarget.setKeys(keysCameraLandingTarget);
                        animCameraLandingTarget.setEasingFunction(bezierEase);

                        scene.beginDirectAnimation(camera, [animCameraLandingPos,animCameraLandingTarget], 0, 200, false);
                        landingAnimStarted = true;
                        scene.beginAnimation(heliMesh, 0, 150, false, 0.4);
                        window.setTimeout(()=>{
                            currentScene = 3;
                        },6000)


                    
                    };//Landing animation
                }; //If rotation
            }); //Register before render
        }; //Mesh success callback
        
        
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

        //Landing and end of scene

        
        
        var animationTarget = new BABYLON.Animation("animationTarget", "lockedTarget", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        animationTarget.setKeys(keysTarget);
        animationTarget.setEasingFunction(ease);
        //camera.animations.push(animationTarget);
    
        var animationPosition = new BABYLON.Animation("animationPosition", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        animationPosition.setKeys(keysPosition);
        animationPosition.setEasingFunction(ease);
        //camera.animations.push(animationPosition);
    
        var maxFrame = Math.max(keysTarget[keysTarget.length - 1].frame, keysPosition[keysPosition.length - 1].frame);
    
        
        scene.beginDirectAnimation(camera,[animationTarget, animationPosition], 0, maxFrame, false, 0.35, ()=>{
            scene2Started = true;
        }); 
        
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    
                        console.log(pointerInfo.pickInfo.pickedPoint);
                    
            }
    });
        
       
    return scene;
    }

    //Scene 3
    var createScene3 = function () {

        
    
    
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
        
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(29.3,28, 2), scene);
        //var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(27.1, 30, 4), scene);
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(23,29.02,-2.55));
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
    
       
        var assetsManager = new BABYLON.AssetsManager(scene);
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/mountain_merged_scene_3.glb");
        

        
        assetsManager.load();
    
        //Model positioning
       
       
        var bezierEase = new BABYLON.BezierCurveEase(.41,.08,.55,1);
    
            let animCameraAfterLandingPos = new BABYLON.Animation("cameralandingPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
            let keysCameraAfterLandingPos = [];
    
            keysCameraAfterLandingPos.push({
            frame: 0,
            value: new BABYLON.Vector3(29.3,28, 2)
            });
    
            keysCameraAfterLandingPos.push({
            frame: 500,
            value: new BABYLON.Vector3(-8.4629191 ,35.5, -10.9129811883)
            });
    
            keysCameraAfterLandingPos.push({
            frame: 560,
            value: new BABYLON.Vector3(-8.4629191 ,35.5, -10.9129811883)
            });
    
            keysCameraAfterLandingPos.push({
            frame: 730,
            value: new BABYLON.Vector3(8.67129591, 31.7, -9.8745280)
            });
            let bezierEase2 = new BABYLON.BezierCurveEase(.34,.16,.05,.85);
            animCameraAfterLandingPos.setKeys(keysCameraAfterLandingPos);
            animCameraAfterLandingPos.setEasingFunction(bezierEase2);
    
    
            //Target animation
    
            let animCameraAfterLandingTarget = new BABYLON.Animation("cameralandingTargetAnimation", "lockedTarget", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
            let keysCameraAfterLandingTarget = [];
    
            keysCameraAfterLandingTarget.push({
            frame: 0,
            value: new BABYLON.Vector3(23,29.02,-2.55)
            });
            
            keysCameraAfterLandingTarget.push({
            frame: 150,
            value: new BABYLON.Vector3(-12.4023117,36,-15.2198993)
            });
    
            keysCameraAfterLandingTarget.push({
            frame: 500,
            value: new BABYLON.Vector3(-12.4023117,36,-15.2198993)
            });
    
            keysCameraAfterLandingTarget.push({
            frame: 750,
            value: new BABYLON.Vector3(-9.57924162818 , 29, -8.817296324 )
            });
    
    
    
            animCameraAfterLandingTarget.setKeys(keysCameraAfterLandingTarget);
            animCameraAfterLandingTarget.setEasingFunction(bezierEase);
    
            scene.beginDirectAnimation(camera, [animCameraAfterLandingPos,animCameraAfterLandingTarget], 0, 830, false, 0.6, ()=>{
                
                
                //Create Start button
        var button1 = document.createElement("button");
        button1.style.top = (window.innerHeight / 2) - 30 + "px";
        button1.style.left = (window.innerWidth / 2) - 75 + "px";
        button1.textContent = "Start";
        button1.style.width = "150px";
        button1.style.height = "60px";
        button1.style.display = 'none';
    
        button1.setAttribute = ("id", "but1");
        button1.classList.add('btn--action');
        button1.style.position = "absolute";
    
        document.body.appendChild(button1);
        
        button1.addEventListener("click", () => {
            startScene();
            startRun();

            let skeleton = scene.getSkeletonByName("Armature");
            snowboarderIdleAnimatable = skeleton.beginAnimation("idle", true, 2);
            
            button1.remove();
        });

        currentScene = 4;
            });
        

       
    return scene;
    }


    //Scene 4
    var createScene4 = function () {
        let click = 0;
        let animRunning = false;
        let score = 0;
        let attempts = 0;
        let hits = 0;
        let endHits = 0;
    
       
    
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
        
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(8.67129591, 31.7, -9.8745280), scene); 
        camera.minZ = 0.1;
        
        //camera.setTarget(new BABYLON.Vector3(-9.933531,29.9,-7.30017)); 
        camera.setTarget(new BABYLON.Vector3(-9.57924162818 , 29, -8.817296324 ));
        

        var light_hemi = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 40, 3), scene);
   
        light_hemi.intensity = 1;
   
       

        let box = BABYLON.MeshBuilder.CreateBox("Box",{height: 0.42, width: 0.2, depth: 0.54} ,scene);
        box.position = new BABYLON.Vector3(-9.5858738, 30, -8.740); 
        box.rotation.x = 1.75;
        box.rotation.y = .67;
        box.rotation.z = 0;
        box.visibility = 0;

        
        
        
        

        //Model positioning
        var assetsManager = new BABYLON.AssetsManager(scene);
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/mountain_merged_scene_3.babylon");
        var snowboardMeshTask = assetsManager.addMeshTask("", "", "models/snowboarder.babylon");

        snowboardMeshTask.onSuccess = task => {
        
        
        let i;
        for(i=0; i < task.loadedMeshes.length; i++){
            task.loadedMeshes[i].position = new BABYLON.Vector3(-9.758738, 29.65, -8.740); 
            task.loadedMeshes[i].rotation.y = 2.18;
            task.loadedMeshes[i].rotation.z = 0.2;
            box.addChild(task.loadedMeshes[i]);
        };
        };
       
        
        mountainMeshTask.onSuccess = task => {
        let terrain,mountainAnimatable,snowboarderIdleAnimatable;
        
        let i;
        for(i=1; i < task.loadedMeshes.length; i++){
            console.log(task.loadedMeshes[i].name);
            task.loadedMeshes[0].addChild(task.loadedMeshes[i]);
        };
        
        terrain = task.loadedMeshes[0];
        let t1 = -5.8;
        let t = 2.6;

        terrain.position = new BABYLON.Vector3(-2.875111-(3.2613009 * t1) ,28.6604 + (2.2135299999999987 * t1), 1.3026-(4.8864 * t1))
        
        //Jump click event listener
        let anim_jump_ended = true;
        let firstJump = true;
        
        //Add box to check for end of scene collission
        let endBox = BABYLON.MeshBuilder.CreateBox("Box",{height: 0.42, width: 1, depth: 0.84} ,scene);
        endBox.position = new BABYLON.Vector3(20.79827270, 18.342038725, 36.211586642); 
        endBox.rotation.x = 1.75;
        endBox.rotation.y = .67;
        endBox.rotation.z = 0;
        endBox.visibility = 0;
        task.loadedMeshes[0].addChild(endBox);

          

        
        function startRun(){
        
        //Terrain
            let anim_terrain = new BABYLON.Animation("terrain_anim", "position", 60,BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            
            let anim_terrain_keys = [];
            anim_terrain_keys.push({ frame: 0, value: terrain.position}); 
            anim_terrain_keys.push({ frame: 280, value: new BABYLON.Vector3(-7.5875111-(3.2613009 * t) ,27.75, -5.3026-(4.8864 * t))});
            anim_terrain.setKeys(anim_terrain_keys);
        
            terrain.animations = [];
            
            mountainAnimatable = scene.beginDirectAnimation(terrain, [anim_terrain], 0, 280, false, 0.25, ()=>{
                //startRun();
                //Start camera move animation into scene 3 and snowboarder stop animation
                score = 0;
            }); 

            let skeleton = scene.getSkeletonByName("Armature");
            let snowboarderIdleAnimatable = skeleton.beginAnimation("idle", true, 2);
            

            
            scene.onPointerObservable.add((pointerInfo) => {
                if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN){
    
                            console.log(pointerInfo.pickInfo.pickedPoint);
                            
                            if(box.position.y < 30.3){
                                
                                //scene.stopAnimation(skeleton);
                                if (!animRunning){
                                    cameraJump();
                                }
                            }
                            
                        
                }
        });
            
        };

        function cameraJump() { 
		
            let cam = box;
            cam.animations = [];
            
            var a = new BABYLON.Animation(
                "a",
                "position.y", 60,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            
            // Animation keys
            var keys = [];
            keys.push({ frame: 0, value: 30 });
            keys.push({ frame: 8, value: 30.6 });
            keys.push({ frame: 16, value: 30.6 });
            keys.push({ frame: 23, value: 30 });
            a.setKeys(keys);
            
            var easingFunction = new BABYLON.CircleEase();
            easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            a.setEasingFunction(easingFunction);
            
            
            let cameraJumpAnimatable = scene.beginDirectAnimation(cam, [a],0, 23, false, 0.55, ()=>{
                anim_jump_ended = true;
            });
            
            let skeleton = scene.getSkeletonByName("Armature");
            let snowboarderJumpAnimatable = skeleton.beginAnimation("jump", false, 1.8, ()=>{
                snowboarderIdleAnimatable = skeleton.beginAnimation("idle", true, 2);
            });
        };

        function resetScene(snowboarderFallAnimatable){
            score++;
            animRunning = false;
            attempts++;
            let labelAttempts = document.getElementById('labelAttempts');
            labelAttempts.textContent = attempts;
            

            mountainAnimatable.pause();
            snowboarderIdleAnimatable.pause();
            mountainAnimatable.reset();
            snowboarderFallAnimatable.reset();
            window.setTimeout(()=>{
                hits = 0;
                snowboarderFallAnimatable.reset();
            },1000);

            var button = document.createElement("button");
            button.style.top = (window.innerHeight / 2) - 30 + "px";
            button.style.left = (window.innerWidth / 2) - 75 + "px";
            button.textContent = "Retry";
            button.style.width = "150px"
            button.style.height = "60px"
        
            button.setAttribute = ("id", "but");
            button.classList.add('btn--action');
            button.style.position = "absolute";
        
            document.body.appendChild(button);
        
            button.addEventListener("click", () => {
                startRun();
                fadeIn(button, 200);
            })
            
        }

        let obstacle = [];
        let b;
        for (b=1; b < task.loadedMeshes.length; b++){
            obstacle.push(task.loadedMeshes[b])
        };

      
        //Collision
        scene.registerBeforeRender(()=>{
            let skeleton = scene.getSkeletonByName('Armature');
            let j;
            for (j=0; j < obstacle.length; j++){
                if (obstacle[j].intersectsMesh(box, true)){
                
                   mountainAnimatable.speedRatio = 0.039;
                   //console.log('hit');
                   if (hits == 0){
                    
                    let snowboarderFallAnimatable = skeleton.beginAnimation('fall', false, 0.9, ()=>{
                        snowboarderFallAnimatable.reset();
                        resetScene(snowboarderFallAnimatable);
                        let el = document.getElementById('screen-whiteout');
                        fadeIn(el,2000);             
                    });
                    window.setTimeout(()=>{
                        fadeOut(400);
                    },900); 
                    hits++
                    animRunning = true;

                
                   };
                   
                   
                    
                    
                };
            };
            //End box collision
            if (box.intersectsMesh(endBox, true) && endHits == 0){
                endHits++;

                mountainAnimatable.speedRatio = 0.04;
                //End of scene camera animations
                let animCameraEnd = new BABYLON.Animation("cameraPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
                let keysCameraEnd = [];
    
                keysCameraEnd.push({
                    frame: 0,
                    value: camera.position
                });
    
                keysCameraEnd.push({
                    frame: 100,
                    value: new BABYLON.Vector3(-8.6596561555, 29.41155507, -8.039254)
                });
    
                let bezierEase2 = new BABYLON.BezierCurveEase(.22,1,.84,1);
                animCameraEnd.setKeys(keysCameraEnd);
                animCameraEnd.setEasingFunction(bezierEase2);
    
                
    
                //Camera target animation
                let animCameraTargetEnd = new BABYLON.Animation("cameralandingTargetAnimation", "lockedTarget", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                let keysCameraTargetEnd = [];
    
                keysCameraTargetEnd.push({
                    frame: 0,
                    value: new BABYLON.Vector3(-9.933531,29.9,-7.30017 )
                });
    
                keysCameraTargetEnd.push({
                    frame: 100,
                    value: new BABYLON.Vector3(-9.463078468,29.91099740,-8.26246478)
                });
    
                animCameraTargetEnd.setKeys(keysCameraTargetEnd);
                animCameraTargetEnd.setEasingFunction(bezierEase2);
    
                scene.beginDirectAnimation(camera, [animCameraEnd, animCameraTargetEnd], 0, 100, false);
                window.setTimeout(()=>{
                    let skeleton = scene.getSkeletonByName("Armature");
                    snowboarderEndAnimatable = skeleton.beginAnimation("end", false, 0.8);

                    window.setTimeout(()=>{
                        fadeOut(350);

                    
                        const anchor = document.createElement("a");
                        anchor.setAttribute("rel", "ar");
                        anchor.appendChild(document.createElement("img"));
                        anchor.setAttribute("href", 'https://developer.apple.com/augmented-reality/quick-look/models/biplane/toy_biplane.usdz');
                        anchor.click();
                          

                    },1300);

                },800);
            }
        });
        
        
         
        };

        
        
        assetsManager.load();


        function startScene(){
            //Camera pos animation
            let animCamera = new BABYLON.Animation("cameraPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
            let keysCamera = [];

            keysCamera.push({
                frame: 0,
                value: camera.position
            });

            keysCamera.push({
                frame: 400,
                value: new BABYLON.Vector3(-6.929985, 30.7, -9)
            });

            let bezierEase2 = new BABYLON.BezierCurveEase(.22,1,.84,1);
            animCamera.setKeys(keysCamera);
            animCamera.setEasingFunction(bezierEase2);

            

            //Camera target animation
            let animCameraTarget = new BABYLON.Animation("cameralandingTargetAnimation", "lockedTarget", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            let keysCameraTarget = [];

            keysCameraTarget.push({
                frame: 0,
                value: new BABYLON.Vector3(-9.57924162818 , 29, -8.817296324)
            });

            keysCameraTarget.push({
                frame: 400,
                value: new BABYLON.Vector3(-9.933531,29.9,-7.30017)
            });

            animCameraTarget.setKeys(keysCameraTarget);
            animCameraTarget.setEasingFunction(bezierEase2);

            scene.beginDirectAnimation(camera, [animCamera, animCameraTarget], 0, 400, false);

            var labelAttempts = document.createElement("div");
            labelAttempts.style.top = "25px";
            labelAttempts.style.right = "20px";
            labelAttempts.textContent = attempts;
            labelAttempts.style.width = "110px"
            labelAttempts.style.height = "40px"
            labelAttempts.classList.add('txt');
            labelAttempts.setAttribute("id", "labelAttempts");
            labelAttempts.style.position = "absolute";
        
            document.body.appendChild(labelAttempts);

            let imgAttempts = document.createElement('img');
            imgAttempts.src = "images/attempts.png";
            imgAttempts.style.width = "48px";
            imgAttempts.style.top = "26px";
            imgAttempts.style.right = "57px";
            imgAttempts.style.position = "absolute";
            
            document.body.appendChild(imgAttempts);

        }

        function fadeOut(time) {
            //White screen
            var el = document.createElement("div");
            
            
            el.style.opacity = 0;
            el.style.top = '0px';
            el.style.left = '0px';
            el.style.position = 'absolute';
            el.style.height = window.innerWidth + 'px';
            el.style.width = window.innerWidth + 'px';
            el.style.display = 'block';
            el.style.background = '#fff';
            el.style.overflow = 'hidden';
            el.setAttribute("id", "screen-whiteout");
            
            document.body.appendChild(el);

            var last = +new Date();
            var tick = function() {
              el.style.opacity = +el.style.opacity + (new Date() - last) / time;
              last = +new Date();
          
              if (+el.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
              }
            };
          
            tick();
          }

          function fadeIn(el, time) {
            
            el.style.opacity = 1;
         
            var last = +new Date();
            var tick = function() {
              el.style.opacity = +el.style.opacity - (new Date() - last) / time;
              last = +new Date();
          
              if (+el.style.opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
              }
            };
          
            tick();
            window.setTimeout(()=>{
                el.remove();
            }, time + 100)
          }
        

          scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN){
    
                        console.log(pointerInfo.pickInfo.pickedPoint);
                       
                        
                    
            }
    });

        return scene;    
            };
    
    //Call the createScene function
    var scene1 = createScene1();
    var scene2 = createScene2();
    var scene3 = createScene3();
    var scene4 = createScene4();
    
    //Run the render loop

    engine.runRenderLoop(function(){
    if (currentScene === 1 ){
            scene1.render();
        } else if (currentScene === 2){
            scene1.dispose();
            scene2.render();
           
        } else if (currentScene === 3){
            scene2.dispose();
            scene3.render();
        } else if (currentScene === 4){
            scene3.dispose();
            scene4.render();
        }
        //scene4.render();
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
    
    
    