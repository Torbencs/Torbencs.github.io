window.addEventListener('DOMContentLoaded', function(){

// get the canvas DOM element
var canvas = document.getElementById('renderCanvas');

// load the 3D engine
var engine = new BABYLON.Engine(canvas, true);

// createScene function that creates and return the scene
var createScene = function () {



    let gravityY = -10;
    let gravityX = 0;
    let gravityZ = 0;
    let permissionGranted = false;
    let nonios13device = false;

    
    
    
    // will handle first time visiting to grant access
    let onAskButtonClicked = function () {
    DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
        permissionGranted = true;
        window.addEventListener("deviceorientation", handleOrientation, true);
        
        } else {
        permissionGranted = false;
        }
        this.remove()
    }).catch(console.error)
    };
   

    // Scene and Physics
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(gravityX, gravityY, gravityZ);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    

    let handleOrientation = function (event) {
        gravityX = event.gamma * 0.8;
        gravityZ = event.beta * -0.8;
        scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(gravityX, gravityY, gravityZ));
    };



    //Button
    let button = document.createElement("button");
    button.textContent = "Press me!!!";
    button.style.position = "absolute";
    button.style.left = "0";
    button.style.top = "0";
    button.style.zIndex = 1000;
    button.addEventListener("click",function () {
        onAskButtonClicked();
    });
    canvas.parentElement.appendChild(button);

    // cleanup
    scene.onDisposeObservable.add(()=> {
        button.remove();
    });

    // Camera
    //var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI * 1.8, Math.PI /2.3, 15, new BABYLON.Vector3(10, 0, 10), scene);
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI * 1.8, Math.PI /2.3, 15, new BABYLON.Vector3(0, -30, 10), scene);
    camera.setPosition(new BABYLON.Vector3(30, -3, -9));
    //var camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), scene);
    //camera.lowerRadiusLimit = 2;
    //camera.upperRadiusLimit = 14;

    // Camera controls
    camera.attachControl(canvas, true);

    //Lights
    // Old - var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-2, 20, 15), new BABYLON.Vector3(6, -9 ,-9), Math.PI, 20, scene);

    var light_spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(35, 20, 19), new BABYLON.Vector3(-10, -9 ,-9), Math.PI, 20, scene);
    var light_hemi = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(10, 20, -20), scene);

    light_spot.intensity = 0.4;
    light_hemi.intensity = 0.9;

    light_hemi.diffuse = new BABYLON.Color3.FromHexString("#f87060");
	light_hemi.specular = new BABYLON.Color3.FromHexString("#ff7566");
    light_hemi.groundColor = new BABYLON.Color3.FromHexString("#4d231e");

    light_spot.diffuse = new BABYLON.Color3.FromHexString("#f87060");
	light_spot.specular = new BABYLON.Color3.FromHexString("#ff7566");
    light_spot.groundColor = new BABYLON.Color3.FromHexString("#4d231e");
    

    //Light visual helpers
    var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
    lightSphere1.position = light_spot.position;
    lightSphere1.material = new BABYLON.StandardMaterial("light2", scene);
    lightSphere1.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

   
    //Shadows
    shadowGenerator = new BABYLON.ShadowGenerator(1024, light_spot);
    //Switch to test different shadow configs
    let shadow_options = 2;
    switch (shadow_options) {
        case 1:
            shadowGenerator.bias = 0.0009;
            //shadowGenerator.usePoissonSampling = true;
            //shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.usePercentageCloserFiltering = true;
            shadowGenerator.frustumEdgeFalloff = 4;
            break;
        case 2:
            shadowGenerator.bias = 0.001;
            shadowGenerator.usePoissonSampling = true;
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.usePercentageCloserFiltering = true;
            shadowGenerator.frustumEdgeFalloff = 1.7;
            break;

    };

   

    //Add imported model
    BABYLON.SceneLoader.ImportMesh("", "", "plane1.babylon", scene, function (mesh) {
            
            //Assign meshes to model variable
            let curve_mesh = mesh[0];

            //Imported model positioning
            curve_mesh.position.x = 5;
            curve_mesh.position.y = -8;

            //Look at imported model
            //camera.target = mesh[0];

            //Add physics to imported model
            curve_mesh.physicsImpostor = new BABYLON.PhysicsImpostor(curve_mesh, BABYLON.PhysicsImpostor.MeshImpostor, {mass: 0, friction: 0.5, restitution: 0.1});
            
            //Add material to imported model
            curve_mesh_mat = new BABYLON.StandardMaterial("curve_mesh_mat", scene);
            //curve_mesh_mat.diffuseColor = new BABYLON.Color3.FromHexString("#f87060");
            //curve_mesh_mat.diffuseTexture = new BABYLON.Texture("matt_texture.png", scene);
            //curve_mesh_mat.diffuseTexture.uScale = 10;
            //curve_mesh_mat.diffuseTexture.vScale = 10;
            curve_mesh.material = curve_mesh_mat;
            //curve_mesh.material.specularColor = new BABYLON.Color3(0.01, 0.01, 0.01);
            curve_mesh.material.roughness = 5;
            
            //Add shadows to imported model
            shadowGenerator.getShadowMap().renderList.push(curve_mesh);
            curve_mesh.receiveShadows = true;
    }); 

    

    //Add BabylonJS sphere model
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 36, 0.5, scene);
    
    //Sphere model positioning
    sphere.position.y = 10;
    sphere.position.x = 27;
    sphere.position.z = -6

    //Add physics to sphere model
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1}, scene)

    //Add material to sphere model
    
    sphere_mat = new BABYLON.StandardMaterial("sphere", scene);
    sphere_mat.diffuseColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    sphere.material = sphere_mat;
    sphere.material.specularColor = new BABYLON.Color3(0.01, 0.01, 0.01);
    sphere.material.roughness = 5;

    //Add shadows to sphere model
    shadowGenerator.getShadowMap().renderList.push(sphere);
    
    //Post processing
    var pipeline = new BABYLON.DefaultRenderingPipeline("", true, scene);
    pipeline.samples = 4;
    pipeline.grainEnabled = true;
    pipeline.grain.intensity = 4.5;

    var kernel = 7;	
    var postProcess0 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), kernel, 1.0, camera);

    return scene;

    };

//Call the createScene function
var scene = createScene();

//Run the render loop
engine.runRenderLoop(function(){
    scene.render();
});

//Add the canvas/window resize event handler
window.addEventListener('resize', function(){
    engine.resize();
});

});