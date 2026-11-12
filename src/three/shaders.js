export const starVert = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uScatter;
uniform float uSize;
uniform float uGalSize;
uniform float uPR;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uHover;
uniform vec3 uClick;
uniform vec2 uView;
uniform float uCamDist;
uniform float uScrollY;
uniform vec4 uGal;
uniform vec3 uGalRot;
uniform float uDim;
uniform float uLens;
attribute vec4 aGalaxy;
attribute vec4 aRand;
varying vec3 vColor;
varying float vAlpha;

const float PI = 3.14159265;

float easeInOut(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }
vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }
vec3 flow(vec3 p, float t) {
  return vec3(
    sin(p.y * 0.011 + t * 0.9) + sin(p.z * 0.013 + t * 0.7),
    sin(p.z * 0.012 + t * 0.8) + sin(p.x * 0.009 + t * 1.1),
    sin(p.x * 0.010 + t * 0.6) + sin(p.y * 0.014 + t * 0.5)
  );
}

void main() {
  bool phone = uView.x < 768.0;
  vec3 text = position;
  text.y += uScrollY;

  // voice waveform
  float band = floor(aRand.y * 5.0);
  float wx = (aRand.x - 0.5) * uView.x * 1.15;
  float env = exp(-pow(wx / (uView.x * 0.33), 2.0));
  float amp = uView.y * (0.05 + 0.11 * (0.5 + 0.5 * sin(uTime * 1.7 + band)));
  float wy = sin(wx * 0.011 + uTime * 2.6 + band * 0.9) * amp * env * (0.55 + 0.45 * sin(wx * 0.003 - uTime * 1.3));
  vec3 wave = vec3(wx, wy + (aRand.z - 0.5) * 5.0 + uScrollY, (band - 2.0) * 34.0);

  float t = clamp(uMorph * 1.55 - aRand.w * 0.55, 0.0, 1.0);
  float e = easeInOut(t);
  vec3 pos = mix(wave, text, e);
  pos.z += sin(e * PI) * (aRand.x - 0.5) * 520.0;
  pos += flow(pos, uTime) * sin(e * PI) * 26.0;
  float speak = sin(text.x * 0.018 - uTime * 2.2) * 0.5 + 0.5;
  pos.z += speak * (phone ? 2.5 : 7.0) * e;
  pos += flow(text * 1.7, uTime * 0.6) * (phone ? 0.06 : 0.35) * e;

  // galaxy with keplerian differential rotation
  vec3 g = aGalaxy.xyz;
  float gr = length(g.xz);
  float ang = (uTime + 120.0) * 0.07 / (sqrt(gr) + 0.12) + uGalRot.z;
  float ca = cos(ang), sa = sin(ang);
  g.xz = vec2(ca * g.x - sa * g.z, sa * g.x + ca * g.z);
  float base = max(uView.x, uView.y * 0.85) * 0.55;
  g *= uGal.w * base;
  g = rotX(g, uGalRot.x);
  g = rotZ(g, uGalRot.y);
  g += vec3(uGal.x * uView.x * 0.5, uGal.y * uView.y * 0.5, uGal.z);

  float sc = clamp(uScatter * 1.45 - aRand.z * 0.45, 0.0, 1.0);
  float se = easeInOut(sc);
  pos = mix(pos, g, se) + flow(pos * 0.4, uTime * 0.5) * 110.0 * sin(se * PI);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vec4 clip = projectionMatrix * mv;

  // screen-space cursor lens, swirl and wake
  vec2 hv = uView * 0.5;
  vec2 scr = clip.xy / clip.w * hv;
  vec2 d = scr - uMouse;
  float L = length(d);
  float R = mix(phone ? 95.0 : 150.0, 170.0, se);
  float f = smoothstep(R, 0.0, L) * uHover * mix(1.0, uLens, se);
  vec2 dir = d / (L + 0.001);
  vec2 off = dir * f * f * 70.0 + vec2(-dir.y, dir.x) * f * 26.0 - uVel * f * 0.35;

  // click shockwave
  float age = uClick.z;
  vec2 dc2 = scr - uClick.xy;
  float dc = length(dc2);
  float ring = exp(-pow((dc - age * 950.0) / 46.0, 2.0)) * exp(-age * 1.6);
  off += dc2 / (dc + 0.001) * ring * 22.0;
  clip.xy += off / hv * clip.w;
  gl_Position = clip;

  vec3 base3 = vec3(0.90, 0.92, 0.96);
  vec3 sky = vec3(0.22, 0.74, 0.97);
  vec3 rose = vec3(0.96, 0.25, 0.37);
  vec3 col = mix(sky, base3, e);
  if (!phone && aRand.y > 0.992) col = mix(col, rose, 0.7);
  else if (!phone && aRand.y > 0.975) col = mix(col, sky, 0.75);
  vec3 gcol = aGalaxy.w < 0.5 ? vec3(1.0, 0.86, 0.7) : mix(vec3(0.82, 0.88, 1.0), vec3(0.32, 0.68, 1.0), smoothstep(0.15, 0.9, gr));
  if (aRand.y > 0.988) gcol = mix(gcol, rose, 0.8);
  col = mix(col, gcol, se);
  col = mix(col, sky, f * 0.9);
  col = mix(col, rose, ring * 0.8);
  vColor = col;

  float nameSize = (!phone && aRand.y > 0.955) ? 1.25 : 1.0;
  float galSize = (aGalaxy.w < 0.5 ? 1.5 : 1.0) * (0.55 + aRand.y * 0.9);
  gl_PointSize = mix(uSize * nameSize, uGalSize * galSize, se) * (1.0 + f * 1.4 + ring) * uPR * (uCamDist / -mv.z);
  float nameA = mix(0.6, 0.3, e);
  float galA = uDim * (aGalaxy.w < 0.5 ? 0.95 : 0.45 + 0.55 * aRand.x);
  vAlpha = mix(nameA, galA, se) * (1.0 + f * 0.6);
}
`;

export const starFrag = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, d);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

export const dustVert = /* glsl */ `
uniform float uTime;
uniform float uPR;
uniform float uTravel;
uniform float uWarp;
uniform float uDust;
attribute float aRand;
varying float vA;
void main() {
  vec3 p = position;
  p.z = mod(p.z + uTravel, 3600.0) - 3000.0;
  p.y += sin(uTime * 0.2 + aRand * 40.0) * 10.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  float near = clamp(1.0 - (-mv.z) / 3800.0, 0.0, 1.0);
  clip.xy += (clip.xy / clip.w) * uWarp * 0.12 * near * clip.w;
  gl_Position = clip;
  float fade = smoothstep(-3000.0, -2300.0, p.z) * (1.0 - smoothstep(250.0, 600.0, p.z));
  gl_PointSize = (1.0 + aRand * 2.2) * uPR * (900.0 / -mv.z) * (1.0 + uWarp * 1.2 * near);
  float tw = 0.18 + 0.5 * pow(0.5 + 0.5 * sin(uTime * (0.6 + aRand) + aRand * 90.0), 3.0);
  vA = tw * fade * uDust;
}
`;

export const dustFrag = /* glsl */ `
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(0.62, 0.76, 0.96, a);
}
`;
