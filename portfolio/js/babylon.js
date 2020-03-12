window.addEventListener('DOMContentLoaded', function(){

    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');
    
    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);
    
    // createScene function that creates and return the scene
    var createScene = function () {
        let hey_mesh;
    

    
        // Scene and Physics
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        
    
            
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 1.4, new BABYLON.Vector3(0, 0, 0), scene);
        //camera.setPosition(new BABYLON.Vector3(1.2, 1.2, -0.4));
        
    
        // Camera controls
        camera.attachControl(canvas, true);
    
        //Lights
        // Old - var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-2, 20, 15), new BABYLON.Vector3(6, -9 ,-9), Math.PI, 20, scene);
    
        var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-2, 2, -2), new BABYLON.Vector3(1, -1 ,1), Math.PI/2, 2, scene);
        var light_hemi = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(20, 20, 0), scene);
        
    
        light_spot.intensity = 0.7;
        light_hemi.intensity = .9;

   
        //Light visual helpers
        var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 16, 0.3, scene);
        lightSphere1.position = light_spot.position;
        lightSphere1.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere1.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
    
  
    
        //Shadows
        shadowGenerator = new BABYLON.ShadowGenerator(1024, light_spot);
        //Switch to test different shadow configs
        let shadow_options = 2;
        switch (shadow_options) {
            case 1:
                shadowGenerator.bias = 0.0000001;
                //shadowGenerator.usePoissonSampling = true;
                //shadowGenerator.useBlurExponentialShadowMap = true;
                shadowGenerator.usePercentageCloserFiltering = true;
                shadowGenerator.frustumEdgeFalloff = 5;
                shadowGenerator.darkness = 0;
                break;
            case 2:
                shadowGenerator.bias = 0.01;
                //shadowGenerator.usePoissonSampling = true;
                //shadowGenerator.useBlurExponentialShadowMap = true;
                shadowGenerator.usePercentageCloserFiltering = true;
                shadowGenerator.frustumEdgeFalloff = 2;
                shadowGenerator.darkness = 0.7;
                break;
    
        };
    
    
    
        //Add imported model
        BABYLON.SceneLoader.ImportMesh("", "", "models/landingpage.babylon", scene, function (mesh) {
                
                //Assign meshes to model variable
                hey_mesh = mesh[1];
    
                hey_mesh_mat = new BABYLON.StandardMaterial("hey_mesh_mat", scene);
                hey_mesh_mat.diffuseColor = new BABYLON.Color3.FromHexString("#4ecdc4");
                hey_mesh.specularColor = new BABYLON.Color3.FromHexString("#000000");
                hey_mesh.material = hey_mesh_mat;
    
               

                let plane_mesh = mesh[0];
                
                plane_mesh.material = new BABYLON.ShadowOnlyMaterial('shadowOnly', scene)
                
                //Add shadows to imported model
                shadowGenerator.getShadowMap().renderList.push(hey_mesh);
                hey_mesh.receiveShadows = true;
                plane_mesh.receiveShadows = true;
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
    engine.setHardwareScalingLevel(0.5)

    
    
    //Add the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
    
    });