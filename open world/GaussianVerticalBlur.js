THREE.GaussianVerticalBlur = {

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
			// color += texture2D(tDiffuse, pixel + vec2(0.0, -7.0*offset) / u_resolution.xy ) * 0.042704;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, -6.0*offset) / u_resolution.xy ) * 0.051133;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, -5.0*offset) / u_resolution.xy ) * 0.059552;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, -4.0*offset) / u_resolution.xy ) * 0.067462;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, -3.0*offset) / u_resolution.xy ) * 0.074333;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, -2.0*offset) / u_resolution.xy ) * 0.079666;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, -1.0*offset) / u_resolution.xy ) * 0.083047;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, 0.0*offset) / u_resolution.xy ) * 0.084206;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, 1.0*offset) / u_resolution.xy ) * 0.083047;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, 2.0*offset) / u_resolution.xy ) * 0.079666;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, 3.0*offset) / u_resolution.xy ) * 0.074333;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, 4.0*offset) / u_resolution.xy ) * 0.067462;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, 5.0*offset) / u_resolution.xy ) * 0.059552;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, 6.0*offset) / u_resolution.xy ) * 0.051133;
			// color += texture2D(tDiffuse, pixel + vec2(0.0, 7.0*offset) / u_resolution.xy ) * 0.042704;

			color += texture2D(tDiffuse, pixel + vec2(0.0,-5.0*offset) / u_resolution.xy ) * 0.055037;
			color += texture2D(tDiffuse, pixel + vec2(0.0,-4.0*offset) / u_resolution.xy ) * 0.072806;
			color += texture2D(tDiffuse, pixel + vec2(0.0,-3.0*offset) / u_resolution.xy ) * 0.090506;
			color += texture2D(tDiffuse, pixel + vec2(0.0,-2.0*offset) / u_resolution.xy ) * 0.105726;
			color += texture2D(tDiffuse, pixel + vec2(0.0,-1.0*offset) / u_resolution.xy ) * 0.116061;
			color += texture2D(tDiffuse, pixel + vec2(0.0, 0.0*offset) / u_resolution.xy ) * 0.119726;
			color += texture2D(tDiffuse, pixel + vec2(0.0, 1.0*offset) / u_resolution.xy ) * 0.116061;
			color += texture2D(tDiffuse, pixel + vec2(0.0, 2.0*offset) / u_resolution.xy ) * 0.105726;
			color += texture2D(tDiffuse, pixel + vec2(0.0, 3.0*offset) / u_resolution.xy ) * 0.090506;
			color += texture2D(tDiffuse, pixel + vec2(0.0, 4.0*offset) / u_resolution.xy ) * 0.072806;
			color += texture2D(tDiffuse, pixel + vec2(0.0, 5.0*offset) / u_resolution.xy ) * 0.055037;

			gl_FragColor = color;
		}
		`
	].join( "\n" )
};
