'use strict';
// browser-sync start --server -f -w


THREE.fbmShader = {

	uniforms: {

		// "tDiffuse": { value: null },
		"u_time": {type: "f", value: 1.0},
		"u_resolution": {type: "v2", value: new THREE.Vector2()},
		"u_mouse": {type: "v2", value: new THREE.Vector2()},
		"u_octave": {type: "f", value: 6.0},
		"seed": {type: "f", value: 0}

	},

	vertexShader: [
		`void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`
	].join( "\n" ),

	fragmentShader: [`

		#ifdef GL_ES
    precision highp float;
    #endif

    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_octave;
    uniform float seed;

    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                             vec2(12.9898,78.233+seed)))*
            43758.5453123);
    }

    // Based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    // #define OCTAVES 6
    float fbm (in vec2 st) {
        // Initial values
        float value = 0.0;
        float amplitude = .5;
        float frequency = 0.;
        //
        // Loop of octaves
        const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

        for (int i = 0; i < 100; i++) {
            if(i == int(u_octave)){
              break;
            }
            value += amplitude * noise(st);
            st = m*st*2.;
            // Commenter st pour un autre effet
            amplitude *= .5;
        }
        return value;
    }

    void main() {
        //vec2 st = gl_FragCoord.xy/u_resolution.y;
        vec2 st = (-u_resolution.xy+2.0*gl_FragCoord.xy)/u_resolution.y;
        //vec2 st = gl_FragCoord.xy/u_resolution.y*2.-1.;

        //st.x *= u_resolution.x/u_resolution.y;
        float dst = distance(st, (-u_resolution.xy+2.0*u_mouse)/u_resolution.y);

        vec3 color = vec3(0.0);
        vec2 q = vec2(1.0);
        vec2 r = vec2(1.0);
        vec2 m = vec2(1.0);
        vec2 n = vec2(1.0);
        q.x = fbm(st*3.0 + vec2(0.0, 0.0));
        q.y = fbm(st*3.0 + vec2(5.2, 1.3));

        r.x = fbm(st*3.0 + q*3.0 + vec2(0.730,.210));
        r.y = fbm(st*3.0 + q*3.0 + vec2(9.2, .8));

        m.x = fbm(st*3.0 + r*3.0 + vec2(0.1730,.210) - u_time*0.0018);
        m.y = fbm(st*3.0 + r*3.0 + vec2(0.30,.210) + u_time*0.02781);
        //
        // n.x = fbm(st*3.0 + m*3.0 + vec2(0.1730,.210) + u_time*0.0478);
        // n.y = fbm(st*3.0 + m*3.0 + vec2(0.30,.210) - u_time*0.0098);
        float f = fbm(st*3.0 + m*3.);

        color += fbm(st*3.0 + m*3.);
        //color = mix(color, vec3(0.783, 0.1, 0.5), 0.5);
        color = mix(color, vec3(.8, 0.1, 0.), clamp(1.-dst, -1., 1.));

        gl_FragColor = vec4((f*f*f+0.6*f*f+0.5*f)*color, 1.0);

    }`
	].join( "\n" )
};

THREE.blurShader = {

	uniforms: {
		"tDiffuse": { value: null },
		"u_resolution": {type: "v2", value: new THREE.Vector2()},
	},

	vertexShader: [
		`void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`
	].join( "\n" ),

	fragmentShader: [`
		uniform sampler2D tDiffuse;
		uniform vec2 u_resolution;

		void main(){
			vec4 u=vec4(0.0);
			u+=texture2D(tDiffuse,(gl_FragCoord.xy+vec2(-1.0,-1.0))/u_resolution.xy);
			u+=texture2D(tDiffuse,(gl_FragCoord.xy+vec2( 0.0,-1.0))/u_resolution.xy);
			u+=texture2D(tDiffuse,(gl_FragCoord.xy+vec2( 1.0,-1.0))/u_resolution.xy);
			u+=texture2D(tDiffuse,(gl_FragCoord.xy+vec2(-1.0, 0.0))/u_resolution.xy);
			u+=texture2D(tDiffuse,(gl_FragCoord.xy+vec2( 1.0, 0.0))/u_resolution.xy);
			u+=texture2D(tDiffuse,(gl_FragCoord.xy+vec2(-1.0, 1.0))/u_resolution.xy);
			u+=texture2D(tDiffuse,(gl_FragCoord.xy+vec2( 0.0, 1.0))/u_resolution.xy);
			u+=texture2D(tDiffuse,(gl_FragCoord.xy+vec2( 1.0, 1.0))/u_resolution.xy);

			gl_FragColor = u/8.0;
		}
		`
	].join( "\n" )
};

let pj = document.getElementsByClassName('projectLink')

