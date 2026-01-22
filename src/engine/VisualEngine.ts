// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL ENGINE - AAA Pseudo-3D Rendering System
// Hyper-realistic visuals with real lighting logic
// ═══════════════════════════════════════════════════════════════════════════════

import { Animated, Dimensions, Easing } from 'react-native';
import { Vector3D, LightSource, ShadowConfig, MotionCurve, IdleAnimation } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// CINEMATIC EASING CURVES - Never linear, always intentional
// ─────────────────────────────────────────────────────────────────────────────────

export const CINEMATIC_EASING = {
  // Heavy, intentional movements
  heavyIn: Easing.bezier(0.7, 0, 0.84, 0),
  heavyOut: Easing.bezier(0.16, 1, 0.3, 1),
  heavyInOut: Easing.bezier(0.87, 0, 0.13, 1),
  
  // Smooth, professional curves
  smoothIn: Easing.bezier(0.4, 0, 1, 1),
  smoothOut: Easing.bezier(0, 0, 0.2, 1),
  smoothInOut: Easing.bezier(0.4, 0, 0.2, 1),
  
  // Dramatic, cinematic feel
  dramaticIn: Easing.bezier(0.6, 0, 0.4, 1),
  dramaticOut: Easing.bezier(0.2, 0.8, 0.2, 1),
  
  // Bounce with weight
  weightedBounce: Easing.bezier(0.34, 1.56, 0.64, 1),
  subtleBounce: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  
  // Elastic with resistance
  elasticOut: Easing.bezier(0.68, -0.6, 0.32, 1.6),
  
  // Breathing / organic
  breathe: Easing.bezier(0.37, 0, 0.63, 1),
  
  // Anticipation
  anticipate: Easing.bezier(0.68, -0.55, 0.265, 1.55),
};

// ─────────────────────────────────────────────────────────────────────────────────
// LIGHTING SYSTEM - Real light physics simulation
// ─────────────────────────────────────────────────────────────────────────────────

export const DEFAULT_LIGHTS: LightSource[] = [
  {
    id: 'key',
    position: { x: SCREEN_WIDTH * 0.7, y: -100, z: 200 },
    intensity: 0.9,
    color: '#FFFFFF',
    radius: 500,
    type: 'key',
    castsShadow: true,
    falloff: 'quadratic',
  },
  {
    id: 'rim',
    position: { x: -50, y: SCREEN_HEIGHT * 0.3, z: 150 },
    intensity: 0.4,
    color: '#00FFFF',
    radius: 400,
    type: 'rim',
    castsShadow: false,
    falloff: 'linear',
  },
  {
    id: 'fill',
    position: { x: SCREEN_WIDTH * 0.5, y: SCREEN_HEIGHT + 100, z: 100 },
    intensity: 0.25,
    color: '#FF00FF',
    radius: 600,
    type: 'fill',
    castsShadow: false,
    falloff: 'quadratic',
  },
  {
    id: 'ambient',
    position: { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2, z: 0 },
    intensity: 0.15,
    color: '#1a1a2e',
    radius: 1000,
    type: 'ambient',
    castsShadow: false,
    falloff: 'none',
  },
];

// Calculate light intensity at a point
export function calculateLightIntensity(
  point: Vector3D,
  light: LightSource
): number {
  const dx = point.x - light.position.x;
  const dy = point.y - light.position.y;
  const dz = (point.z || 0) - light.position.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  if (distance > light.radius) return 0;
  
  let falloffFactor = 1;
  switch (light.falloff) {
    case 'linear':
      falloffFactor = 1 - (distance / light.radius);
      break;
    case 'quadratic':
      falloffFactor = 1 - Math.pow(distance / light.radius, 2);
      break;
    case 'none':
      falloffFactor = 1;
      break;
  }
  
  return Math.max(0, light.intensity * falloffFactor);
}

