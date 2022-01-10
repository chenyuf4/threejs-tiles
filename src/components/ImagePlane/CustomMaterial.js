import { ShaderMaterial, Color } from "three";
import { extend } from "@react-three/fiber";

class CustomMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
      uniform float scale;
      uniform float shift;
      uniform float speed;
      uniform float zOffset;
      varying vec2 vUv;
      void main() {
        vec3 pos = position;
        mat4 tPos = mat4(vec4(1.0,0.0,0.0,0.0),
                        vec4(0.0,1.0,0.0,0.0),
                       vec4(0.0,0.0,1.0,0.0),
                       vec4(0.0,0.0,1.0,1.0));
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * tPos *  vec4(pos,1.);
      }`,
      fragmentShader: `
      uniform sampler2D tex;
      uniform float hasTexture;
      uniform float shift;
      uniform float scale;
      uniform float speed;
      uniform vec3 color;
      uniform float opacity;
      varying vec2 vUv;
      void main() {
        // float angle = 0.0;
        // vec2 p = (vUv - vec2(0.5, 0.5)) * (1.0 - scale) + vec2(0.5, 0.5);
        // vec2 offset = 0.0 * vec2(cos(angle), sin(angle));
        // vec4 cr = texture2D(tex, p);
        // vec4 cga = texture2D(tex, p);
        // vec4 cb = texture2D(tex, p);
        // if (hasTexture == 1.0) gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
        // else gl_FragColor = vec4(color, opacity);
        float x = vUv.x;
        float y =  vUv.y;
        gl_FragColor = texture2D(tex, vec2((65.0 * (696.0 / 250.0) * x + 520.0) / 1219., y));
      }`,
      uniforms: {
        tex: { value: null },
        hasTexture: { value: 0 },
        scale: { value: 0 },
        shift: { value: 0 },
        opacity: { value: 1 },
        zOffset: { value: 0 },
        speed: { value: 0 },
        color: { value: new Color("white") },
      },
    });
  }

  set scale(value) {
    this.uniforms.scale.value = value;
  }

  get scale() {
    return this.uniforms.scale.value;
  }

  set shift(value) {
    this.uniforms.shift.value = value;
  }

  set speed(value) {
    this.uniforms.speed.value = value;
  }

  get speed() {
    return this.uniforms.speed.value;
  }

  get shift() {
    return this.uniforms.shift.value;
  }

  get zOffset() {
    return this.uniforms.zOffset.value;
  }

  set zOffset(value) {
    this.uniforms.zOffset.value = value;
  }

  set map(value) {
    this.uniforms.hasTexture.value = !!value;
    this.uniforms.tex.value = value;
  }

  get map() {
    return this.uniforms.tex.value;
  }

  get color() {
    return this.uniforms.color.value;
  }

  get opacity() {
    return this.uniforms.opacity.value;
  }

  set opacity(value) {
    if (this.uniforms) this.uniforms.opacity.value = value;
  }
}

extend({ CustomMaterial });