Array.from(pj).forEach(function(element){
  element.addEventListener('mouseover', function(e){
    document.getElementById("myCanvas").setAttribute("class", "blurred")
    Array.from(document.getElementsByClassName("projectLink")).forEach( elem => {
      if(elem != element){
        elem.setAttribute("class", "projectLink blurred")

      }
      else{
        elem.setAttribute("class", "projectLink")

      }
    })
  })
  element.addEventListener('mouseout', function(e){
    document.getElementById("myCanvas").setAttribute("class", "notBlurred")
    Array.from(document.getElementsByClassName("projectLink")).forEach( elem => elem.setAttribute("class", "projectLink notBlurred"))
  });
})

// Array.from(pj).forEach(function(element) {
//   element.addEventListener('mousemove', function(e){
//     console.log('oui')
//   });
// });


var uniforms
var scene, camera, fieldOfView, aspectRatio, height, width, nearPlane, farPlane, renderer, container

const init = function(){
  createScene()
  //createLights() // A ajouter
  createMesh()
  resizeScene() // A appeler dans create scene ?
  loop()
}

const loop = function(){
  render()
  interpolate()
  requestAnimationFrame(loop)
}

const render = function(){
  pass.uniforms.u_time.value += 60/1000
  // renderer.render( scene, camera )
	composer.render()
}

var composer, pass, pass2, pass3, pass4
const createScene = function(){
  scene = new THREE.Scene()

  aspectRatio = width / height
	fieldOfView = 60
	nearPlane = 1
	farPlane = 40000
  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
	camera.rotation.order = 'YXZ' // default is 'XYZ'
	camera.position.x = 0 // gauche/droite
	camera.position.z = 1 // profondeur
	camera.position.y = 0 // hauteur

  renderer = new THREE.WebGLRenderer({ // voir tous les arguments existants
		alpha: true,
		antialias: true,
		shadowMap: THREE.PCFSoftShadowMap
	});
  height = window.innerHeight
	width = window.innerWidth
	renderer.setSize(width, height)
	renderer.shadowMap.enabled = true

  container = document.getElementById( 'myContainer' )
  container.appendChild(renderer.domElement)
  document.getElementsByTagName("canvas")[0].setAttribute("id", "myCanvas")

	composer = new THREE.EffectComposer(renderer)
	composer.addPass(new THREE.RenderPass(scene, camera));
	pass = new THREE.ShaderPass( THREE.fbmShader );
	pass.uniforms.u_resolution.value.x = renderer.domElement.width
	pass.uniforms.u_resolution.value.y = renderer.domElement.height
	// pass.renderToScreen = true
	composer.addPass(pass)

	pass2 = new THREE.ShaderPass( THREE.blurShader)
	// pass2.renderToScreen = true
	pass2.uniforms.u_resolution.value.x = renderer.domElement.width
	pass2.uniforms.u_resolution.value.y = renderer.domElement.height
	composer.addPass(pass2)

	pass3 = new THREE.ShaderPass( THREE.blurShader)
	// pass3.renderToScreen = true
	pass3.uniforms.u_resolution.value.x = renderer.domElement.width
	pass3.uniforms.u_resolution.value.y = renderer.domElement.height
	composer.addPass(pass3)

	pass4 = new THREE.ShaderPass( THREE.blurShader)
	pass4.renderToScreen = true
	pass4.uniforms.u_resolution.value.x = renderer.domElement.width
	pass4.uniforms.u_resolution.value.y = renderer.domElement.height
	composer.addPass(pass4)

}
const createMesh = function(){
  var geometry = new THREE.PlaneBufferGeometry(2, 2, 4, 4)
  let seed = Math.random()*100
  uniforms = {
      u_time: {type: "f", value: 1.0},
      u_resolution: {type: "v2", value: new THREE.Vector2()},
      u_mouse: {type: "v2", value: new THREE.Vector2()},
      u_octave: {type: "f", value: 6.0},
      seed: {type: "f", value: seed},
  };

  var material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  } );

  var mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}

var targetX = 0
var targetY = 0
document.onmousemove = function(e){
  targetX = e.x
  targetY = height - e.y
  let normalized = (15-2) * (e.x / width) + 2
  console.log(Math.floor(normalized))
  uniforms.u_octave.value = Math.floor(normalized)
}
const interpolate = function(){
  uniforms.u_mouse.value.x += (targetX-uniforms.u_mouse.value.x) * 0.02
  uniforms.u_mouse.value.y += (targetY-uniforms.u_mouse.value.y) * 0.02
}

const resizeScene = function(){
  console.log('oui')
	height = window.innerHeight
	width = window.innerWidth
	camera.aspect = width / height
	camera.updateProjectionMatrix()
	renderer.setSize(width, height)
  uniforms.u_resolution.value.x = renderer.domElement.width
  uniforms.u_resolution.value.y = renderer.domElement.height
}

window.addEventListener('load', init, false); // voir l'argument false ?
window.addEventListener('resize', resizeScene, false);
