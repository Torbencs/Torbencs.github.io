

window.addEventListener('DOMContentLoaded', function(){

// get the canvas DOM element
var canvas = document.getElementById('renderCanvas');

// load the 3D engine
var engine = new BABYLON.Engine(canvas, true);

// createScene function that creates and return the scene
var createScene = function () {



    let gravityY = -100;
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
        document.getElementById('text_1').innerHTML = event.alpha;
        gravityX = event.gamma;
        gravityZ = event.beta * -1;
        document.getElementById('text_2').innerHTML = event.beta; //z
        document.getElementById('text_3').innerHTML = event.gamma; //x
        document.getElementById('text_4').innerHTML = event.absolute;
        console.log("hit orientation event");
        scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(gravityX, gravityY, gravityZ));
    };



    //Button
    let button = document.createElement("button");
    button.textContent = "Press me!!!";
    button.style.position = "absolute";
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
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI * 1.5, Math.PI /4, 80, new BABYLON.Vector3(0, 0, 0), scene);

    // Camera controls
    camera.attachControl(canvas, true);

    //Lights
    var light = new BABYLON.SpotLight("light2", new BABYLON.Vector3(-4, 5, 10), new BABYLON.Vector3(1,-1 ,-1), Math.PI / 1.5, 10, scene);
    var light2 = new BABYLON.SpotLight("light2", new BABYLON.Vector3(10, 2, 10), new BABYLON.Vector3(-1,-1 ,-1), Math.PI / 1.5, 10, scene);
    light.intensity = 0.8;
    light2.intensity = .7;

    //Light visual helpers
    var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
    lightSphere1.position = light.position;
    lightSphere1.material = new BABYLON.StandardMaterial("light2", scene);
    lightSphere1.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

    var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
    lightSphere2.position = light2.position;
    lightSphere2.material = new BABYLON.StandardMaterial("light2", scene);
    lightSphere2.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
    
    //Shadows
    shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    //Switch to test different shadow configs
    let shadow_options = 2;
    switch (shadow_options) {
        case 1:
            shadowGenerator.bias = 0.0001;
            shadowGenerator.usePoissonSampling = true;
            //shadowGenerator.useBlurExponentialShadowMap = true;
            //shadowGenerator.usePercentageCloserFiltering = true;
            shadowGenerator.frustumEdgeFalloff = 5;
            break;
        case 2:
            shadowGenerator.bias = 0.0009;
            //shadowGenerator.usePoissonSampling = true;
            //shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.usePercentageCloserFiltering = true;
            shadowGenerator.frustumEdgeFalloff = 4;
            break;

    };

    //Add imported model
    BABYLON.SceneLoader.ImportMesh("", "", "AR.babylon", scene, function (mesh) {
            
            //Assign meshes to model variable
            let curve_mesh = mesh[0];

            //Imported model positioning
            curve_mesh.position.x = 5;
            curve_mesh.position.y = -8;

            //Look at imported model
            camera.target = mesh[0];

            //Add physics to imported model
            curve_mesh.physicsImpostor = new BABYLON.PhysicsImpostor(curve_mesh, BABYLON.PhysicsImpostor.MeshImpostor, {mass: 0, friction: 0.5, restitution: 0.1});
            
            //Add material to imported model
            curve_mesh_mat = new BABYLON.StandardMaterial("curve_mesh_mat", scene);
            curve_mesh_mat.diffuseColor = new BABYLON.Color3(0.5, 0.6, 0.87);
            curve_mesh.material = curve_mesh_mat;
            
            //Add shadows to imported model
            shadowGenerator.getShadowMap().renderList.push(curve_mesh);
            curve_mesh.receiveShadows = true;
    }); 

    

    //Add BabylonJS sphere model
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 36, 0.5, scene);
    
    //Sphere model positioning
    sphere.position.y = 4;
    sphere.position.x = -3;

    //Add physics to sphere model
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1}, scene)

    //Add material to sphere model
    sphere_mat = new BABYLON.StandardMaterial("sphere", scene);
    sphere_mat.diffuseColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    sphere.material = sphere_mat;

    //Add shadows to sphere model
    shadowGenerator.getShadowMap().renderList.push(sphere);
    


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