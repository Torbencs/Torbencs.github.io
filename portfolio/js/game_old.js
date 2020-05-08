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
    
            
        var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0,20, 50), scene);
        camera.minZ = 0.1;
        camera.setTarget(new BABYLON.Vector3(0,20,0));
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
        var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 16, 1, scene);
        lightSphere1.position = new BABYLON.Vector3(3,0,0);
        lightSphere1.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere1.material.emissiveColor = new BABYLON.Color3(0, 0, 0);

        var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 16, 1, scene);
        lightSphere2.position = new BABYLON.Vector3(-3,0,0);
        lightSphere2.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere2.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
     
        

        //Model positioning
       
      let animation1 = new BABYLON.Animation('player1Animation', 'position', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

      let keys_anim_1 = [{
            frame : 0,
            value : new BABYLON.Vector3(3,0,0)
        },{
            frame : 80,
            value : new BABYLON.Vector3(15,17,0)
        },{
            frame : 160,
            value : new BABYLON.Vector3(0,40,0)
        }];
    
        animation1.setKeys(keys_anim_1);

        let animation2 = new BABYLON.Animation('player1Animation', 'position', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        let keys_anim_2 = [{
              frame : 0,
              value : new BABYLON.Vector3(-3,0,0)
          },{
              frame : 80,
              value : new BABYLON.Vector3(5,21,0)
          },{
            frame : 120,
            value : new BABYLON.Vector3(4,30,0)
          },{
              frame : 180,
              value : new BABYLON.Vector3(-2,40,0)
          }];
      
          animation2.setKeys(keys_anim_2);
        
        let running_anim1, running_anim2;
        
        running_anim1 = scene.beginDirectAnimation(lightSphere1, [animation1],0,160, false, );
        running_anim2 = scene.beginDirectAnimation(lightSphere2, [animation2],0,180, false, );
        
        running_anim2.pause();
        running_anim1.pause();

        
   let startTime = 0;
   
        
        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
               
                if (startTime == 0){
                    let d = new Date();
                    startTime = d.getTime();
                }
                    
                        
                        running_anim2.pause();
                 
                       
                        running_anim1.pause();
                    
                
                    window.setTimeout(()=>{
                        click ++;

                        if (click % 2 == 0){
                            running_anim1.pause();
                            running_anim2.restart();
                        } else {
                            running_anim2.pause();
                            running_anim1.restart();
                        }
                    },500);                          
            }
         });

         
            var path = [];
            
            setCatenryPath(lightSphere1.position, lightSphere2.position, 18, 14, path);
            
            var chain = BABYLON.MeshBuilder.CreateTube("tube", { path: path, radius: 0.05, updatable: true }, scene);
            
            
            scene.registerBeforeRender(function () {
                setCatenryPath(lightSphere1.position, lightSphere2.position, 18, 14, path);
            
                BABYLON.MeshBuilder.CreateTube("tube", { path: path, radius: 0.05, updatable: true, instance: chain }, null);

                var V = lightSphere2.position.subtract(lightSphere1.position);
                if (V.length() > 17.95){
                    running_anim1.pause();
                    running_anim2.pause();
                };

                
                if (lightSphere2.position.y == 40 && lightSphere1.position.y == 40){
                    let d = new Date();
                    alert(d.getTime() - startTime);
                }
            });


        
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

let pythagorean = function(a,b,x,y) {
    return Math.sqrt(Math.pow((a - x), 2) + Math.pow((b - y), 2))
};

let game_control = {
    
 

    "start" : mesh => {
        let pause = window.setTimeout(()=>{
            mesh.position.y += 0.05;
        },2000)
    },

    /**
 * @param {string} mesh - Mesh to animate
 */
    "stop" : mesh => {
        mesh.position.y = mesh.position.y;
    },

}


function setCatenryPath(v0, v1, l, steps, path) {  //vo and v1 are Vector3 positions, l is length of chain, steps in generating path for tube
    //Direction from v0 towards v1, V
    
    var V = v1.subtract(v0);

    //Distance between v0 and v1
    var D = V.length();

    if(l<D) {
        l = D;
        if (path[0]) {
            path[0].x = v0.x;
            path[0].y = v0.y;
            path[0].z = v0.z;
            path[1].x = v1.x;
            path[1].y = v1.y;
            path[1].z = v1.z;
        } else {
            path[0] = v0;
            path[1] = v1;
        }
        return;
    }

    //Horizontal direction from v0 towards v1, cx
    var cx = new BABYLON.Vector2(V.x, V.z);
    
    //Horizontal distance between v0 and v1, d
    var d = cx.length();

    cx.normalize();

    //Height of v0 is v0.y, height of v1 is v1.y
    var maxH = Math.max(v0.y, v1.y);
    var minH = Math.min(v0.y, v1.y);
    var r = 2*Math.sqrt((v1.y-v0.y+l)*(l+v0.y-v1.y)/(d*d));
    var p = Math.log(r)+Math.log(Math.log(r));
    var q = Math.log(r);
    while (Math.abs(p - q) > 0.0000001) {
        q = Math.log(r*p + Math.exp((-1)*p));
        p = Math.log(r*q + Math.exp((-1)*q));
    }
    var b = (p + q)/d;
    var c = (1/b)*Math.log((b*(v0.y - v1.y + l))/(1-Math.exp((-1)*b*d)));
    var a = v0.y - (0.5/b)*(Math.exp(b*c)+Math.exp((-1)*b*c));

    function height(t) {
         return a + (1/b) * Math.cosh(b *(t - c));
    }

    var step = d/steps;
    
    var j = 0;
    
    for (var i = 0; i <= d; i += step) {
        
        var y = height(i);
        var vx = cx.scale(i);
        if (path[j]) {
            path[j].x = vx.x + v0.x;
            path[j].y = y;
            path[j].z = vx.y + v0.z;
        } else {
            path[j] = new BABYLON.Vector3(vx.x + v0.x, y, vx.y + v0.z);
        }
        j++;
    }
}