// Calculate combined lighting from all sources
export function calculateCombinedLighting(
  point: Vector3D,
  lights: LightSource[] = DEFAULT_LIGHTS
): { intensity: number; color: string; shadowOffset: { x: number; y: number } } {
  let totalR = 0, totalG = 0, totalB = 0;
  let totalIntensity = 0;
  let shadowX = 0, shadowY = 0;
  
  lights.forEach(light => {
    const intensity = calculateLightIntensity(point, light);
    if (intensity > 0) {
      const r = parseInt(light.color.slice(1, 3), 16);
      const g = parseInt(light.color.slice(3, 5), 16);
      const b = parseInt(light.color.slice(5, 7), 16);
      
      totalR += r * intensity;
      totalG += g * intensity;
      totalB += b * intensity;
      totalIntensity += intensity;
      
      if (light.castsShadow && light.type === 'key') {
        const dx = point.x - light.position.x;
        const dy = point.y - light.position.y;
        const shadowLength = ((point.z || 0) + 50) * 0.15;
        shadowX = dx > 0 ? shadowLength : -shadowLength;
        shadowY = dy > 0 ? shadowLength : -shadowLength;
      }
    }
  });
  
  if (totalIntensity === 0) {
    return { intensity: 0, color: '#000000', shadowOffset: { x: 0, y: 0 } };
  }
  
  const avgR = Math.min(255, Math.round(totalR / totalIntensity));
  const avgG = Math.min(255, Math.round(totalG / totalIntensity));
  const avgB = Math.min(255, Math.round(totalB / totalIntensity));
  
  const color = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
  
  return {
    intensity: Math.min(1, totalIntensity),
    color,
    shadowOffset: { x: shadowX, y: shadowY },
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// SHADOW SYSTEM - Dynamic shadows with proper falloff
// ─────────────────────────────────────────────────────────────────────────────────

export function calculateShadow(
  elevation: number,
  lightSource: LightSource = DEFAULT_LIGHTS[0]
): ShadowConfig {
  const shadowDistance = elevation * 0.5;
  const shadowBlur = elevation * 1.5;
  const shadowOpacity = Math.max(0.1, 0.5 - elevation * 0.02);
  
  return {
    enabled: true,
    offset: {
      x: shadowDistance * 0.3,
      y: shadowDistance,
    },
    blur: shadowBlur,
    opacity: shadowOpacity,
    color: '#000000',
    elevation,
  };
}

export function getShadowStyle(config: ShadowConfig) {
  if (!config.enabled) return {};
  
  return {
    shadowColor: config.color,
    shadowOffset: config.offset,
    shadowOpacity: config.opacity,
    shadowRadius: config.blur,
    elevation: config.elevation,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// DEPTH-OF-FIELD SYSTEM - Blur based on distance from focal plane
// ─────────────────────────────────────────────────────────────────────────────────

export function calculateDepthBlur(
  objectZ: number,
  focalDistance: number = 100,
  aperture: number = 0.5
): number {
  const distanceFromFocal = Math.abs(objectZ - focalDistance);
  const blur = distanceFromFocal * aperture * 0.1;
  return Math.min(10, Math.max(0, blur));
}

// ─────────────────────────────────────────────────────────────────────────────────
// PARALLAX SYSTEM - Depth-based movement
// ─────────────────────────────────────────────────────────────────────────────────

export function calculateParallaxOffset(
  cameraPosition: Vector3D,
  layerDepth: number,
  basePosition: Vector3D
): Vector3D {
  const parallaxFactor = 1 - layerDepth;
  
  return {
    x: basePosition.x + (cameraPosition.x * parallaxFactor * 0.1),
    y: basePosition.y + (cameraPosition.y * parallaxFactor * 0.1),
    z: basePosition.z,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// IDLE ANIMATION GENERATORS - Everything breathes
// ─────────────────────────────────────────────────────────────────────────────────

export function createIdleBreathing(
  amplitude: number = 0.03,
  frequency: number = 2000,
  phase: number = 0
): { animation: Animated.CompositeAnimation; value: Animated.Value } {
  const value = new Animated.Value(0);
  
  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: frequency,
        easing: CINEMATIC_EASING.breathe,
        useNativeDriver: true,
        delay: phase,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: frequency,
        easing: CINEMATIC_EASING.breathe,
        useNativeDriver: true,
      }),
    ])
  );
  
  return { animation, value };
}

export function createIdleHover(
  amplitude: number = 5,
  frequency: number = 3000,
  phase: number = 0
): { animation: Animated.CompositeAnimation; value: Animated.Value } {
  const value = new Animated.Value(0);
  
  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: amplitude,
        duration: frequency / 2,
        easing: CINEMATIC_EASING.smoothInOut,
        useNativeDriver: true,
        delay: phase,
      }),
      Animated.timing(value, {
        toValue: -amplitude,
        duration: frequency / 2,
        easing: CINEMATIC_EASING.smoothInOut,
        useNativeDriver: true,
      }),
    ])
  );
  
  return { animation, value };
}

