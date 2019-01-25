THREE.DepthOfField = {

	uniforms: {
		"tDiffuse": { value: null },
		"tDepth": {value: null},
		"tOriginal": {value: null},

		"u_resolution": {type: "v2", value: new THREE.Vector2()},
	},

	vertexShader: [
		`
		varying vec3 viewZ;
		varying float depth;
		varying vec3 p;
		varying vec2 vUv;
		void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			viewZ = (modelViewMatrix * vec4(position.xyz, 1.)).xyz;
			vUv = uv;
    }
		`
	].join( "\n" ),

	fragmentShader: [
		`
		uniform sampler2D tDiffuse;
		uniform sampler2D tDepth;
		uniform sampler2D tOriginal;
		uniform vec2 u_resolution;

		varying vec3 viewZ;
		varying vec3 p;
		varying vec2 vUv;

		#include <packing>

		float readDepth( sampler2D depthSampler, vec2 coord ) {
			float fragCoordZ = texture2D( depthSampler, coord ).x;
			float viewZ = perspectiveDepthToViewZ( fragCoordZ, 1.0, 4000.0 );
			return viewZToOrthographicDepth( viewZ, 1.0, 4000.0 );
		}

		void main(){
			float depth = readDepth( tDepth, vUv );
			vec4 blurredColor = texture2D( tDiffuse, vUv );
			vec4 initialColor = texture2D( tOriginal, vUv );
			vec4 u = vec4(0.0, 0.0, 0.0, 1.0);
			gl_FragColor = mix(blurredColor, initialColor, 1.0 - depth);
		}
		`
	].join( "\n" )
};
