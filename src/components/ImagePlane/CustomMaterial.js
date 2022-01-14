import { ShaderMaterial, Color } from "three";
import { extend } from "@react-three/fiber";

class CustomMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
      #define PI 3.1415926535897932384626433832795
      uniform float percentage;
      uniform float speed;
      varying vec2 vUv;
      float variance = 0.55;
      void main() {
        vec3 pos = position;
        if (percentage > 1.0 ||  percentage < 0.0) {
          pos.z = 0.0;
        } else {
          pos.z = 15.0 * speed * (exp(-(percentage * percentage) / (2.0 * variance * variance)) - 0.1) / (variance * sqrt(2.0 * PI));
        }
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix  *  vec4(pos,1.);
      }`,
      fragmentShader: `
      uniform sampler2D tex;
      uniform float speed;
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
        speed: { value: 0 },
        percentage: { value: 0 },
      },
    });
  }

  set speed(value) {
    this.uniforms.speed.value = value;
  }

  get speed() {
    return this.uniforms.speed.value;
  }

  set map(value) {
    this.uniforms.tex.value = value;
  }

  get map() {
    return this.uniforms.tex.value;
  }

  get percentage() {
    return this.uniforms.percentage.value;
  }

  set percentage(value) {
    this.uniforms.percentage.value = value;
  }
}

extend({ CustomMaterial });
