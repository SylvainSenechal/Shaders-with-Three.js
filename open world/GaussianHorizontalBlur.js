THREE.GaussianHorizontalBlur = {

	uniforms: {
		"tDiffuse": { value: null },
		"u_resolution": {type: "v2", value: new THREE.Vector2()},
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
		float offset = 1.0;
		void main(){
			vec2 pixel = gl_FragCoord.xy / u_resolution.xy;
			vec4 color = vec4(0.0);
			color += texture2D(tDiffuse, pixel + vec2(-5.0*offset, 0.0) / u_resolution.xy ) * 0.055037;
			color += texture2D(tDiffuse, pixel + vec2(-4.0*offset, 0.0) / u_resolution.xy ) * 0.072806;
			color += texture2D(tDiffuse, pixel + vec2(-3.0*offset, 0.0) / u_resolution.xy ) * 0.090506;
			color += texture2D(tDiffuse, pixel + vec2(-2.0*offset, 0.0) / u_resolution.xy ) * 0.105726;
			color += texture2D(tDiffuse, pixel + vec2(-1.0*offset, 0.0) / u_resolution.xy ) * 0.116061;
			color += texture2D(tDiffuse, pixel + vec2(0.0*offset, 0.0) / u_resolution.xy ) * 0.119726;
			color += texture2D(tDiffuse, pixel + vec2(1.0*offset, 0.0) / u_resolution.xy ) * 0.116061;
			color += texture2D(tDiffuse, pixel + vec2(2.0*offset, 0.0) / u_resolution.xy ) * 0.105726;
			color += texture2D(tDiffuse, pixel + vec2(3.0*offset, 0.0) / u_resolution.xy ) * 0.090506;
			color += texture2D(tDiffuse, pixel + vec2(4.0*offset, 0.0) / u_resolution.xy ) * 0.072806;
			color += texture2D(tDiffuse, pixel + vec2(5.0*offset, 0.0) / u_resolution.xy ) * 0.055037;



			// color += texture2D(tDiffuse, pixel + vec2(-7.0*offset, 0.0) / u_resolution.xy ) * 0.042704;
			// color += texture2D(tDiffuse, pixel + vec2(-6.0*offset, 0.0) / u_resolution.xy ) * 0.051133;
			// color += texture2D(tDiffuse, pixel + vec2(-5.0*offset, 0.0) / u_resolution.xy ) * 0.059552;
			// color += texture2D(tDiffuse, pixel + vec2(-4.0*offset, 0.0) / u_resolution.xy ) * 0.067462;
			// color += texture2D(tDiffuse, pixel + vec2(-3.0*offset, 0.0) / u_resolution.xy ) * 0.074333;
			// color += texture2D(tDiffuse, pixel + vec2(-2.0*offset, 0.0) / u_resolution.xy ) * 0.079666;
			// color += texture2D(tDiffuse, pixel + vec2(-1.0*offset, 0.0) / u_resolution.xy ) * 0.083047;
			// color += texture2D(tDiffuse, pixel + vec2( 0.0*offset, 0.0) / u_resolution.xy ) * 0.084206;
			// color += texture2D(tDiffuse, pixel + vec2( 1.0*offset, 0.0) / u_resolution.xy ) * 0.083047;
			// color += texture2D(tDiffuse, pixel + vec2( 2.0*offset, 0.0) / u_resolution.xy ) * 0.079666;
			// color += texture2D(tDiffuse, pixel + vec2( 3.0*offset, 0.0) / u_resolution.xy ) * 0.074333;
			// color += texture2D(tDiffuse, pixel + vec2( 4.0*offset, 0.0) / u_resolution.xy ) * 0.067462;
			// color += texture2D(tDiffuse, pixel + vec2( 5.0*offset, 0.0) / u_resolution.xy ) * 0.059552;
			// color += texture2D(tDiffuse, pixel + vec2( 6.0*offset, 0.0) / u_resolution.xy ) * 0.051133;
			// color += texture2D(tDiffuse, pixel + vec2( 7.0*offset, 0.0) / u_resolution.xy ) * 0.042704;

			gl_FragColor = color;
		}
		`
	].join( "\n" )
};
