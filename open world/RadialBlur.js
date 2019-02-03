THREE.RadialBlur = {

	uniforms: {
		"tDiffuse": { value: null },
		"u_resolution": {type: "v2", value: new THREE.Vector2()},
		"u_mouse": {type: "v2", value: new THREE.Vector2()},

	},

	vertexShader: [`
		void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`
	].join( "\n" ),

	fragmentShader: [
		`
		uniform sampler2D tDiffuse;
		uniform vec2 u_resolution;
		uniform vec2 u_mouse;


		const int sample = 30;
		const float strength = 0.2;
		void main(){
			vec2 pixel = gl_FragCoord.xy / u_resolution.xy;
			vec4 color = vec4( 0.0 );
			vec2 dir = (gl_FragCoord.xy - u_mouse) / u_resolution.xy;

			for ( int i = 0; i < sample; i++ ) {
				color += texture2D(tDiffuse, pixel + float(i) / float(sample) * dir * strength);
			}

			gl_FragColor = color/float(sample);
		}
		`
	].join( "\n" )
};
