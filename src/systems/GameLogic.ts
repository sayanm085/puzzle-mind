// ═══════════════════════════════════════════════════════════════════════════════
// 🎲 GAME LOGIC - Shape Generation & Challenge Resolution
// ═══════════════════════════════════════════════════════════════════════════════

import { Dimensions } from 'react-native';
import { Shape, ShapeType, ChallengeType, GlowColor, Level } from '../types';
import { GLOW_COLORS } from '../constants/colors';
import { getChallengeDescription } from '../constants/challenges';

const { width: W, height: H } = Dimensions.get('window');
const SHAPE_AREA_Y = H * 0.25;
const SHAPE_AREA_HEIGHT = H * 0.45;

export const SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star', 'pentagon', 'octagon'];

// Generate a random shape
export function generateShape(index: number, existingShapes: Shape[], specialModifier?: string): Shape {
  const margin = 50;
  const minDistance = 60;
  
  let x = 0, y = 0, attempts = 0;
  
  // Find non-overlapping position
  do {
    x = margin + Math.random() * (W - margin * 2);
    y = SHAPE_AREA_Y + margin + Math.random() * (SHAPE_AREA_HEIGHT - margin * 2);
    attempts++;
  } while (
    attempts < 100 && 
    existingShapes.some(s => Math.hypot(s.x - x, s.y - y) < minDistance)
  );

  const size = 30 + Math.random() * 35;
  const colorIndex = Math.floor(Math.random() * GLOW_COLORS.length);
  const color = GLOW_COLORS[colorIndex];

  return {
    id: index,
    x,
    y,
    size,
    type: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color,
    glowIntensity: 0.6 + Math.random() * 0.4,
    rotation: Math.random() * 360,
    appearanceOrder: index,
    isMoving: specialModifier === 'moving' || specialModifier === 'chaos',
    isRotating: specialModifier === 'rotating' || specialModifier === 'chaos',
    isPulsing: specialModifier === 'pulsing',
    isFlickering: specialModifier === 'chaos' && Math.random() > 0.7,
  };
}

// Generate shapes for a round
export function generateShapes(count: number, specialModifier?: string): Shape[] {
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    shapes.push(generateShape(i, shapes, specialModifier));
  }
  return shapes;
}

