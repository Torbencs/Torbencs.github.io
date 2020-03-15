window.addEventListener('DOMContentLoaded', function(){

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
        
    
            
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 1.4, new BABYLON.Vector3(0, 0, 0), scene);
        //camera.setPosition(new BABYLON.Vector3(1.2, 1.2, -0.4));
        
    
        // Camera controls
        camera.attachControl(canvas, true);
    
        //Lights
        // Old - var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-2, 20, 15), new BABYLON.Vector3(6, -9 ,-9), Math.PI, 20, scene);
    
        var light_spot_r = new BABYLON.SpotLight("spotLightR", new BABYLON.Vector3(-1.5, 2, 2), new BABYLON.Vector3(1, -1,-1), Math.PI/2, 2, scene);       
        var light_spot_l = new BABYLON.SpotLight("spotLightL", new BABYLON.Vector3(-2, 2, -2), new BABYLON.Vector3(1, -1, 1), Math.PI/2, 2, scene);
        var light_spot_r2 = new BABYLON.SpotLight("spotLightR2", new BABYLON.Vector3(0.81, 2, 2), new BABYLON.Vector3(1, -1,-1), Math.PI/2, 2, scene);       

        var light_hemi = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-20, 20, 0), scene);
        
        light_spot_r.intensity = 0.8;
        light_spot_l.intensity = 0.35
        light_spot_r2.intensity = 0.3;
        light_hemi.intensity = 0.6;
   
        //Light visual helpers
        var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 16, 0.3, scene);
        lightSphere1.position = light_spot_l.position;
        lightSphere1.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere1.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

        var lightSphere3 = BABYLON.Mesh.CreateSphere("sphere", 16, 0.3, scene);
        lightSphere3.position = light_spot_r.position;
        lightSphere3.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere3.material.emissiveColor = new BABYLON.Color3(1, 1, 0)
   
        var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 16, 0.3, scene);
        lightSphere2.position = light_spot_r2.position;
        lightSphere2.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere2.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
    
        //Shadows
        shadowGenerator = new BABYLON.ShadowGenerator(1024, light_spot_r);
        //Switch to test different shadow configs
        let shadow_options = 2;
        switch (shadow_options) {
            case 1:
                shadowGenerator.bias = 0.035;
                shadowGenerator.usePoissonSampling = true;
                shadowGenerator.useBlurExponentialShadowMap = true;
                shadowGenerator.frustumEdgeFalloff = 0;
                //shadowGenerator.darkness = 0.3;
                break;
            case 2:
                shadowGenerator.bias = 0.001;
                shadowGenerator.usePoissonSampling = true;
                shadowGenerator.useBlurExponentialShadowMap = true;
                shadowGenerator.frustumEdgeFalloff = 3;
                //shadowGenerator.darkness = 0.3;
                break;
    
        };

        
    
        //Add imported model
        BABYLON.SceneLoader.ImportMesh("", "", "models/landingpage.babylon", scene, function (mesh) {
                
            
                hey_mesh = mesh[0];
    
                hey_mesh_mat = new BABYLON.StandardMaterial("hey_mesh_mat", scene);
                hey_mesh_mat.diffuseColor = new BABYLON.Color3.FromHexString("#4ecdc4");
                hey_mesh.specularColor = new BABYLON.Color3.FromHexString("#000000");
                hey_mesh.material = hey_mesh_mat;
                hey_mesh.receiveShadows = true;


                im_mesh = mesh[4];
    
                im_mesh_mat = new BABYLON.StandardMaterial("im_mesh_mat", scene);
                im_mesh_mat.diffuseColor = new BABYLON.Color3.FromHexString("#4ecdc4");
                im_mesh.specularColor = new BABYLON.Color3.FromHexString("#000000");
                im_mesh.material = im_mesh_mat;
                im_mesh.receiveShadows = true;

                arrow_mesh = mesh[3];
    
                arrow_mesh_mat = new BABYLON.StandardMaterial("im_mesh_mat", scene);
                arrow_mesh_mat.diffuseColor = new BABYLON.Color3.FromHexString("#4ecdc4");
                arrow_mesh.specularColor = new BABYLON.Color3.FromHexString("#000000");
                arrow_mesh.material = arrow_mesh_mat;
                arrow_mesh.receiveShadows = true;
    
               

                hey_plane_mesh = mesh[1];
                
                hey_plane_mesh.material = new BABYLON.ShadowOnlyMaterial('shadowOnlyMat', scene);
                hey_plane_mesh.receiveShadows = true;
                
                
                im_plane_mesh = mesh[2];
                
                im_plane_mesh.material = new BABYLON.ShadowOnlyMaterial('shadowOnlyMat2', scene);
                im_plane_mesh.receiveShadows = true;
                
                
                
                //Add shadows to imported model
                shadowGenerator.addShadowCaster(hey_mesh);
                shadowGenerator.addShadowCaster(im_mesh);
                shadowGenerator.addShadowCaster(arrow_mesh);

              
                setTimeout(()=> {
                    camera.movePosiTo({ x: (im_mesh.position.x + 0.001), y: 1.4, z: camera.position.z}, 100);
                    camera.moveTargetTo({x: im_mesh.position.x, y: (hey_mesh.position.y), z: camera.position.z}, 160);
                    //camera.moveRadiusTo(5, 5);
                    //console.log(im_mesh.position.z);
                    //console.log(hey_mesh.position.z);
                }, 3000);
                
/*
                let m;
                for (m=0; m < mesh.length; m++) {
                    console.log(mesh[m].id);
                };
*/
        }); 
    
        
        //var pipeline = new BABYLON.DefaultRenderingPipeline("", true, scene);
        //pipeline.samples = 3;
        
    
        //var kernel = 4;	
        //var postProcess0 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), kernel, 1.0, camera);
        
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

    
    
    //Add the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
    
    });