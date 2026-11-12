// galaxy pose per section: x/y in half-viewports, z depth, s scale, tilt/roll radians, dim brightness
export const SPACE = {
  top: { x: 0.5, y: -0.6, z: -700, s: 1.15, tilt: 1.3, roll: -0.35, dim: 0.5 },
  work: { x: 0.78, y: -0.62, z: -900, s: 1.3, tilt: 1.36, roll: -0.32, dim: 0.42 },
  about: { x: -1.3, y: 0.9, z: -650, s: 1.1, tilt: 1.12, roll: 0.42, dim: 0.34 },
  method: { x: -1.1, y: -0.9, z: -1200, s: 0.95, tilt: 1.38, roll: 0.1, dim: 0.18 },
  words: { x: 0.78, y: 0.05, z: -520, s: 0.95, tilt: 0.92, roll: -0.62, dim: 0.38 },
  video: { x: 0.95, y: -0.78, z: -820, s: 1.1, tilt: 1.22, roll: 0.5, dim: 0.32 },
  deep: { x: 0.0, y: -1.16, z: -160, s: 1.25, tilt: 1.24, roll: -0.08, dim: 1.0 },
  case: { x: 0.7, y: 0.25, z: -520, s: 1.0, tilt: 1.12, roll: -0.42, dim: 0.55 },
  caseBody: { x: -1.15, y: -0.6, z: -800, s: 1.1, tilt: 1.3, roll: 0.36, dim: 0.26 },
};

export const KEYS = ["x", "y", "z", "s", "tilt", "roll", "dim"];

export function blend(a, b, k) {
  const o = {};
  KEYS.forEach((key) => (o[key] = a[key] + (b[key] - a[key]) * k));
  return o;
}
