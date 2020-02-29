let scene, camera, renderer, cube, loader, controls;


function init() {
    scene = new THREE.Scene();
//Camera

    camera = new THREE.PerspectiveCamera(
        40, 
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 3;
    camera.position.y = 0.9;

//Renderer
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

//Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target = new THREE.Vector3(0,1,-1);
    controls.update();

//Motion
    motion = new THREE.MotionControls(cube);
    motion.update();
    
//Responsive
window.addEventListener( 'resize', () => {
    let width = window.innerWidth
    let height = window.innerHeight
    renderer.setSize( width, height )
    camera.aspect = width / height
    camera.updateProjectionMatrix()
})

//Cube
    const geometry = new THREE.BoxGeometry(2,2,2);
    const material = new THREE.MeshStandardMaterial({color: 0x0000ff});
    cube = new THREE.Mesh(geometry, material);
    
//Light
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.8);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0,0,5);

//Model
    loader = new THREE.GLTFLoader();

    loader.load( 'room.glb', function ( gltf ) {

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );


//Scene
    scene.add(cube, ambientLight, pointLight);

}

function animate() {
    requestAnimationFrame(animate)

   

    renderer.render(scene, camera);
}
init();
animate();