// Get correct shape for a challenge
export function getCorrectShape(shapes: Shape[], challenge: ChallengeType): Shape | null {
  if (shapes.length === 0) return null;

  switch (challenge) {
    case 'largestShape':
      return shapes.reduce((a, b) => a.size > b.size ? a : b);
    
    case 'smallestShape':
      return shapes.reduce((a, b) => a.size < b.size ? a : b);
    
    case 'brightestColor':
      return shapes.reduce((a, b) => getBrightness(a.color) > getBrightness(b.color) ? a : b);
    
    case 'darkestColor':
      return shapes.reduce((a, b) => getBrightness(a.color) < getBrightness(b.color) ? a : b);
    
    case 'leftMost':
      return shapes.reduce((a, b) => a.x < b.x ? a : b);
    
    case 'rightMost':
      return shapes.reduce((a, b) => a.x > b.x ? a : b);
    
    case 'topMost':
      return shapes.reduce((a, b) => a.y < b.y ? a : b);
    
    case 'bottomMost':
      return shapes.reduce((a, b) => a.y > b.y ? a : b);
    
    case 'centerMost': {
      const centerX = W / 2;
      const centerY = SHAPE_AREA_Y + SHAPE_AREA_HEIGHT / 2;
      return shapes.reduce((a, b) => {
        const distA = Math.hypot(a.x - centerX, a.y - centerY);
        const distB = Math.hypot(b.x - centerX, b.y - centerY);
        return distA < distB ? a : b;
      });
    }
    
    case 'mostIsolated': {
      return shapes.reduce((isolated, current) => {
        const avgDistCurrent = shapes
          .filter(s => s.id !== current.id)
          .reduce((sum, s) => sum + Math.hypot(s.x - current.x, s.y - current.y), 0) / (shapes.length - 1);
        const avgDistIsolated = shapes
          .filter(s => s.id !== isolated.id)
          .reduce((sum, s) => sum + Math.hypot(s.x - isolated.x, s.y - isolated.y), 0) / (shapes.length - 1);
        return avgDistCurrent > avgDistIsolated ? current : isolated;
      });
    }
    
    case 'mostCrowded': {
      return shapes.reduce((crowded, current) => {
        const avgDistCurrent = shapes
          .filter(s => s.id !== current.id)
          .reduce((sum, s) => sum + Math.hypot(s.x - current.x, s.y - current.y), 0) / (shapes.length - 1);
        const avgDistCrowded = shapes
          .filter(s => s.id !== crowded.id)
          .reduce((sum, s) => sum + Math.hypot(s.x - crowded.x, s.y - crowded.y), 0) / (shapes.length - 1);
        return avgDistCurrent < avgDistCrowded ? current : crowded;
      });
    }
    
    case 'firstAppeared':
      return shapes.reduce((a, b) => (a.appearanceOrder ?? 0) < (b.appearanceOrder ?? 0) ? a : b);
    
    case 'lastAppeared':
      return shapes.reduce((a, b) => (a.appearanceOrder ?? 0) > (b.appearanceOrder ?? 0) ? a : b);
    
    case 'oddOneOut': {
      const typeCount: Record<string, number> = {};
      shapes.forEach(s => { typeCount[s.type] = (typeCount[s.type] || 0) + 1; });
      const oddType = Object.entries(typeCount).find(([_, count]) => count === 1)?.[0];
      if (oddType) return shapes.find(s => s.type === oddType) || shapes[0];
      return shapes[0];
    }
    
    case 'uniqueColor': {
      const colorCount: Record<string, number> = {};
      shapes.forEach(s => { colorCount[s.color.hex] = (colorCount[s.color.hex] || 0) + 1; });
      const uniqueHex = Object.entries(colorCount).find(([_, count]) => count === 1)?.[0];
      if (uniqueHex) return shapes.find(s => s.color.hex === uniqueHex) || shapes[0];
      return shapes[0];
    }
    
    case 'diagonal': {
      // Find shape closest to diagonal line from top-left to bottom-right
      const slope = SHAPE_AREA_HEIGHT / W;
      return shapes.reduce((closest, current) => {
        const expectedY = SHAPE_AREA_Y + current.x * slope;
        const distCurrent = Math.abs(current.y - expectedY);
        const expectedYClosest = SHAPE_AREA_Y + closest.x * slope;
        const distClosest = Math.abs(closest.y - expectedYClosest);
        return distCurrent < distClosest ? current : closest;
      });
    }
    
    case 'countBased': {
      // Most common shape type
      const typeCount: Record<string, number> = {};
      shapes.forEach(s => { typeCount[s.type] = (typeCount[s.type] || 0) + 1; });
      const maxCount = Math.max(...Object.values(typeCount));
      const commonType = Object.entries(typeCount).find(([_, count]) => count === maxCount)?.[0];
      if (commonType) return shapes.find(s => s.type === commonType) || shapes[0];
      return shapes[0];
    }
    
    case 'majority': {
      // Shape belonging to majority color group
      const colorCount: Record<string, number> = {};
      shapes.forEach(s => { colorCount[s.color.hex] = (colorCount[s.color.hex] || 0) + 1; });
      const maxCount = Math.max(...Object.values(colorCount));
      const majorityHex = Object.entries(colorCount).find(([_, count]) => count === maxCount)?.[0];
      if (majorityHex) return shapes.find(s => s.color.hex === majorityHex) || shapes[0];
      return shapes[0];
    }
    
    case 'exclusion': {
      // Shape that doesn't match the majority type
      const typeCount: Record<string, number> = {};
      shapes.forEach(s => { typeCount[s.type] = (typeCount[s.type] || 0) + 1; });
      const maxCount = Math.max(...Object.values(typeCount));
      const majorityType = Object.entries(typeCount).find(([_, count]) => count === maxCount)?.[0];
      const excluded = shapes.find(s => s.type !== majorityType);
      return excluded || shapes[0];
    }
    
    case 'patternBreaker': {
      // Similar to oddOneOut but for color
      const colorCount: Record<string, number> = {};
      shapes.forEach(s => { colorCount[s.color.hex] = (colorCount[s.color.hex] || 0) + 1; });
      const minCount = Math.min(...Object.values(colorCount));
      const rareHex = Object.entries(colorCount).find(([_, count]) => count === minCount)?.[0];
      if (rareHex) return shapes.find(s => s.color.hex === rareHex) || shapes[0];
      return shapes[0];
    }
    
    case 'colorGradient': {
      // Find shape with medium brightness (not brightest, not darkest)
      const sortedByBrightness = [...shapes].sort((a, b) => getBrightness(a.color) - getBrightness(b.color));
      const middleIndex = Math.floor(sortedByBrightness.length / 2);
      return sortedByBrightness[middleIndex];
    }
    
    case 'flickering':
    case 'pulsing':
    case 'colorShift':
      // For temporal challenges, use the first shape with that property or largest
      const flickeringShape = shapes.find(s => s.isFlickering || s.isPulsing);
      return flickeringShape || shapes.reduce((a, b) => a.size > b.size ? a : b);
    
    default:
      return shapes[0];
  }
}

// Get brightness value from color
function getBrightness(color: GlowColor): number {
  const hex = color.hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// Get challenge text
export function getChallengeText(challenge: ChallengeType): string {
  return getChallengeDescription(challenge);
}

// Generate challenge for level with variety
export function selectChallengeForLevel(level: Level, roundNumber: number): ChallengeType {
  const available = level.availableChallenges || [level.baseChallenge];
  
  // First round always uses base challenge
  if (roundNumber === 0) return level.baseChallenge;
  
  // Subsequent rounds mix it up
  return available[Math.floor(Math.random() * available.length)];
}

// Get modifier description
export function getModifierDescription(modifier?: string): string | null {
  switch (modifier) {
    case 'moving': return '🌀 Shapes are moving!';
    case 'rotating': return '🔄 Shapes are spinning!';
    case 'pulsing': return '💓 Shapes are pulsing!';
    case 'chaos': return '🌪️ CHAOS MODE!';
    case 'zen': return '🧘 Take your time...';
    case 'blitz': return '⚡ SPEED ROUND!';
    default: return null;
  }
}
