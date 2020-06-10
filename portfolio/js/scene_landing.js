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
        var scene1 = new BABYLON.Scene(engine);
        scene1.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0,80,70), scene1);
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(0,24,0));
        camera.maxZ = 500;      

        
    
        // Camera controls
        camera.attachControl(canvas, true);
        
        // var ground = BABYLON.Mesh.CreateGround("ground1",132, 132, 2, scene1);
       
        // ground.rotation.y = Math.PI;
        // ground.position.y = 11.3;
        // ground.position.x = -5;
        // ground.position.z = -10.8;
        
        // Create and tweak the background material.
        // var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene1);
        // backgroundMaterial.diffuseTexture = new BABYLON.Texture("images/baked-alpha.png", scene1);
        // backgroundMaterial.diffuseTexture.hasAlpha = true;
        // ground.material = backgroundMaterial;


        //Lights
        // Old - var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-2, 20, 15), new BABYLON.Vector3(6, -9 ,-9), Math.PI, 20, scene1);
    
      

        var light_hemi1 = new BABYLON.HemisphericLight("hemiLight1", new BABYLON.Vector3(0, 1, 1), scene1);
        light_hemi1.intensity = 1.2;
       
   

        //Model positioning
       
        var assetsManager = new BABYLON.AssetsManager(scene1);
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/scene_1.glb");
        //var heliMeshTask = assetsManager.addMeshTask("heli", "", "models/helicopter.glb");

        mountainMeshTask.onSuccess = task => {
            mountainMesh = task.loadedMeshes[0];
            //mountainMesh.scaling = new BABYLON.Vector3(0.1, 0.1,0.1);
        }
        
        assetsManager.load();

        
        
        scene1.onPointerObservable.add((pointerInfo) => {
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
        value: new BABYLON.Vector3(0,70, 180)
        });

        keysTarget.push({
        frame: 0,
        value: new BABYLON.Vector3(0,70,0)
        });

       

        keysTarget.push({
        frame: 250,
        value: new BABYLON.Vector3(0,70,0)
        });

        keysPosition.push({
        frame: 300,
        value: new BABYLON.Vector3(0,90,90)
        });

        keysTarget.push({
        frame: 300,
        value: new BABYLON.Vector3(0,32,0)
        });
        


        keysPosition.push({
        frame: 650,
        value: new BABYLON.Vector3(0,50,29)
        });

        keysTarget.push({
        frame: 400,
        value: new BABYLON.Vector3(-39.34272594,11.3000001907,9.308567653),
        outTangent: new BABYLON.Vector3(0, 0.6, 0)
        });



        keysTarget.push({
        frame: 650,
        inTangent: new BABYLON.Vector3(0, 0, 0),
        value: new BABYLON.Vector3(0,4.39613229,0)
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
    
        scene1.beginAnimation(camera, 0, maxFrame, false, 0.35, ()=>{
            currentScene = 2;
            scene2Started = true;
        });
       
        return scene1;    
            };


    //Scene 2
    var createScene2 = function () {
        // Scene and Physics
        var scene2 = new BABYLON.Scene(engine);
        scene2.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0,50,29), scene2);
        //var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(27.1, 30, 4), scene2);
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(0,4.39613229,0));
        camera.maxZ = 500;        
        
       
        //var camera = new BABYLON.FreeCamera("freeCam", new BABYLON.Vector3( 0, 5, 4), scene2);
        
    
        // Camera controls
        camera.attachControl(canvas, true);
        
        //Lights
        // Old - var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-2, 20, 15), new BABYLON.Vector3(6, -9 ,-9), Math.PI, 20, scene2);
    

        

        var light_hemi = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 1), scene2);
        light_hemi.intensity = 1.2;
   
        
        

        //Model positioning
       
        var assetsManager = new BABYLON.AssetsManager(scene2);
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/scene_2.glb");
        var heliMeshTask = assetsManager.addMeshTask("heli", "", "models/helicopter.glb");

        mountainMeshTask.onSuccess = task => {
            mountainMesh = task.loadedMeshes[0];
            let i;
            for (i=0; i < task.loadedMeshes.length;i++){
                console.log(task.loadedMeshes[i].name)
            }



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
            
            var landingTimer = new Timer(2200, scene2, ()=>{
                landingStarted = true;
            });

            var matLetterGreen = new BABYLON.StandardMaterial("myMaterial", scene2);                          
            matLetterGreen.diffuseColor = new BABYLON.Color3(1, 0.184, 0);

            var matLetterWhite = new BABYLON.StandardMaterial("myMaterial", scene2);                          
            matLetterWhite.diffuseColor = new BABYLON.Color3(1, 1, 1);

          

           
            scene2.registerBeforeRender( () => {
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
                                let mesh = scene2.getMeshByName(meshNumber.toString());
                            
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
                                let mesh = scene2.getMeshByName(i.toString());
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
                            value: new BABYLON.Vector3(24.63419644,28, 0.392745106639)
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

                        scene2.beginDirectAnimation(camera, [animCameraLandingPos,animCameraLandingTarget], 0, 200, false);
                        landingAnimStarted = true;
                        scene2.beginAnimation(heliMesh, 0, 150, false, 0.4);
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
        value: new BABYLON.Vector3(0,4.39613229,0)
        });

       
        keysPosition.push({
        frame: 0,
        value: camera.position
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


        scene2.beginDirectAnimation(camera,[animationTarget, animationPosition], 0, maxFrame, false, 0.35, ()=>{
            scene2Started = true;
        }); 
       
    
        
       
    return scene2;
    }

    //Scene 3
    var createScene3 = function () {

        let snowboarderMesh;
        
    
    
        // Scene and Physics
        var scene3 = new BABYLON.Scene(engine);
        scene3.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
        
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(24.63419644,28, 0.392745106639), scene3);
        //var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(27.1, 30, 4), scene3);
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(23,29.02,-2.55));
        camera.maxZ = 500;        
        
        
        //var camera = new BABYLON.FreeCamera("freeCam", new BABYLON.Vector3( 0, 5, 4), scene3);
        
    
        // Camera controls
        camera.attachControl(canvas, true);
        
        //Lights
        // Old - var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-2, 20, 15), new BABYLON.Vector3(6, -9 ,-9), Math.PI, 20, scene3);
    
        var light_spot_r = new BABYLON.SpotLight("spotLightR", new BABYLON.Vector3(4, 25, 18), new BABYLON.Vector3(0, -1,-1), Math.PI/2, 2, scene3);       
        var light_spot_l = new BABYLON.SpotLight("spotLightL", new BABYLON.Vector3(25, 17, 10), new BABYLON.Vector3(-4, -1, -1), Math.PI/2, 2, scene3);
        var light_spot_r2 = new BABYLON.SpotLight("spotLightL", new BABYLON.Vector3(18, 20, 5), new BABYLON.Vector3(-1, -1, -1), Math.PI/2, 2, scene3);
    
        
    
        var light_hemi = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 1), scene3);
        
        light_spot_r.intensity = 1;
        light_spot_l.intensity = 1
        light_spot_r2.intensity = 1.4;
        light_hemi.intensity = 1.2;
    
        //Light visual helpers
        var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 16, 3, scene3);
        lightSphere1.position = light_spot_r2.position;
        lightSphere1.material = new BABYLON.StandardMaterial("light2", scene3);
        lightSphere1.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
    
       
        var assetsManager = new BABYLON.AssetsManager(scene3);
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/scene_3.glb");
        var snowboardMeshTask = assetsManager.addMeshTask("", "", "models/snowboarder_scene_3.babylon");
             
        assetsManager.load();
    
        //Model positioning
       snowboardMeshTask.onSuccess = task => {
           snowboarderMesh = task.loadedMeshes[0];
           task.loadedMeshes[0].position = new BABYLON.Vector3(-12.81225816, 34.7563176345, -14.80271683217);
           task.loadedMeshes[0].rotation.y = 0.6;

           
           
       }
       
        var bezierEase = new BABYLON.BezierCurveEase(.41,.08,.55,1);
    
            let animCameraAfterLandingPos = new BABYLON.Animation("cameralandingPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
            let keysCameraAfterLandingPos = [];
    
            keysCameraAfterLandingPos.push({
            frame: 0,
            value: new BABYLON.Vector3(24.63419644,28, 0.392745106639),
            outTangent: new BABYLON.Vector3(0, -0.01, 0)
            });
    
            keysCameraAfterLandingPos.push({
            frame: 500,
            inTangent: new BABYLON.Vector3(0.1, 0, 0),
            value: new BABYLON.Vector3(-8.4629191 ,35.5, -10.9129811883)
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
            frame: 80,
            value: new BABYLON.Vector3(23,29.02,-2.55)
            });
            //qwer
            

            keysCameraAfterLandingTarget.push({
            frame: 400,
            value: new BABYLON.Vector3(-12.4023117,35.4,-15.2198993)
            });
    
           
    
    
            animCameraAfterLandingTarget.setKeys(keysCameraAfterLandingTarget);
            animCameraAfterLandingTarget.setEasingFunction(bezierEase2);
    
           
        

            ///
            //Animation into scene 4
            
    
            let animCameraAfterSnowboarderPos = new BABYLON.Animation("cameraSnowboarderPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
            let keysCameraAfterSnowboarderPos = [];
    
           
            keysCameraAfterSnowboarderPos.push({
            frame: 0,
            value: new BABYLON.Vector3(-8.4629191 ,35.5, -10.9129811883)
            });
    
            keysCameraAfterSnowboarderPos.push({
            frame: 300,
            value: new BABYLON.Vector3(-8.273084616, 31.7, -10.0018)
            });
            animCameraAfterSnowboarderPos.setKeys(keysCameraAfterSnowboarderPos);
            animCameraAfterSnowboarderPos.setEasingFunction(bezierEase2);
    
    
            //Target animation
    
            let animCameraAfterSnowboarderTarget = new BABYLON.Animation("cameralandingTargetAnimation", "lockedTarget", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
            let keysCameraAfterSnowboarderTarget = [];
    
           
            keysCameraAfterSnowboarderTarget.push({
            frame: 0,
            value: new BABYLON.Vector3(-12.4023117,35.4,-15.2198993)
            });
    
            keysCameraAfterSnowboarderTarget.push({
            frame: 200,
            value: new BABYLON.Vector3(-9.57924162818 , 29, -8.817296324 )
            });
    
            animCameraAfterSnowboarderTarget.setKeys(keysCameraAfterSnowboarderTarget);
            animCameraAfterSnowboarderTarget.setEasingFunction(bezierEase);
            

            //Snowboarder movement animation
            let animSnowboarderPos = new BABYLON.Animation("SnowboarderPositionAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
            let keysSnowboarderPos = [];
    
           
            keysSnowboarderPos.push({
            frame: 0,
            value: new BABYLON.Vector3(-12.81225816, 34.7563176345, -14.80271683217)
            });
    
            keysSnowboarderPos.push({
            frame: 300,
            value: new BABYLON.Vector3(-9.758738, 29.65, -8.740)
            });
            animSnowboarderPos.setKeys(keysSnowboarderPos);
            animSnowboarderPos.setEasingFunction(bezierEase);

            //Snowboarder rotation
            let animSnowboarderRot = new BABYLON.Animation("SnowboarderPositionAnimation", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);               
            let keysSnowboarderRot = [];
    
           
            keysSnowboarderRot.push({
            frame: 0,
            value: new BABYLON.Vector3(0, 0.6, 0)
            });
    
            keysSnowboarderRot.push({
            frame: 300,
            value: new BABYLON.Vector3(0.2, 0.6, 0)
            });
            animSnowboarderRot.setKeys(keysSnowboarderRot);
            animSnowboarderRot.setEasingFunction(bezierEase);



            //Begin scene animations
            scene3.beginDirectAnimation(camera, [animCameraAfterLandingPos,animCameraAfterLandingTarget], 0, 500, false, 0.8, ()=>{

                let skeleton = scene3.getSkeletonByName("Armature");
                console.log(skeleton);
                let snowboarderIdleAnimatable = skeleton.beginAnimation("start", false, 1); 
                    window.setTimeout(()=>{
                        scene3.beginDirectAnimation(camera, [animCameraAfterSnowboarderPos,animCameraAfterSnowboarderTarget], 0, 550, false, 0.45);
                        scene3.beginDirectAnimation(snowboarderMesh, [animSnowboarderPos, animSnowboarderRot], 0, 300, false, 0.6, ()=>{
                            currentScene = 4;
                        });
                    
                },1100);
            });
    
            
            
       
    return scene3;
    }


    //Scene 4
   
    var createScene4 = function(){
        let click = 0;
        let animRunning = false;
        let score = 0;
        let attempts = 0;
        let hits = 0;
        let endHits = 0;
        
        // Scene and Physics
        var scene4 = new BABYLON.Scene(engine);
        scene4.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
        
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(-8.273084616, 31.7, -10.0018), scene4); 
        camera.minZ = 0.1;
        
        //camera.setTarget(new BABYLON.Vector3(-9.933531,29.9,-7.30017)); 
        camera.setTarget(new BABYLON.Vector3(-9.57924162818 , 29, -8.817296324 ));
        
        // Camera controls
        camera.attachControl(canvas, true);
        
        //Lights
    

        
        var light_hemi = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 10, 3), scene4);
   
       

        let box = BABYLON.MeshBuilder.CreateBox("Box",{height: 0.42, width: 0.2, depth: 0.54} ,scene4);
        box.position = new BABYLON.Vector3(-9.5858738, 30, -8.740); 
        box.rotation.x = 1.75;
        box.rotation.y = .67;
        box.rotation.z = 0;
        box.visibility = 0;

        
        
        
        

        //Model positioning
        let assetsManager4 = new BABYLON.AssetsManager(scene4);
        var mountainMeshTask4 = assetsManager4.addMeshTask("", "", "models/mountain_merged_scene_4.babylon");
        var snowboardMeshTask4 = assetsManager4.addMeshTask("", "", "models/snowboarder.babylon");

        snowboardMeshTask4.onSuccess = task => {
        
        
        let i;
        for(i=0; i < task.loadedMeshes.length; i++){
            task.loadedMeshes[i].position = new BABYLON.Vector3(-9.758738, 29.65, -8.740); 
            task.loadedMeshes[i].rotation.y = 2.18;
            task.loadedMeshes[i].rotation.z = 0.2;
            box.addChild(task.loadedMeshes[i]);
        };
        };
       

    
      

        
        mountainMeshTask4.onSuccess = task => {
        let terrain,mountainAnimatable,snowboarderIdleAnimatable;

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Click Me v1.1");
        button.width = 0.2;
        button.height = "40px";
        button.color = "Start";
        button.background = "Yellow";
        button.onPointerClickObservable.add(()=>{
            startScene();
            startRun();
            
            advancedTexture.dispose();
        })
        advancedTexture.addControl(button); 

        
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
        let endBox = BABYLON.MeshBuilder.CreateBox("Box",{height: 0.42, width: 1, depth: 0.84} ,scene4);
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
            
            mountainAnimatable = scene4.beginDirectAnimation(terrain, [anim_terrain], 0, 280, false, 0.25, ()=>{
                //startRun();
                //Start camera move animation into scene 3 and snowboarder stop animation
                score = 0;
            }); 

            let skeleton = scene4.getSkeletonByName("Armature");
            let snowboarderIdleAnimatable = skeleton.beginAnimation("idle", true, 2);
            

            
            scene4.onPointerObservable.add((pointerInfo) => {
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
            
            
            let cameraJumpAnimatable = scene4.beginDirectAnimation(cam, [a],0, 23, false, 0.55, ()=>{
                anim_jump_ended = true;
            });
            
            let skeleton = scene4.getSkeletonByName("Armature");
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
        scene4.registerBeforeRender(()=>{
            let skeleton = scene4.getSkeletonByName('Armature');
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
                    frame: 90,
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
                    frame: 90,
                    value: new BABYLON.Vector3(-9.463078468,29.91099740,-8.26246478)
                });
    
                animCameraTargetEnd.setKeys(keysCameraTargetEnd);
                animCameraTargetEnd.setEasingFunction(bezierEase2);
    
                scene4.beginDirectAnimation(camera, [animCameraEnd, animCameraTargetEnd], 0, 90, false);
                window.setTimeout(()=>{
                    let skeleton = scene4.getSkeletonByName("Armature");
                    snowboarderEndAnimatable = skeleton.beginAnimation("end", false, 1);

                    window.setTimeout(()=>{
                        fadeOut(300);

                    
                        const anchor = document.createElement("a");
                        anchor.setAttribute("rel", "ar");
                        anchor.appendChild(document.createElement("img"));
                        anchor.setAttribute("href", 'https://developer.apple.com/augmented-reality/quick-look/models/biplane/toy_biplane.usdz');
                        anchor.click();
                          

                    },1000);

                },800);
            }
        });
    
        
         
        };

        
        
        assetsManager4.load();


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

            scene4.beginDirectAnimation(camera, [animCamera, animCameraTarget], 0, 400, false);

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
        

        //   scene4.onPointerObservable.add((pointerInfo) => {
        //     if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN){
    
        //                 console.log(pointerInfo.pickInfo.pickedPoint);
                       
                        
                    
        //     }
    //});

        return scene4;    
            };

    
    //Call the createScene function
    var scene1 = createScene1();
    var scene2 = createScene2();
    var scene3 = createScene3();
    var scene4 = createScene4();
    
    //Run the render loop

    engine.runRenderLoop(function(){
    // if (currentScene === 1 ){
    //         scene1.render();
    //     } else if (currentScene === 2){
    //         scene1.dispose();
    //         scene2.render();
           
    //     } else if (currentScene === 3){
    //         scene2.dispose();
    //         scene3.render();
    //     } else if (currentScene === 4){
            
    //         scene3.dispose();
    //         scene4.render();
    //     }
      
        
      scene4.render();
     
    //  if (currentScene == 4){
    //      scene3.dispose();
    //      scene4.render();
    //  }
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
    
    
    