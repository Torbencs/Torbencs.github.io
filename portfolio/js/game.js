window.addEventListener('DOMContentLoaded', function(){

    let sizeX = window.innerWidth;
    let sizeY = window.innerHeight;
    let click = 0;
  
  

    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');
    
    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

  
    // createScene function that creates and returns the scene
    var createScene1 = function () {
     

    
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(-7.929985, 30.7, -9.726), scene); 
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(-9.933531,29.5,-7.50017)); 
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
   
       

        let box = BABYLON.MeshBuilder.CreateBox("Box",{height: 0.5, width: 0.2, depth: 0.2} ,scene);
        box.position = new BABYLON.Vector3(-9.758738, 30, -8.740); 

        /*let log = BABYLON.MeshBuilder.CreateBox("Log",{height: 0.2, width: 0.3, depth: 0.8} ,scene);
        log.position = new BABYLON.Vector3(-15.758738, 50, -6.740);
        log.rotation.y = 2.6; */
        
        let terrain,logmove,tree;
        

        //Model positioning
        var assetsManager = new BABYLON.AssetsManager(scene);
        var mountainMeshTask = assetsManager.addMeshTask("", "", "models/mountain_merged_scene_3.glb");
        var treeMeshTask = assetsManager.addMeshTask("","", "models/tree.babylon");
        var snowboardMeshTask = assetsManager.addMeshTask("","", "models/snowboard.babylon");
        snowboardMeshTask.onSuccess = task => {
        makeLog();
        function makeLog(){
        terrain = task.loadedMeshes[0];
        
        
        //Terrain
        let anim_terrain = new BABYLON.Animation("terrain_anim", "position", 60,BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let anim_terrain_keys = [];
        anim_terrain_keys.push({ frame: 0, value: new BABYLON.Vector3(-7.5875111, 28.1855, -5.3026)}); 
        anim_terrain_keys.push({ frame: 180, value: new BABYLON.Vector3(-10.84881272,30.39903015, -10.18902)});
        anim_terrain.setKeys(anim_terrain_keys);
       
        terrain.animations = [];
        
        logmove = scene.beginDirectAnimation(terrain, [anim_terrain], 0, 180, false, 1.3, ()=>{
            makeLog();
        });
        };

        scene.registerBeforeRender(()=>{
            
            if (terrain && terrain.intersectsMesh(box, true)) {
                console.log('touch')
                 logmove.pause();
             }
         })
         
         
        };

        treeMeshTask.onSuccess = task => {
            makeTree();
            function makeTree(){
            tree = task.loadedMeshes[0];
            
            //Terrain
            let anim_tree = new BABYLON.Animation("terrain_anim", "position", 60,BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
            let anim_tree_keys = [];
            anim_tree_keys.push({ frame: 0, value: new BABYLON.Vector3(-7.64807479, 28.972061, -3.41248)});
            anim_tree_keys.push({ frame: 180, value: new BABYLON.Vector3(-12.384976664, 31.9615294, -9.575506)});
            anim_tree.setKeys(anim_tree_keys);
           
            
            logmove = scene.beginDirectAnimation(tree, [anim_tree], 0, 180, false, 0.8, ()=>{
                makeTree();
            });
            };
        }
        
        assetsManager.load();

       

         
      
   
        let anim_jump_ended = true;
        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN){

                        console.log(pointerInfo.pickInfo.pickedPoint);
                        if(anim_jump_ended == true){
                            anim_jump_ended = false;
                            cameraJump();
                        }
                        
                    
            }
    });

   
	
        
        


        var cameraJump = function() {
		
            let cam = box;
            cam.animations = [];
            
            var a = new BABYLON.Animation(
                "a",
                "position.y", 60,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            
            // Animation keys
            var keys = [];
            keys.push({ frame: 0, value: cam.position.y });
            keys.push({ frame: 13, value: cam.position.y + 0.5 });
            keys.push({ frame: 25, value: cam.position.y });
            a.setKeys(keys);
            
            var easingFunction = new BABYLON.CircleEase();
            easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            a.setEasingFunction(easingFunction);
            
            
            scene.beginDirectAnimation(cam, [a],0, 25, false, 0.35, ()=>{
                anim_jump_ended = true;
            } );
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

    