export function createIdlePulse(
  minOpacity: number = 0.7,
  maxOpacity: number = 1,
  frequency: number = 1500,
  phase: number = 0
): { animation: Animated.CompositeAnimation; value: Animated.Value } {
  const value = new Animated.Value(minOpacity);
  
  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: maxOpacity,
        duration: frequency / 2,
        easing: CINEMATIC_EASING.breathe,
        useNativeDriver: true,
        delay: phase,
      }),
      Animated.timing(value, {
        toValue: minOpacity,
        duration: frequency / 2,
        easing: CINEMATIC_EASING.breathe,
        useNativeDriver: true,
      }),
    ])
  );
  
  return { animation, value };
}

export function createIdleDrift(
  rangeX: number = 10,
  rangeY: number = 10,
  frequency: number = 8000,
  phase: number = 0
): { animation: Animated.CompositeAnimation; valueX: Animated.Value; valueY: Animated.Value } {
  const valueX = new Animated.Value(0);
  const valueY = new Animated.Value(0);
  
  const animationX = Animated.loop(
    Animated.sequence([
      Animated.timing(valueX, {
        toValue: rangeX,
        duration: frequency,
        easing: CINEMATIC_EASING.smoothInOut,
        useNativeDriver: true,
        delay: phase,
      }),
      Animated.timing(valueX, {
        toValue: -rangeX,
        duration: frequency,
        easing: CINEMATIC_EASING.smoothInOut,
        useNativeDriver: true,
      }),
    ])
  );
  
  const animationY = Animated.loop(
    Animated.sequence([
      Animated.timing(valueY, {
        toValue: rangeY,
        duration: frequency * 1.3,
        easing: CINEMATIC_EASING.smoothInOut,
        useNativeDriver: true,
        delay: phase * 0.7,
      }),
      Animated.timing(valueY, {
        toValue: -rangeY,
        duration: frequency * 1.3,
        easing: CINEMATIC_EASING.smoothInOut,
        useNativeDriver: true,
      }),
    ])
  );
  
  const animation = Animated.parallel([animationX, animationY]);
  
  return { animation, valueX, valueY };
}

export function createIdleRotation(
  degrees: number = 360,
  frequency: number = 20000,
  phase: number = 0
): { animation: Animated.CompositeAnimation; value: Animated.Value } {
  const value = new Animated.Value(0);
  
  const animation = Animated.loop(
    Animated.timing(value, {
      toValue: degrees,
      duration: frequency,
      easing: Easing.linear,
      useNativeDriver: true,
      delay: phase,
    })
  );
  
  return { animation, value };
}

export function createIdleShimmer(
  frequency: number = 2000,
  phase: number = 0
): { animation: Animated.CompositeAnimation; value: Animated.Value } {
  const value = new Animated.Value(0);
  
  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: frequency * 0.3,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
        delay: phase,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: frequency * 0.7,
        easing: CINEMATIC_EASING.smoothIn,
        useNativeDriver: true,
      }),
      Animated.delay(frequency * 0.5),
    ])
  );
  
  return { animation, value };
}

// ─────────────────────────────────────────────────────────────────────────────────
// CINEMATIC TRANSITIONS - Screen changes feel like moments
// ─────────────────────────────────────────────────────────────────────────────────

export function createPortalTransition(
  duration: number = 800
): { in: (value: Animated.Value) => Animated.CompositeAnimation; out: (value: Animated.Value) => Animated.CompositeAnimation } {
  return {
    in: (value: Animated.Value) => Animated.sequence([
      Animated.timing(value, {
        toValue: 0.5,
        duration: duration * 0.4,
        easing: CINEMATIC_EASING.heavyIn,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: duration * 0.6,
        easing: CINEMATIC_EASING.elasticOut,
        useNativeDriver: true,
      }),
    ]),
    out: (value: Animated.Value) => Animated.timing(value, {
      toValue: 0,
      duration: duration * 0.5,
      easing: CINEMATIC_EASING.heavyIn,
      useNativeDriver: true,
    }),
  };
}

