window.addEventListener('DOMContentLoaded', function(){

    let sizeX = window.innerWidth;
    let sizeY = window.innerHeight;
    let click = 0;
    let animRunning = false;
    let score = 0;
  

    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');
    
    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

  
    // createScene function that creates and returns the scene
    var createScene1 = function () {
     

    
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(-6.929985, 32.7, -8), scene); 
        camera.minZ = 0.1;
        //camera.setTarget(new BABYLON.Vector3(-9.933531,29.9,-7.30017)); 
        camera.setTarget(new BABYLON.Vector3(-9.758738, 29.65, -8.740));
        
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
                alert(score);
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
            score++
            animRunning = false;
            
            mountainAnimatable.pause();
            snowboarderIdleAnimatable.pause();
            mountainAnimatable.reset();
            snowboarderFallAnimatable.reset();
            window.setTimeout(()=>{
                hits = 0;
                snowboarderFallAnimatable.reset();
            },1000);

            var button = document.createElement("button");
            button.style.top = "100px";
            button.style.right = "30px";
            button.textContent = "click";
            button.style.width = "100px"
            button.style.height = "100px"
        
            button.setAttribute = ("id", "but");
            button.style.position = "absolute";
            button.style.color = "black";
        
            document.body.appendChild(button);
        
            button.addEventListener("click", () => {
                startRun();
                button.remove();
            })
            
        }

        let obstacle = [];
        let b;
        for (b=1; b < task.loadedMeshes.length; b++){
            obstacle.push(task.loadedMeshes[b])
        };

        
       
        let skeleton = scene.getSkeletonByName('Armature');
        let hits = 0;
        scene.registerBeforeRender(()=>{
            
            let j;
            for (j=0; j < obstacle.length; j++){
                if (obstacle[j].intersectsMesh(box, true)){
                
                   startJump = 0;
                    
                   mountainAnimatable.speedRatio = 0.034;
                   console.log('hit');
                   if (hits == 0){
                    let snowboarderFallAnimatable = skeleton.beginAnimation('fall', false, 0.8, ()=>{
                        snowboarderFallAnimatable.reset();
                        resetScene(snowboarderFallAnimatable);
                        
                        
                    });
                    hits++
                    animRunning = true;
                   }
                   
                   
                    
                    
                };
            };
            
        });
        
        var button1 = document.createElement("button");
            button1.style.top = "100px";
            button1.style.right = "30px";
            button1.textContent = "click";
            button1.style.width = "100px"
            button1.style.height = "100px"
        
            button1.setAttribute = ("id", "but1");
            button1.style.position = "absolute";
            button1.style.color = "black";
        
            document.body.appendChild(button1);
        
            button1.addEventListener("click", () => {
                startScene();
                startRun();
                button1.remove();
            })

        scene1.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    //snowboarderJumpAnimatable.speedRatio = 1;
                    //cameraJumpAnimatable.speedRatio = 0.32;
                    
                    startRun();
                    if (firstJump){
                        startScene();
                        
                    }
                    firstJump = false;
                    break;
                
                
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
                frame: 200,
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
                value: new BABYLON.Vector3(-9.758738, 29.65, -8.740)
            });

            keysCameraTarget.push({
                frame: 200,
                value: new BABYLON.Vector3(-9.933531,29.9,-7.30017)
            });

            animCameraTarget.setKeys(keysCameraTarget);
            animCameraTarget.setEasingFunction(bezierEase2);

            scene.beginDirectAnimation(camera, [animCamera, animCameraTarget], 0, 200, false);

        }

       
        
        return scene;    
            };


   
   
    
    //Call the createScene function
    var scene1 = createScene1();

    //Run the render loop

    engine.runRenderLoop(function(){
    
        scene1.render();
    });
    
    //Mobile quality
    //engine.setHardwareScalingLevel(0.5)
    
  
    
    //Add the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });

    
    
    });

    