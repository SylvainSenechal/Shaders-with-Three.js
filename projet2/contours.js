const container = document.body;
const FOV = 45;
const NEAR = 0.1;
const FAR = 1000;
let height = container.clientHeight;
let width = container.clientWidth;
const ASPECT = width / height;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setClearColor(0x000000);

const canvas = renderer.domElement;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.set(-2, 2, 2);
camera.target = new THREE.Vector3(0, 0, 0);

const controls = new THREE.OrbitControls(camera, canvas);

const matNormal = new THREE.MeshPhongMaterial( { color: 0xff0099, flatShading: true } );
// new THREE.MeshNormalMaterial();
const floorGeo = new THREE.PlaneBufferGeometry(2.0, 2.0);
const floor = new THREE.Mesh(floorGeo, matNormal);
floor.position.set(0, -0.5, 0);
floor.rotation.x = -((Math.PI * 90) / 180);

const sphereGeo = new THREE.SphereBufferGeometry(0.5, 32, 32);
const sphere = new THREE.Mesh(sphereGeo, matNormal);

scene.add(floor);
scene.add(sphere);
scene.add(camera);

scene.add( new THREE.AmbientLight( 0x222222 ) );
light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 3, 3, 3 );
scene.add( light );

var params = {
				exposure: 1,
				bloomStrength: 1.5,
				bloomThreshold: 0,
				bloomRadius: 0
			};
const composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));
// var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
// bloomPass.renderToScreen = true;
// bloomPass.threshold = params.bloomThreshold;
// bloomPass.strength = params.bloomStrength;
// bloomPass.radius = params.bloomRadius;
// composer.addPass(bloomPass)

var effect = new THREE.BloomPass()
effect.renderToScreen = true
composer.addPass( effect )

// var effect = new THREE.ShaderPass( THREE.DotScreenShader)
// effect.renderToScreen = true
// composer.addPass(effect)

// var effect = new  THREE.BloomPass(0.5)
// composer.addPass( effect )
// effect.renderToScreen = true



const resize = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

const render = () => {
    const tmpHeight = container.clientHeight;
    const tmpWidth = container.clientWidth;
    if (tmpHeight !== height || tmpWidth !== width) {
        height = tmpHeight;
        width = tmpWidth;
        resize(width, height);
    }

    controls.update();

    // renderer.render(scene, camera);
    composer.render()
    requestAnimationFrame(render);
};



container.appendChild(canvas);
resize(width, height);
render();