export function createFoldTransition(
  duration: number = 600
): { animation: (value: Animated.Value, toValue: number) => Animated.CompositeAnimation } {
  return {
    animation: (value: Animated.Value, toValue: number) => Animated.spring(value, {
      toValue,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }),
  };
}

export function createDissolveTransition(
  duration: number = 500
): { in: (value: Animated.Value) => Animated.CompositeAnimation; out: (value: Animated.Value) => Animated.CompositeAnimation } {
  return {
    in: (value: Animated.Value) => Animated.timing(value, {
      toValue: 1,
      duration,
      easing: CINEMATIC_EASING.smoothOut,
      useNativeDriver: true,
    }),
    out: (value: Animated.Value) => Animated.timing(value, {
      toValue: 0,
      duration,
      easing: CINEMATIC_EASING.smoothIn,
      useNativeDriver: true,
    }),
  };
}

export function createEmergenceTransition(
  duration: number = 1000
): { animation: (scaleValue: Animated.Value, opacityValue: Animated.Value) => Animated.CompositeAnimation } {
  return {
    animation: (scaleValue: Animated.Value, opacityValue: Animated.Value) => Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: duration * 0.7,
          easing: CINEMATIC_EASING.heavyOut,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: duration * 0.5,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      }),
    ]),
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// CAMERA SYSTEM - Physical camera behavior
// ─────────────────────────────────────────────────────────────────────────────────

export class CameraController {
  private position: Animated.ValueXY;
  private zoom: Animated.Value;
  private rotation: Animated.Value;
  private shakeIntensity: Animated.Value;
  
  constructor() {
    this.position = new Animated.ValueXY({ x: 0, y: 0 });
    this.zoom = new Animated.Value(1);
    this.rotation = new Animated.Value(0);
    this.shakeIntensity = new Animated.Value(0);
  }
  
  panTo(x: number, y: number, duration: number = 500): Animated.CompositeAnimation {
    return Animated.timing(this.position, {
      toValue: { x, y },
      duration,
      easing: CINEMATIC_EASING.heavyInOut,
      useNativeDriver: true,
    });
  }
  
  zoomTo(level: number, duration: number = 400): Animated.CompositeAnimation {
    return Animated.spring(this.zoom, {
      toValue: level,
      tension: 60,
      friction: 9,
      useNativeDriver: true,
    });
  }
  
