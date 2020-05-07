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
        var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 16, 3, scene);
        lightSphere1.position = new BABYLON.Vector3(3,0,0);
        lightSphere1.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere1.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

        var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 16, 3, scene);
        lightSphere2.position = new BABYLON.Vector3(-3,0,0);
        lightSphere2.material = new BABYLON.StandardMaterial("light2", scene);
        lightSphere2.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
     
        

        //Model positioning
       
      let animation1 = new BABYLON.Animation('player1Animation', 'position.y', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

      let keys_anim_1 = [{
            frame : 0,
            value : 0
        },{
            frame : 160,
            value : 40
        }];
    
        animation1.setKeys(keys_anim_1);
        
        let running_anim1, running_anim2;
        
        running_anim1 = scene.beginDirectAnimation(lightSphere1, [animation1],0,160, false, 0.8);
        running_anim2 = scene.beginDirectAnimation(lightSphere2, [animation1],0,160, false, 0.8);
        
        running_anim2.pause();
        running_anim1.pause();

        
   
        
        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
               
                    
                        
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

