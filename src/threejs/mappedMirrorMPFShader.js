let mappedMirrorMPFShader = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform sampler2D tDiffuse;

varying vec4 vUv;
//varying vec2 vUv;
//varying vec3 vNormal;
//varying vec3 vWorldPosition;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

#ifdef USE_SPLATMAP
    uniform sampler2D textures[${length}];
    uniform sampler2D splatMaps[${length - 1}]; // one less splatmap than textures.
    varying vec2 textureUVs[${length}]; // computed in vertexshader
#endif

float blendOverlay( float base, float blend ) {

    return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

}

vec3 blendOverlay( vec3 base, vec3 blend ) {

    return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

}

vec3 colorMapping(vec3 colorIn) {
    vec3 colorOut;

    float scaleFactorR = 1.69;
    float biasR = 0.0;
    float scaleFactorG = 1.607;
    float biasG = 0.0;
    float scaleFactorB = 1.9999999;
    float biasB = 0.016;

    colorOut.r = colorIn.r * scaleFactorR + biasR;
    colorOut.g = colorIn.g * scaleFactorG + biasG;
    colorOut.b = colorIn.b * scaleFactorB + biasB;

    return colorOut;
}

void main() {
    #include <clipping_planes_fragment>
    vec4 diffuseColor = vec4( diffuse, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = emissive;

    #ifdef USE_SPLATMAP
        float splatSum = 0.0;
        for (int i = 0; i < ${length - 1}; i++) {
            splatSum += texture2D(splatMaps[i], vUv).r;
        }
        vec4 accumulated = texture2D(textures[0], textureUVs[0]).rgba * (1.0 - splatSum);
        for (int i = 1; i < ${length}; i++) {
            vec4 texel = texture2D(textures[i], textureUVs[i]);
            vec4 splatTexel = texture2D(splatMaps[i - 1], vUv);
            accumulated = mix(accumulated, texel, splatTexel.r);
        }
        //accumulated = mapTexelToLinear(accumulated);
        diffuseColor *= accumulated;
    #else
        vec4 texColor = texture2DProj(tDiffuse, vUv);
        texColor.rgb *= 1.0;
        texColor.rgb += 0.0;
        texColor.rgb = colorMapping(texColor.rgb);
        //texColor.rgb = pow(texColor.rgb, vec3(1.0/2.2)); // gamma correction
        diffuseColor = texColor;
    #endif

    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <specularmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
    #include <emissivemap_fragment>

    // accumulation
    #include <lights_phong_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>

    // modulation
    #include <aomap_fragment>

    //vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    //gl_FragColor = vec4(outgoingLight * diffuseColor.rgb, 1.0);
    //gl_FragColor = diffuseColor;

    gl_FragColor = vec4( blendOverlay( diffuseColor.rgb, diffuse ), 1.0 );

    //gl_FragColor = vec4( blendOverlay( diffuseColor.rgb, outgoingLight ), 1.0 );

    #include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`;
export default mappedMirrorMPFShader;