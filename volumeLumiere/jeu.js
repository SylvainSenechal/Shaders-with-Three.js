THREE.VolumetericLightShader = {
  uniforms: {
    tDiffuse: {value:null},
    lightPosition: {value: new THREE.Vector2(0.5, 0.5)},
    exposure: {value: 0.18},
    decay: {value: 0.95},
    density: {value: 0.8},
    weight: {value: 0.4},
    samples: {value: 50}
  },

  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),

  fragmentShader: [
    "varying vec2 vUv;",
    "uniform sampler2D tDiffuse;",
    "uniform vec2 lightPosition;",
    "uniform float exposure;",
    "uniform float decay;",
    "uniform float density;",
    "uniform float weight;",
    "uniform int samples;",
    "const int MAX_SAMPLES = 100;",
    "void main()",
    "{",
      "vec2 texCoord = vUv;",
      "vec2 deltaTextCoord = texCoord - lightPosition;",
      "deltaTextCoord *= 1.0 / float(samples) * density;",
      "vec4 color = texture2D(tDiffuse, texCoord);",
      "float illuminationDecay = 1.0;",
      "for(int i=0; i < MAX_SAMPLES; i++)",
      "{",
        "if(i == samples){",
          "break;",
        "}",
        "texCoord -= deltaTextCoord;",
        "vec4 sample = texture2D(tDiffuse, texCoord);",
        "sample *= illuminationDecay * weight;",
        "color += sample;",
        "illuminationDecay *= decay;",
      "}",
      "gl_FragColor = color * exposure;",
    "}"
  ].join("\n")
};

THREE.AdditiveBlendingShader = {
  uniforms: {
    tDiffuse: { value:null },
    tAdd: { value:null }
  },

  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform sampler2D tAdd;",
    "varying vec2 vUv;",
    "void main() {",
      "vec4 color = texture2D( tDiffuse, vUv );",
      "vec4 add = texture2D( tAdd, vUv );",
      "gl_FragColor = color + add;",
    "}"
  ].join("\n")
};

THREE.PassThroughShader = {
	uniforms: {
		tDiffuse: { value: null }
	},

	vertexShader: [
		"varying vec2 vUv;",
    "void main() {",
		  "vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),

	fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
			"gl_FragColor = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );",
		"}"
	].join( "\n" )
};

(function(){
  var scene, camera, renderer, composer, box, pointLight,
      occlusionComposer, occlusionRenderTarget, occlusionBox, lightSphere,
      volumetericLightShaderUniforms,
      DEFAULT_LAYER = 0,
      OCCLUSION_LAYER = 1,
      renderScale = 1,
      angle = 0,
      sphere_mesh,
      mesh;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  function setupScene(){
    var ambientLight,
        geometry,
        material;

    ambientLight = new THREE.AmbientLight(0x2c3e50);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xddddff);
    scene.add(pointLight);

    geometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
    material = new THREE.MeshBasicMaterial( { color: 0x99ddff } );
    lightSphere = new THREE.Mesh( geometry, material );
    lightSphere.layers.set( OCCLUSION_LAYER );
    scene.add( lightSphere );

    camera.position.z = 6;
  }

  function addFragmentedSphere(){
    var geometry = new THREE.DodecahedronGeometry(2.9, 0);

  var material = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0xffffff,
    shininess: 1,
    shading: THREE.FlatShading,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    wireframe:true

  });

  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  //outer frame end

  //inner world like object start

  var sphere_material = [
      new THREE.MeshLambertMaterial( { color: 0xffff00, side: THREE.DoubleSide } ),
      new THREE.MeshBasicMaterial( { transparent: true, opacity: 0 } )
  ];

  var sphere_geometry = new THREE.OctahedronGeometry( 2.7, 4 );
  // assign material to each face
  for( var i = 0; i < sphere_geometry.faces.length; i++ ) {
      sphere_geometry.faces[ i ].materialIndex = THREE.Math.randInt( 0, 1 );
  }

  sphere_geometry.sortFacesByMaterialIndex();

  sphere_mesh = new THREE.Mesh( sphere_geometry, sphere_material );
  sphere_mesh.position.set(0, 0, 0)
  mesh.add(sphere_mesh);
  sphere_mesh.layers.set( OCCLUSION_LAYER );
  }

  function setupPostprocessing(){
    var pass;

    occlusionRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth * renderScale, window.innerHeight * renderScale );
    occlusionComposer = new THREE.EffectComposer( renderer, occlusionRenderTarget);
    occlusionComposer.addPass( new THREE.RenderPass( scene, camera ) );
    pass = new THREE.ShaderPass( THREE.VolumetericLightShader );
    pass.needsSwap = false;
    occlusionComposer.addPass( pass );

    volumetericLightShaderUniforms = pass.uniforms;
    volumetericLightShaderUniforms.exposure.value = 0.5;
    volumetericLightShaderUniforms.decay.value = 0.96;
    volumetericLightShaderUniforms.density.value = 0.95;
    volumetericLightShaderUniforms.weight.value = 0.59;
    volumetericLightShaderUniforms.samples.value = 100;

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );
    pass = new THREE.ShaderPass( THREE.AdditiveBlendingShader );
    pass.uniforms.tAdd.value = occlusionRenderTarget.texture;
    composer.addPass( pass );
    pass.renderToScreen = true;
  }

  function onFrame(){
    requestAnimationFrame( onFrame );
    update();
    render();
  }

  function update(){
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.003;
  }

  function render(){
    camera.layers.set(OCCLUSION_LAYER);
    renderer.setClearColor(0x000000);
    occlusionComposer.render();

    camera.layers.set(DEFAULT_LAYER);
    renderer.setClearColor(0x090611);
    composer.render();
  }

  function addRenderTargetImage(){
    var material,
        mesh,
        folder;

    material = new THREE.ShaderMaterial( THREE.PassThroughShader );
    material.uniforms.tDiffuse.value = occlusionRenderTarget.texture;

    mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), material );
    composer.passes[1].scene.add( mesh );
    mesh.visible = false;
  }

  window.addEventListener( 'resize', function(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    var pixelRatio = renderer.getPixelRatio(),
        newWidth  = Math.floor( window.innerWidth / pixelRatio ) || 1,
        newHeight = Math.floor( window.innerHeight / pixelRatio ) || 1;

    composer.setSize( newWidth, newHeight );
    occlusionComposer.setSize( newWidth * renderScale, newHeight * renderScale );

  }, false );

  setupScene();
  setupPostprocessing();
  addFragmentedSphere();//
  addRenderTargetImage();
  onFrame();
}())