  shake(intensity: number = 5, duration: number = 500): Animated.CompositeAnimation {
    const shakeSequence: Animated.CompositeAnimation[] = [];
    const shakeCount = Math.ceil(duration / 50);
    
    for (let i = 0; i < shakeCount; i++) {
      const dampening = 1 - (i / shakeCount);
      shakeSequence.push(
        Animated.timing(this.position, {
          toValue: {
            x: (Math.random() - 0.5) * intensity * dampening,
            y: (Math.random() - 0.5) * intensity * dampening,
          },
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    }
    
    shakeSequence.push(
      Animated.timing(this.position, {
        toValue: { x: 0, y: 0 },
        duration: 100,
        easing: CINEMATIC_EASING.smoothOut,
        useNativeDriver: true,
      })
    );
    
    return Animated.sequence(shakeSequence);
  }
  
  getPosition(): Animated.ValueXY {
    return this.position;
  }
  
  getZoom(): Animated.Value {
    return this.zoom;
  }
  
  getRotation(): Animated.Value {
    return this.rotation;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// VOLUMETRIC EFFECTS - Glow, fog, rays
// ─────────────────────────────────────────────────────────────────────────────────

export function calculateGlowLayers(
  baseColor: string,
  intensity: number,
  layerCount: number = 3
): { color: string; radius: number; opacity: number }[] {
  const layers: { color: string; radius: number; opacity: number }[] = [];
  
  for (let i = 0; i < layerCount; i++) {
    const layerIntensity = intensity * (1 - i / layerCount);
    layers.push({
      color: baseColor,
      radius: 10 + i * 15,
      opacity: layerIntensity * 0.5,
    });
  }
  
  return layers;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COLOR UTILITIES - Advanced color manipulation
// ─────────────────────────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function adjustBrightness(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  return rgbToHex(
    rgb.r * factor,
    rgb.g * factor,
    rgb.b * factor
  );
}

export function blendColors(color1: string, color2: string, ratio: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  return rgbToHex(
    rgb1.r * (1 - ratio) + rgb2.r * ratio,
    rgb1.g * (1 - ratio) + rgb2.g * ratio,
    rgb1.b * (1 - ratio) + rgb2.b * ratio
  );
}

export function addGlow(baseColor: string, glowIntensity: number): string {
  const rgb = hexToRgb(baseColor);
  const boost = glowIntensity * 50;
  
  return rgbToHex(
    Math.min(255, rgb.r + boost),
    Math.min(255, rgb.g + boost),
    Math.min(255, rgb.b + boost)
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// PHYSICS SIMULATION - Mass, inertia, resistance
// ─────────────────────────────────────────────────────────────────────────────────

export function applyPhysicsSpring(
  value: Animated.Value,
  toValue: number,
  mass: number = 1,
  tension: number = 170,
  friction: number = 26
): Animated.CompositeAnimation {
  // Adjust physics based on mass
  const adjustedTension = tension / mass;
  const adjustedFriction = friction * Math.sqrt(mass);
  
  return Animated.spring(value, {
    toValue,
    tension: adjustedTension,
    friction: adjustedFriction,
    useNativeDriver: true,
  });
}

export function applyDecay(
  value: Animated.Value,
  velocity: number,
  deceleration: number = 0.997
): Animated.CompositeAnimation {
  return Animated.decay(value, {
    velocity,
    deceleration,
    useNativeDriver: true,
  });
}

// ─────────────────────────────────────────────────────────────────────────────────
// STAGGER SYSTEM - Delayed element animations
// ─────────────────────────────────────────────────────────────────────────────────

export function createStaggeredEntrance(
  values: Animated.Value[],
  staggerDelay: number = 50,
  duration: number = 400
): Animated.CompositeAnimation {
  const animations = values.map((value, index) => 
    Animated.sequence([
      Animated.delay(index * staggerDelay),
      Animated.spring(value, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ])
  );
  
  return Animated.parallel(animations);
}

export function createStaggeredExit(
  values: Animated.Value[],
  staggerDelay: number = 30,
  duration: number = 300
): Animated.CompositeAnimation {
  const animations = values.map((value, index) => 
    Animated.sequence([
      Animated.delay(index * staggerDelay),
      Animated.timing(value, {
        toValue: 0,
        duration,
        easing: CINEMATIC_EASING.heavyIn,
        useNativeDriver: true,
      }),
    ])
  );
  
  return Animated.parallel(animations);
}

// ─────────────────────────────────────────────────────────────────────────────────
// VISUAL ENGINE SINGLETON
// ─────────────────────────────────────────────────────────────────────────────────

export const visualEngine = {
  easing: CINEMATIC_EASING,
  lights: DEFAULT_LIGHTS,
  calculateLighting: calculateCombinedLighting,
  calculateShadow,
  getShadowStyle,
  calculateDepthBlur,
  calculateParallaxOffset,
  idle: {
    breathe: createIdleBreathing,
    hover: createIdleHover,
    pulse: createIdlePulse,
    drift: createIdleDrift,
    rotate: createIdleRotation,
    shimmer: createIdleShimmer,
  },
  transitions: {
    portal: createPortalTransition,
    fold: createFoldTransition,
    dissolve: createDissolveTransition,
    emergence: createEmergenceTransition,
  },
  camera: new CameraController(),
  glow: calculateGlowLayers,
  color: {
    hexToRgb,
    rgbToHex,
    adjustBrightness,
    blendColors,
    addGlow,
  },
  physics: {
    spring: applyPhysicsSpring,
    decay: applyDecay,
  },
  stagger: {
    entrance: createStaggeredEntrance,
    exit: createStaggeredExit,
  },
};

export default visualEngine;
