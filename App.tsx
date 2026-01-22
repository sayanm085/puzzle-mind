import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Animated,
  Easing,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const { width: W, height: H } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 INTELLIGENT ADAPTIVE SYSTEM TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// Challenge types across 4 cognitive domains
type ChallengeType = 
  // Visual Domain
  | 'matchColor' | 'matchShape' | 'brightestColor' | 'darkestColor' 
  | 'largestShape' | 'smallestShape' | 'colorGradient'
  // Spatial Domain
  | 'topMost' | 'bottomMost' | 'leftMost' | 'rightMost' 
  | 'centerMost' | 'mostIsolated' | 'mostCrowded'
  // Logical Domain
  | 'oddOneOut' | 'patternBreaker' | 'countBased' | 'exclusion'
  // Temporal Domain
  | 'firstAppeared' | 'lastAppeared' | 'flickering' | 'colorShift';

// Difficulty vector - 8 dimensions of challenge
interface DifficultyVector {
  shapeCount: number;        // 3-12 shapes
  colorSimilarity: number;   // 0-1, how close colors are
  sizeVariance: number;      // 0-1, range of sizes
  movementSpeed: number;     // 0-1, if shapes move
  timeLimit: number;         // seconds per round
  ruleComplexity: number;    // 1-5 scale
  distractorCount: number;   // wrong answers that look right
  spatialDensity: number;    // 0-1, how clustered shapes are
}

// Individual round behavior tracking
interface RoundBehavior {
  roundNumber: number;
  reactionTimeMs: number;
  hesitationCount: number;
  selectedCorrect: boolean;
  challengeType: ChallengeType;
  difficultyVector: DifficultyVector;
  timestamp: number;
  clutchSave: boolean;       // success when time < 20% remaining
}

// Error pattern tracking for adaptive learning
interface ErrorPattern {
  challengeType: ChallengeType;
  errorCount: number;
  lastOccurred: number;
  domain: 'visual' | 'spatial' | 'logical' | 'temporal';
}

// Complete player behavior profile
interface PlayerBehaviorProfile {
  sessionId: string;
  sessionStartTime: number;
  rounds: RoundBehavior[];
  errorPatterns: ErrorPattern[];
  averageReactionTime: number;
  consistencyScore: number;      // 0-1, variance in performance
  confidenceIndicator: number;   // 0-1, based on hesitation patterns
  streakHistory: number[];
  peakPerformanceRound: number;
  fatigueIndicator: number;      // 0-1, performance decay over time
  totalHesitations: number;
  clutchSuccesses: number;
}

// Performance vector for radar chart
interface PerformanceVector {
  speed: number;        // 0-100, reaction time percentile
  accuracy: number;     // 0-100, correct selection rate
  consistency: number;  // 0-100, low variance in performance
  spatial: number;      // 0-100, spatial challenge performance
  pattern: number;      // 0-100, pattern/visual recognition performance
  pressure: number;     // 0-100, performance under time pressure
}

// Scoring configuration
interface ScoringConfig {
  basePoints: number;
  speedMultiplier: number;
  difficultyMultiplier: number;
  challengeTypeWeight: number;
  consistencyBonus: number;
  streakMultiplier: number;
  clutchBonus: number;
}

// Insight rule for post-match analysis
interface InsightRule {
  id: string;
  condition: (profile: PlayerBehaviorProfile) => boolean;
  insight: string;
  category: 'performance' | 'behavioral' | 'skill';
  priority: number;
}

// Challenge definition with metadata
interface ChallengeDefinition {
  type: ChallengeType;
  domain: 'visual' | 'spatial' | 'logical' | 'temporal';
  baseWeight: number;        // 1.0-2.5 difficulty weight
  description: string;
  unlockLevel: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 CHALLENGE DEFINITIONS (20+ Types)
// ═══════════════════════════════════════════════════════════════════════════════
const CHALLENGE_DEFINITIONS: ChallengeDefinition[] = [
  // Visual Domain
  { type: 'matchColor', domain: 'visual', baseWeight: 1.0, description: 'Find the COLOR shape', unlockLevel: 1 },
  { type: 'matchShape', domain: 'visual', baseWeight: 1.0, description: 'Find the SHAPE', unlockLevel: 1 },
  { type: 'brightestColor', domain: 'visual', baseWeight: 1.2, description: 'Find the BRIGHTEST', unlockLevel: 1 },
  { type: 'darkestColor', domain: 'visual', baseWeight: 1.2, description: 'Find the DARKEST', unlockLevel: 2 },
  { type: 'largestShape', domain: 'visual', baseWeight: 1.1, description: 'Find the LARGEST', unlockLevel: 1 },
  { type: 'smallestShape', domain: 'visual', baseWeight: 1.1, description: 'Find the SMALLEST', unlockLevel: 1 },
  { type: 'colorGradient', domain: 'visual', baseWeight: 1.8, description: 'Find the GRADIENT BREAKER', unlockLevel: 5 },
  
  // Spatial Domain
  { type: 'topMost', domain: 'spatial', baseWeight: 1.0, description: 'Find the HIGHEST', unlockLevel: 2 },
  { type: 'bottomMost', domain: 'spatial', baseWeight: 1.0, description: 'Find the LOWEST', unlockLevel: 2 },
  { type: 'leftMost', domain: 'spatial', baseWeight: 1.0, description: 'Find the LEFTMOST', unlockLevel: 1 },
  { type: 'rightMost', domain: 'spatial', baseWeight: 1.0, description: 'Find the RIGHTMOST', unlockLevel: 1 },
  { type: 'centerMost', domain: 'spatial', baseWeight: 1.4, description: 'Find the CENTER', unlockLevel: 3 },
  { type: 'mostIsolated', domain: 'spatial', baseWeight: 1.6, description: 'Find the ISOLATED', unlockLevel: 4 },
  { type: 'mostCrowded', domain: 'spatial', baseWeight: 1.6, description: 'Find the CROWDED', unlockLevel: 4 },
  
  // Logical Domain
  { type: 'oddOneOut', domain: 'logical', baseWeight: 1.8, description: 'Find the ODD ONE', unlockLevel: 5 },
  { type: 'patternBreaker', domain: 'logical', baseWeight: 2.0, description: 'Find the ANOMALY', unlockLevel: 6 },
  { type: 'countBased', domain: 'logical', baseWeight: 1.5, description: 'Find the Nth TYPE', unlockLevel: 4 },
  { type: 'exclusion', domain: 'logical', baseWeight: 1.7, description: 'Find NOT this AND NOT that', unlockLevel: 5 },
  
  // Temporal Domain
  { type: 'firstAppeared', domain: 'temporal', baseWeight: 2.0, description: 'Find the FIRST', unlockLevel: 6 },
  { type: 'lastAppeared', domain: 'temporal', baseWeight: 2.0, description: 'Find the LAST', unlockLevel: 6 },
  { type: 'flickering', domain: 'temporal', baseWeight: 2.2, description: 'Find the FLICKERING', unlockLevel: 7 },
  { type: 'colorShift', domain: 'temporal', baseWeight: 2.5, description: 'Find the SHIFTING', unlockLevel: 8 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 💫 INSIGHT RULES (Profound Post-Match Analysis)
// ═══════════════════════════════════════════════════════════════════════════════
const INSIGHT_RULES: InsightRule[] = [
  {
    id: 'hesitant_accurate',
    condition: (p) => p.confidenceIndicator < 0.4 && p.rounds.filter(r => r.selectedCorrect).length / Math.max(p.rounds.length, 1) > 0.7,
    insight: "You hesitated where confidence was required. Your instincts are sharper than you trust.",
    category: 'behavioral',
    priority: 9
  },
  {
    id: 'fatigue_detected',
    condition: (p) => p.fatigueIndicator > 0.6,
    insight: "Your focus wavered in the final rounds. Peak performance lived in your opening moves.",
    category: 'performance',
    priority: 8
  },
  {
    id: 'spatial_weakness',
    condition: (p) => p.errorPatterns.some(e => e.domain === 'spatial' && e.errorCount >= 3),
    insight: "Space deceived you. The mind sees what it expects, not what exists.",
    category: 'skill',
    priority: 7
  },
  {
    id: 'mechanical_precision',
    condition: (p) => p.consistencyScore > 0.9,
    insight: "Mechanical precision. You've become the algorithm.",
    category: 'performance',
    priority: 8
  },
  {
    id: 'perfect_ten',
    condition: (p) => p.streakHistory.some(s => s >= 10),
    insight: "Ten without fault. In that moment, thought and action were one.",
    category: 'performance',
    priority: 9
  },
  {
    id: 'lightning_fast',
    condition: (p) => p.averageReactionTime < 500 && p.rounds.length >= 5,
    insight: "Lightning cognition. You see answers before questions fully form.",
    category: 'skill',
    priority: 8
  },
  {
    id: 'slow_starter',
    condition: (p) => {
      if (p.rounds.length < 8) return false;
      const firstHalf = p.rounds.slice(0, Math.floor(p.rounds.length / 2));
      const secondHalf = p.rounds.slice(Math.floor(p.rounds.length / 2));
      const firstSuccess = firstHalf.filter(r => r.selectedCorrect).length / firstHalf.length;
      const secondSuccess = secondHalf.filter(r => r.selectedCorrect).length / secondHalf.length;
      return secondSuccess > firstSuccess + 0.3;
    },
    insight: "A slow ignition, but once lit—unstoppable. Your learning curve is a weapon.",
    category: 'behavioral',
    priority: 9
  },
  {
    id: 'clutch_player',
    condition: (p) => p.clutchSuccesses >= 3,
    insight: "You bloom under pressure. Others fade; you sharpen.",
    category: 'behavioral',
    priority: 8
  },
  {
    id: 'visual_mastery',
    condition: (p) => {
      const visualRounds = p.rounds.filter(r => ['matchColor', 'matchShape', 'brightestColor', 'darkestColor', 'largestShape', 'smallestShape'].includes(r.challengeType));
      return visualRounds.length >= 5 && visualRounds.filter(r => r.selectedCorrect).length / visualRounds.length > 0.9;
    },
    insight: "Your eyes speak a language your mind has forgotten. Visual mastery achieved.",
    category: 'skill',
    priority: 7
  },
  {
    id: 'no_hesitation',
    condition: (p) => p.totalHesitations === 0 && p.rounds.length >= 5,
    insight: "Zero hesitation. You move with the certainty of water finding its path.",
    category: 'behavioral',
    priority: 8
  },
  {
    id: 'improving_speed',
    condition: (p) => {
      if (p.rounds.length < 6) return false;
      const firstThird = p.rounds.slice(0, Math.floor(p.rounds.length / 3));
      const lastThird = p.rounds.slice(-Math.floor(p.rounds.length / 3));
      const firstAvg = firstThird.reduce((a, r) => a + r.reactionTimeMs, 0) / firstThird.length;
      const lastAvg = lastThird.reduce((a, r) => a + r.reactionTimeMs, 0) / lastThird.length;
      return lastAvg < firstAvg * 0.7;
    },
    insight: "Each round, faster. You're not playing the game—you're transcending it.",
    category: 'performance',
    priority: 8
  },
  {
    id: 'logical_struggle',
    condition: (p) => p.errorPatterns.some(e => e.domain === 'logical' && e.errorCount >= 2),
    insight: "Logic twisted against you. The obvious answer is rarely the true one.",
    category: 'skill',
    priority: 7
  },
  {
    id: 'temporal_mastery',
    condition: (p) => {
      const temporalRounds = p.rounds.filter(r => ['firstAppeared', 'lastAppeared', 'flickering', 'colorShift'].includes(r.challengeType));
      return temporalRounds.length >= 3 && temporalRounds.every(r => r.selectedCorrect);
    },
    insight: "Time bends to your perception. You remember what others forget.",
    category: 'skill',
    priority: 9
  },
  {
    id: 'consistent_mediocre',
    condition: (p) => {
      const successRate = p.rounds.filter(r => r.selectedCorrect).length / Math.max(p.rounds.length, 1);
      return p.consistencyScore > 0.8 && successRate > 0.5 && successRate < 0.7;
    },
    insight: "Consistent, but constrained. Your ceiling awaits discovery.",
    category: 'performance',
    priority: 6
  },
  {
    id: 'comeback_king',
    condition: (p) => {
      if (p.rounds.length < 5) return false;
      let maxConsecutiveErrors = 0;
      let currentErrors = 0;
      for (const round of p.rounds) {
        if (!round.selectedCorrect) {
          currentErrors++;
          maxConsecutiveErrors = Math.max(maxConsecutiveErrors, currentErrors);
        } else {
          currentErrors = 0;
        }
      }
      const finalStreak = p.streakHistory[p.streakHistory.length - 1] || 0;
      return maxConsecutiveErrors >= 2 && finalStreak >= 4;
    },
    insight: "From the ashes of failure, a phoenix. Your resilience defines you.",
    category: 'behavioral',
    priority: 9
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 PREMIUM COLOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
const COLORS = {
  void: '#0A0A0F',
  abyss: '#050510',
  cosmos: '#08081A',
  
  // Neon accents
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  violet: '#8B5CF6',
  gold: '#FFD700',
  emerald: '#00FF88',
  rose: '#FF6B9D',
  orange: '#FF8C42',
  blue: '#00BFFF',
  
  // UI
  textPrimary: '#FFFFFF',
  textSecondary: '#8888AA',
  textMuted: '#444466',
  surface: '#12121F',
  surfaceLight: '#1A1A2E',
};

const GLOW_COLORS = [
  { main: '#00FFFF', glow: '#00FFFF40' },
  { main: '#FF00FF', glow: '#FF00FF40' },
  { main: '#8B5CF6', glow: '#8B5CF640' },
  { main: '#FFD700', glow: '#FFD70040' },
  { main: '#00FF88', glow: '#00FF8840' },
  { main: '#FF6B9D', glow: '#FF6B9D40' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 GAME TYPES & DATA
// ═══════════════════════════════════════════════════════════════════════════════
type ShapeType = 'circle' | 'square' | 'diamond' | 'triangle' | 'hexagon';
type RuleType = ChallengeType; // Now using the expanded challenge types
type Screen = 'home' | 'galaxy' | 'puzzle' | 'victory' | 'defeat';

interface Shape {
  id: number;
  type: ShapeType;
  color: typeof GLOW_COLORS[0];
  size: number;
  x: number;
  y: number;
  brightness: number;
  rotation: number;
}

interface Level {
  id: number;
  name: string;
  baseChallenge: ChallengeType;
  shapeCount: number;
  requiredStreak: number;
  world: number;
  unlocked: boolean;
  availableChallenges: ChallengeType[];
}

interface World {
  id: number;
  name: string;
  color: string;
  x: number;
  y: number;
  scale: number;
}

const WORLDS: World[] = [
  { id: 1, name: 'VOID', color: COLORS.violet, x: W * 0.25, y: H * 0.35, scale: 1.2 },
  { id: 2, name: 'ABYSS', color: COLORS.cyan, x: W * 0.7, y: H * 0.45, scale: 1.0 },
  { id: 3, name: 'COSMOS', color: COLORS.gold, x: W * 0.45, y: H * 0.65, scale: 0.9 },
];

const LEVELS: Level[] = [
  { id: 1, name: 'ORIGIN', baseChallenge: 'largestShape', shapeCount: 3, requiredStreak: 3, world: 1, unlocked: true, 
    availableChallenges: ['largestShape', 'smallestShape', 'brightestColor'] },
  { id: 2, name: 'ECHO', baseChallenge: 'smallestShape', shapeCount: 3, requiredStreak: 3, world: 1, unlocked: true,
    availableChallenges: ['smallestShape', 'largestShape', 'darkestColor', 'leftMost'] },
  { id: 3, name: 'PULSE', baseChallenge: 'brightestColor', shapeCount: 4, requiredStreak: 4, world: 1, unlocked: true,
    availableChallenges: ['brightestColor', 'darkestColor', 'topMost', 'bottomMost'] },
  { id: 4, name: 'DRIFT', baseChallenge: 'leftMost', shapeCount: 4, requiredStreak: 4, world: 1, unlocked: true,
    availableChallenges: ['leftMost', 'rightMost', 'topMost', 'bottomMost', 'largestShape'] },
  { id: 5, name: 'FLUX', baseChallenge: 'rightMost', shapeCount: 4, requiredStreak: 4, world: 2, unlocked: false,
    availableChallenges: ['rightMost', 'centerMost', 'brightestColor', 'countBased'] },
  { id: 6, name: 'NOVA', baseChallenge: 'centerMost', shapeCount: 5, requiredStreak: 5, world: 2, unlocked: false,
    availableChallenges: ['centerMost', 'mostIsolated', 'darkestColor', 'countBased'] },
  { id: 7, name: 'RIFT', baseChallenge: 'mostIsolated', shapeCount: 5, requiredStreak: 5, world: 2, unlocked: false,
    availableChallenges: ['mostIsolated', 'mostCrowded', 'oddOneOut', 'exclusion'] },
  { id: 8, name: 'APEX', baseChallenge: 'oddOneOut', shapeCount: 6, requiredStreak: 5, world: 3, unlocked: false,
    availableChallenges: ['oddOneOut', 'patternBreaker', 'firstAppeared', 'mostIsolated'] },
  { id: 9, name: 'OMEGA', baseChallenge: 'firstAppeared', shapeCount: 6, requiredStreak: 6, world: 3, unlocked: false,
    availableChallenges: ['firstAppeared', 'lastAppeared', 'flickering', 'patternBreaker'] },
  { id: 10, name: 'INFINITY', baseChallenge: 'colorShift', shapeCount: 7, requiredStreak: 7, world: 3, unlocked: false,
    availableChallenges: ['colorShift', 'flickering', 'oddOneOut', 'mostCrowded', 'exclusion'] },
];

const SHAPE_TYPES: ShapeType[] = ['circle', 'square', 'diamond', 'triangle', 'hexagon'];

// ═══════════════════════════════════════════════════════════════════════════════
// 🔊 PREMIUM HAPTICS
// ═══════════════════════════════════════════════════════════════════════════════
const haptic = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 60);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 120);
    setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 200);
  },
  failure: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);
    setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error), 200);
  },
  select: () => Haptics.selectionAsync(),
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 GAME LOGIC
// ═══════════════════════════════════════════════════════════════════════════════
function generateShapes(count: number, spatialDensity: number = 0.5): Shape[] {
  const shapes: Shape[] = [];
  const padding = 80;
  const areaW = W - padding * 2;
  const areaH = H * 0.55;
  const offsetY = H * 0.22;
  
  // Adjust spread based on spatial density
  const clusterFactor = 1 - spatialDensity;
  const spreadW = areaW * (0.6 + clusterFactor * 0.4);
  const spreadH = areaH * (0.6 + clusterFactor * 0.4);
  const centerX = W / 2;
  const centerY = offsetY + areaH / 2;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const distance = (0.3 + Math.random() * 0.7) * (spatialDensity > 0.7 ? 0.5 : 1);
    
    shapes.push({
      id: i,
      type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      color: GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)],
      size: 55 + Math.random() * 35,
      x: spatialDensity > 0.5 
        ? centerX + Math.cos(angle) * spreadW * 0.3 * distance + (Math.random() - 0.5) * 80
        : padding + Math.random() * areaW,
      y: spatialDensity > 0.5
        ? centerY + Math.sin(angle) * spreadH * 0.3 * distance + (Math.random() - 0.5) * 60
        : offsetY + Math.random() * areaH,
      brightness: 0.35 + Math.random() * 0.65,
      rotation: Math.random() * 360,
    });
  }
  return shapes;
}

// Calculate distance between two shapes
function getDistance(a: Shape, b: Shape): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// Calculate isolation score (average distance to all other shapes)
function getIsolationScore(shape: Shape, allShapes: Shape[]): number {
  const others = allShapes.filter(s => s.id !== shape.id);
  if (others.length === 0) return 0;
  const totalDistance = others.reduce((sum, other) => sum + getDistance(shape, other), 0);
  return totalDistance / others.length;
}

// Calculate crowding score (inverse of average distance to nearby shapes)
function getCrowdingScore(shape: Shape, allShapes: Shape[]): number {
  const others = allShapes.filter(s => s.id !== shape.id);
  if (others.length === 0) return 0;
  const nearbyShapes = others.sort((a, b) => getDistance(shape, a) - getDistance(shape, b)).slice(0, 3);
  const avgDistance = nearbyShapes.reduce((sum, other) => sum + getDistance(shape, other), 0) / nearbyShapes.length;
  return 1 / (avgDistance + 1);
}

// Calculate distance from center
function getDistanceFromCenter(shape: Shape): number {
  const centerX = W / 2;
  const centerY = H * 0.22 + (H * 0.55) / 2;
  return Math.sqrt(Math.pow(shape.x - centerX, 2) + Math.pow(shape.y - centerY, 2));
}

// Expanded challenge resolution - returns correct shape ID
function getCorrectId(shapes: Shape[], challenge: ChallengeType, context?: { 
  excludeColor?: string; 
  excludeSize?: 'small' | 'large';
  targetCount?: number;
  targetType?: ShapeType;
  appearanceOrder?: number[];
  flickeringId?: number;
  shiftingId?: number;
}): number {
  let correct = shapes[0];
  
  switch (challenge) {
    // Visual Domain
    case 'matchColor':
      // Handled by generating specific rule text
      correct = shapes[Math.floor(Math.random() * shapes.length)];
      break;
    case 'matchShape':
      correct = shapes[Math.floor(Math.random() * shapes.length)];
      break;
    case 'brightestColor':
      correct = shapes.reduce((a, b) => a.brightness > b.brightness ? a : b);
      break;
    case 'darkestColor':
      correct = shapes.reduce((a, b) => a.brightness < b.brightness ? a : b);
      break;
    case 'largestShape':
      correct = shapes.reduce((a, b) => a.size > b.size ? a : b);
      break;
    case 'smallestShape':
      correct = shapes.reduce((a, b) => a.size < b.size ? a : b);
      break;
    case 'colorGradient':
      // Find shape with most different brightness from neighbors
      let maxDiff = 0;
      shapes.forEach(shape => {
        const others = shapes.filter(s => s.id !== shape.id);
        const avgBrightness = others.reduce((sum, s) => sum + s.brightness, 0) / others.length;
        const diff = Math.abs(shape.brightness - avgBrightness);
        if (diff > maxDiff) {
          maxDiff = diff;
          correct = shape;
        }
      });
      break;
      
    // Spatial Domain
    case 'topMost':
      correct = shapes.reduce((a, b) => a.y < b.y ? a : b);
      break;
    case 'bottomMost':
      correct = shapes.reduce((a, b) => a.y > b.y ? a : b);
      break;
    case 'leftMost':
      correct = shapes.reduce((a, b) => a.x < b.x ? a : b);
      break;
    case 'rightMost':
      correct = shapes.reduce((a, b) => a.x > b.x ? a : b);
      break;
    case 'centerMost':
      correct = shapes.reduce((a, b) => getDistanceFromCenter(a) < getDistanceFromCenter(b) ? a : b);
      break;
    case 'mostIsolated':
      correct = shapes.reduce((a, b) => getIsolationScore(a, shapes) > getIsolationScore(b, shapes) ? a : b);
      break;
    case 'mostCrowded':
      correct = shapes.reduce((a, b) => getCrowdingScore(a, shapes) > getCrowdingScore(b, shapes) ? a : b);
      break;
      
    // Logical Domain
    case 'oddOneOut':
      // Find the shape type that appears only once
      const typeCounts: Record<string, number> = {};
      shapes.forEach(s => typeCounts[s.type] = (typeCounts[s.type] || 0) + 1);
      const rareType = Object.entries(typeCounts).find(([_, count]) => count === 1)?.[0];
      if (rareType) {
        correct = shapes.find(s => s.type === rareType) || shapes[0];
      } else {
        // Fallback: find unique color
        const colorCounts: Record<string, number> = {};
        shapes.forEach(s => colorCounts[s.color.main] = (colorCounts[s.color.main] || 0) + 1);
        const rareColor = Object.entries(colorCounts).find(([_, count]) => count === 1)?.[0];
        if (rareColor) {
          correct = shapes.find(s => s.color.main === rareColor) || shapes[0];
        }
      }
      break;
    case 'patternBreaker':
      // Find shape that breaks size pattern
      const sortedBySize = [...shapes].sort((a, b) => a.size - b.size);
      let maxSizeDiff = 0;
      sortedBySize.forEach((shape, i) => {
        if (i > 0 && i < sortedBySize.length - 1) {
          const expectedSize = (sortedBySize[i-1].size + sortedBySize[i+1].size) / 2;
          const diff = Math.abs(shape.size - expectedSize);
          if (diff > maxSizeDiff) {
            maxSizeDiff = diff;
            correct = shape;
          }
        }
      });
      break;
    case 'countBased':
      // Find the Nth largest/smallest (context.targetCount)
      const n = context?.targetCount || 2;
      const sortedShapes = [...shapes].sort((a, b) => b.size - a.size);
      correct = sortedShapes[Math.min(n - 1, sortedShapes.length - 1)];
      break;
    case 'exclusion':
      // Find shape that is NOT the excluded attributes
      const excludeColor = context?.excludeColor || shapes[0].color.main;
      const excludeSize = context?.excludeSize || 'large';
      const avgSize = shapes.reduce((sum, s) => sum + s.size, 0) / shapes.length;
      
      const candidates = shapes.filter(s => {
        const matchesColor = s.color.main === excludeColor;
        const matchesSize = excludeSize === 'large' ? s.size > avgSize : s.size < avgSize;
        return !matchesColor && !matchesSize;
      });
      correct = candidates[0] || shapes[0];
      break;
      
    // Temporal Domain
    case 'firstAppeared':
      if (context?.appearanceOrder && context.appearanceOrder.length > 0) {
        const order = context.appearanceOrder;
        correct = shapes.find(s => s.id === order[0]) || shapes[0];
      }
      break;
    case 'lastAppeared':
      if (context?.appearanceOrder && context.appearanceOrder.length > 0) {
        const order = context.appearanceOrder;
        correct = shapes.find(s => s.id === order[order.length - 1]) || shapes[0];
      }
      break;
    case 'flickering':
      if (context?.flickeringId !== undefined) {
        correct = shapes.find(s => s.id === context.flickeringId) || shapes[0];
      }
      break;
    case 'colorShift':
      if (context?.shiftingId !== undefined) {
        correct = shapes.find(s => s.id === context.shiftingId) || shapes[0];
      }
      break;
      
    default:
      correct = shapes[0];
  }
  
  return correct.id;
}

// Get challenge description for display
function getChallengeDescription(challenge: ChallengeType, context?: { 
  targetColor?: string; 
  targetShape?: string;
  targetCount?: number;
  excludeColor?: string;
  excludeSize?: string;
}): string {
  const def = CHALLENGE_DEFINITIONS.find(d => d.type === challenge);
  
  switch (challenge) {
    case 'matchColor': return `Find the ${context?.targetColor?.toUpperCase() || 'CYAN'}`;
    case 'matchShape': return `Find the ${context?.targetShape?.toUpperCase() || 'CIRCLE'}`;
    case 'countBased': return `Find the ${context?.targetCount === 2 ? '2ND' : context?.targetCount === 3 ? '3RD' : `${context?.targetCount}TH`} LARGEST`;
    case 'exclusion': return `Find NOT ${context?.excludeColor?.toUpperCase() || 'CYAN'} AND NOT ${context?.excludeSize?.toUpperCase() || 'LARGE'}`;
    default: return def?.description || 'Find the TARGET';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 PLAYER INTELLIGENCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

// Create fresh player profile
function createPlayerProfile(): PlayerBehaviorProfile {
  return {
    sessionId: `session_${Date.now()}`,
    sessionStartTime: Date.now(),
    rounds: [],
    errorPatterns: [],
    averageReactionTime: 0,
    consistencyScore: 1,
    confidenceIndicator: 1,
    streakHistory: [0],
    peakPerformanceRound: 0,
    fatigueIndicator: 0,
    totalHesitations: 0,
    clutchSuccesses: 0,
  };
}

// Default difficulty vector
function createDefaultDifficultyVector(level: Level): DifficultyVector {
  return {
    shapeCount: level.shapeCount,
    colorSimilarity: 0.3,
    sizeVariance: 0.5,
    movementSpeed: 0,
    timeLimit: 10,
    ruleComplexity: Math.min(level.id, 5),
    distractorCount: Math.floor(level.shapeCount * 0.3),
    spatialDensity: 0.4,
  };
}

// Update player profile after a round
function updatePlayerProfile(
  profile: PlayerBehaviorProfile,
  roundBehavior: RoundBehavior
): PlayerBehaviorProfile {
  const updatedRounds = [...profile.rounds, roundBehavior];
  
  // Calculate average reaction time
  const avgReactionTime = updatedRounds.reduce((sum, r) => sum + r.reactionTimeMs, 0) / updatedRounds.length;
  
  // Calculate consistency (inverse of coefficient of variation)
  const reactionTimes = updatedRounds.map(r => r.reactionTimeMs);
  const stdDev = Math.sqrt(reactionTimes.reduce((sum, t) => sum + Math.pow(t - avgReactionTime, 2), 0) / reactionTimes.length);
  const consistencyScore = Math.max(0, 1 - (stdDev / avgReactionTime));
  
  // Calculate confidence (inverse of hesitation rate)
  const totalHesitations = profile.totalHesitations + roundBehavior.hesitationCount;
  const confidenceIndicator = Math.max(0, 1 - (totalHesitations / (updatedRounds.length * 3)));
  
  // Update error patterns
  const errorPatterns = [...profile.errorPatterns];
  if (!roundBehavior.selectedCorrect) {
    const challengeDef = CHALLENGE_DEFINITIONS.find(d => d.type === roundBehavior.challengeType);
    const domain = challengeDef?.domain || 'visual';
    const existingPattern = errorPatterns.find(p => p.challengeType === roundBehavior.challengeType);
    if (existingPattern) {
      existingPattern.errorCount++;
      existingPattern.lastOccurred = roundBehavior.timestamp;
    } else {
      errorPatterns.push({
        challengeType: roundBehavior.challengeType,
        errorCount: 1,
        lastOccurred: roundBehavior.timestamp,
        domain,
      });
    }
  }
  
  // Update streak history
  const streakHistory = [...profile.streakHistory];
  if (roundBehavior.selectedCorrect) {
    streakHistory[streakHistory.length - 1]++;
  } else {
    streakHistory.push(0);
  }
  
  // Calculate fatigue (performance decay over time)
  let fatigueIndicator = 0;
  if (updatedRounds.length >= 6) {
    const firstHalf = updatedRounds.slice(0, Math.floor(updatedRounds.length / 2));
    const secondHalf = updatedRounds.slice(Math.floor(updatedRounds.length / 2));
    const firstHalfSuccess = firstHalf.filter(r => r.selectedCorrect).length / firstHalf.length;
    const secondHalfSuccess = secondHalf.filter(r => r.selectedCorrect).length / secondHalf.length;
    fatigueIndicator = Math.max(0, firstHalfSuccess - secondHalfSuccess);
  }
  
  // Find peak performance round
  let peakPerformanceRound = profile.peakPerformanceRound;
  let maxStreak = 0;
  let currentStreak = 0;
  updatedRounds.forEach((r, i) => {
    if (r.selectedCorrect) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        peakPerformanceRound = i;
      }
    } else {
      currentStreak = 0;
    }
  });
  
  // Count clutch successes
  const clutchSuccesses = profile.clutchSuccesses + (roundBehavior.clutchSave ? 1 : 0);
  
  return {
    ...profile,
    rounds: updatedRounds,
    errorPatterns,
    averageReactionTime: avgReactionTime,
    consistencyScore,
    confidenceIndicator,
    streakHistory,
    peakPerformanceRound,
    fatigueIndicator,
    totalHesitations,
    clutchSuccesses,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 ADAPTIVE DIFFICULTY ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

// Target: 70% success rate for flow state
function adaptDifficulty(
  profile: PlayerBehaviorProfile,
  currentVector: DifficultyVector,
  level: Level
): DifficultyVector {
  const recentRounds = profile.rounds.slice(-5);
  if (recentRounds.length < 3) return currentVector;
  
  const successRate = recentRounds.filter(r => r.selectedCorrect).length / recentRounds.length;
  const avgReactionTime = recentRounds.reduce((sum, r) => sum + r.reactionTimeMs, 0) / recentRounds.length;
  
  let newVector = { ...currentVector };
  
  if (successRate > 0.85) {
    // Player crushing it - increase challenge
    newVector = escalateDifficulty(newVector, profile.errorPatterns, level);
  } else if (successRate < 0.55) {
    // Player struggling - ease up intelligently
    newVector = reduceDifficulty(newVector, profile.errorPatterns, level);
  } else {
    // In flow zone - subtle variations
    newVector = introduceMicroVariations(newVector);
  }
  
  // Speed-based adjustments
  if (avgReactionTime < 600) {
    // Fast player - can handle more complexity
    newVector.shapeCount = Math.min(level.shapeCount + 2, 12);
  } else if (avgReactionTime > 2000) {
    // Slower player - reduce visual noise
    newVector.shapeCount = Math.max(level.shapeCount - 1, 3);
  }
  
  return newVector;
}

function escalateDifficulty(
  vector: DifficultyVector,
  errorPatterns: ErrorPattern[],
  level: Level
): DifficultyVector {
  // Find weakest area based on error patterns
  const domainErrors: Record<string, number> = { visual: 0, spatial: 0, logical: 0, temporal: 0 };
  errorPatterns.forEach(p => domainErrors[p.domain] += p.errorCount);
  
  const weakestDomain = Object.entries(domainErrors)
    .filter(([_, count]) => count > 0)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  return {
    ...vector,
    shapeCount: Math.min(vector.shapeCount + 1, 12),
    colorSimilarity: Math.min(vector.colorSimilarity + 0.1, 0.8),
    sizeVariance: Math.max(vector.sizeVariance - 0.1, 0.2),
    timeLimit: Math.max(vector.timeLimit - 1, 5),
    ruleComplexity: Math.min(vector.ruleComplexity + 0.5, 5),
    spatialDensity: weakestDomain === 'spatial' 
      ? Math.min(vector.spatialDensity + 0.15, 0.9) 
      : vector.spatialDensity,
  };
}

function reduceDifficulty(
  vector: DifficultyVector,
  errorPatterns: ErrorPattern[],
  level: Level
): DifficultyVector {
  // Find area causing most problems
  const recentErrors = errorPatterns.filter(p => p.lastOccurred > Date.now() - 30000);
  
  return {
    ...vector,
    shapeCount: Math.max(vector.shapeCount - 1, level.shapeCount - 1),
    colorSimilarity: Math.max(vector.colorSimilarity - 0.15, 0.1),
    sizeVariance: Math.min(vector.sizeVariance + 0.1, 0.8),
    timeLimit: Math.min(vector.timeLimit + 2, 15),
    ruleComplexity: Math.max(vector.ruleComplexity - 0.5, 1),
    spatialDensity: Math.max(vector.spatialDensity - 0.1, 0.2),
  };
}

function introduceMicroVariations(vector: DifficultyVector): DifficultyVector {
  return {
    ...vector,
    colorSimilarity: vector.colorSimilarity + (Math.random() - 0.5) * 0.1,
    spatialDensity: vector.spatialDensity + (Math.random() - 0.5) * 0.1,
  };
}

// Select next challenge type intelligently
function selectNextChallenge(
  profile: PlayerBehaviorProfile,
  level: Level,
  roundNumber: number
): ChallengeType {
  const available = level.availableChallenges;
  const recent = profile.rounds.slice(-3).map(r => r.challengeType);
  
  // Avoid repeating recent challenges
  const candidates = available.filter(c => !recent.includes(c));
  
  if (candidates.length === 0) return available[0];
  
  // Weight by error patterns - more likely to give challenges player struggles with
  const weights = candidates.map(c => {
    const errorPattern = profile.errorPatterns.find(p => p.challengeType === c);
    // Higher weight for struggled challenges (adaptive learning)
    return 1 + (errorPattern?.errorCount || 0) * 0.3;
  });
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < candidates.length; i++) {
    random -= weights[i];
    if (random <= 0) return candidates[i];
  }
  
  return candidates[0];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 💰 SKILL-WEIGHTED SCORING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

function calculateDifficultyScore(vector: DifficultyVector): number {
  return (
    vector.shapeCount / 12 * 0.25 +
    vector.colorSimilarity * 0.15 +
    (1 - vector.sizeVariance) * 0.1 +
    vector.ruleComplexity / 5 * 0.25 +
    vector.spatialDensity * 0.15 +
    (15 - vector.timeLimit) / 10 * 0.1
  );
}

function calculateRoundScore(
  behavior: RoundBehavior,
  profile: PlayerBehaviorProfile
): number {
  if (!behavior.selectedCorrect) return 0;
  
  const config: ScoringConfig = {
    basePoints: 100,
    speedMultiplier: 2.5,
    difficultyMultiplier: 3.0,
    challengeTypeWeight: 2.0,
    consistencyBonus: 0.5,
    streakMultiplier: 1.5,
    clutchBonus: 1.25,
  };
  
  let score = config.basePoints;
  
  // Speed component (faster = more points, with diminishing returns)
  const speedFactor = Math.max(0.5, config.speedMultiplier - (behavior.reactionTimeMs / 2000));
  score *= speedFactor;
  
  // Difficulty component
  const difficultyScore = calculateDifficultyScore(behavior.difficultyVector);
  score *= (1 + difficultyScore * config.difficultyMultiplier);
  
  // Challenge type weight
  const challengeDef = CHALLENGE_DEFINITIONS.find(d => d.type === behavior.challengeType);
  score *= (challengeDef?.baseWeight || 1);
  
  // Consistency bonus (low variance players rewarded)
  if (profile.consistencyScore > 0.8) {
    score *= (1 + config.consistencyBonus * (profile.consistencyScore - 0.8) * 5);
  }
  
  // Streak multiplier (exponential growth, capped)
  const currentStreak = profile.streakHistory[profile.streakHistory.length - 1] || 0;
  score *= Math.min(Math.pow(currentStreak + 1, config.streakMultiplier), 50);
  
  // Clutch bonus (success when time was running out)
  if (behavior.clutchSave) {
    score *= config.clutchBonus;
  }
  
  return Math.round(score);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 PERFORMANCE VECTOR CALCULATION
// ═══════════════════════════════════════════════════════════════════════════════

function calculatePerformanceVector(profile: PlayerBehaviorProfile): PerformanceVector {
  if (profile.rounds.length === 0) {
    return { speed: 50, accuracy: 50, consistency: 50, spatial: 50, pattern: 50, pressure: 50 };
  }
  
  // Speed (0-100, based on reaction time percentile)
  const avgReaction = profile.averageReactionTime;
  const speed = Math.max(0, Math.min(100, 100 - (avgReaction / 30))); // 0ms = 100, 3000ms = 0
  
  // Accuracy (0-100, success rate)
  const accuracy = (profile.rounds.filter(r => r.selectedCorrect).length / profile.rounds.length) * 100;
  
  // Consistency (0-100, from consistency score)
  const consistency = profile.consistencyScore * 100;
  
  // Spatial (0-100, performance on spatial challenges)
  const spatialRounds = profile.rounds.filter(r => 
    ['topMost', 'bottomMost', 'leftMost', 'rightMost', 'centerMost', 'mostIsolated', 'mostCrowded'].includes(r.challengeType)
  );
  const spatial = spatialRounds.length > 0 
    ? (spatialRounds.filter(r => r.selectedCorrect).length / spatialRounds.length) * 100 
    : 50;
  
  // Pattern (0-100, performance on visual/logical challenges)
  const patternRounds = profile.rounds.filter(r =>
    ['oddOneOut', 'patternBreaker', 'colorGradient', 'matchColor', 'matchShape'].includes(r.challengeType)
  );
  const pattern = patternRounds.length > 0
    ? (patternRounds.filter(r => r.selectedCorrect).length / patternRounds.length) * 100
    : 50;
  
  // Pressure (0-100, clutch performance)
  const clutchRate = profile.rounds.length > 0 
    ? Math.min(100, (profile.clutchSuccesses / profile.rounds.length) * 500) 
    : 50;
  const pressure = (clutchRate + (100 - profile.fatigueIndicator * 100)) / 2;
  
  return {
    speed: Math.round(speed),
    accuracy: Math.round(accuracy),
    consistency: Math.round(consistency),
    spatial: Math.round(spatial),
    pattern: Math.round(pattern),
    pressure: Math.round(pressure),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 💬 INSIGHT GENERATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

function generateInsights(profile: PlayerBehaviorProfile): string[] {
  const matchedInsights = INSIGHT_RULES
    .filter(rule => rule.condition(profile))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 2); // Top 2 insights
  
  if (matchedInsights.length === 0) {
    // Fallback insights based on basic stats
    const successRate = profile.rounds.filter(r => r.selectedCorrect).length / Math.max(profile.rounds.length, 1);
    if (successRate > 0.8) {
      return ["Excellence speaks in silence. Your performance needs no commentary."];
    } else if (successRate > 0.5) {
      return ["Potential and execution dance together. The rhythm is yours to master."];
    } else {
      return ["Every master was once a disaster. The path is being walked."];
    }
  }
  
  return matchedInsights.map(rule => rule.insight);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 RADAR CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const RADAR_RADIUS = 80;
const RADAR_AXES = ['speed', 'accuracy', 'consistency', 'spatial', 'pattern', 'pressure'] as const;
const RADAR_LABELS = ['SPEED', 'ACCURACY', 'CONSISTENCY', 'SPATIAL', 'PATTERN', 'PRESSURE'];

const RadarChart: React.FC<{ data: PerformanceVector; color: string }> = ({ data, color }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dotAnims = RADAR_AXES.map(() => useRef(new Animated.Value(0)).current);
  
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 8, delay: 300, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
    ]).start();
    
    // Animate each data point sequentially
    dotAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 500 + i * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, []);
  
  const angleStep = (2 * Math.PI) / 6;
  
  // Calculate polygon points for data
  const getPoint = (axis: typeof RADAR_AXES[number], index: number) => {
    const value = data[axis] / 100;
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: Math.cos(angle) * value * RADAR_RADIUS,
      y: Math.sin(angle) * value * RADAR_RADIUS,
    };
  };
  
  return (
    <Animated.View style={[styles.radarContainer, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      {/* Background hexagon rings */}
      {[0.25, 0.5, 0.75, 1].map((scale, ringIdx) => (
        <View
          key={`ring-${ringIdx}`}
          style={[
            styles.radarRing,
            {
              width: RADAR_RADIUS * 2 * scale,
              height: RADAR_RADIUS * 2 * scale,
              borderRadius: RADAR_RADIUS * scale,
              borderColor: COLORS.textMuted + '30',
            },
          ]}
        />
      ))}
      
      {/* Axis lines */}
      {RADAR_AXES.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const endX = Math.cos(angle) * RADAR_RADIUS;
        const endY = Math.sin(angle) * RADAR_RADIUS;
        return (
          <View
            key={`axis-${i}`}
            style={[
              styles.radarAxis,
              {
                width: RADAR_RADIUS,
                transform: [
                  { translateX: RADAR_RADIUS / 2 },
                  { rotate: `${i * 60 - 90}deg` },
                  { translateX: -RADAR_RADIUS / 2 },
                ],
              },
            ]}
          />
        );
      })}
      
      {/* Data points with glow */}
      {RADAR_AXES.map((axis, i) => {
        const point = getPoint(axis, i);
        return (
          <Animated.View
            key={`dot-${i}`}
            style={[
              styles.radarDot,
              {
                backgroundColor: color,
                left: RADAR_RADIUS + point.x - 6,
                top: RADAR_RADIUS + point.y - 6,
                opacity: dotAnims[i],
                transform: [{ scale: dotAnims[i] }],
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 10,
              },
            ]}
          />
        );
      })}
      
      {/* Data value labels */}
      {RADAR_AXES.map((axis, i) => {
        const point = getPoint(axis, i);
        const labelAngle = i * angleStep - Math.PI / 2;
        const labelDistance = RADAR_RADIUS + 30;
        const labelX = Math.cos(labelAngle) * labelDistance;
        const labelY = Math.sin(labelAngle) * labelDistance;
        return (
          <View
            key={`label-${i}`}
            style={[
              styles.radarLabel,
              {
                left: RADAR_RADIUS + labelX - 30,
                top: RADAR_RADIUS + labelY - 12,
              },
            ]}
          >
            <Text style={[styles.radarLabelText, { color }]}>{RADAR_LABELS[i]}</Text>
            <Text style={styles.radarLabelValue}>{data[axis]}</Text>
          </View>
        );
      })}
      
      {/* Center glow */}
      <View style={[styles.radarCenter, { backgroundColor: color + '20' }]} />
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💬 INSIGHT DISPLAY COMPONENT (Typewriter Effect)
// ═══════════════════════════════════════════════════════════════════════════════
const InsightDisplay: React.FC<{ insights: string[]; color: string }> = ({ insights, color }) => {
  const [displayedChars, setDisplayedChars] = useState<number[]>(insights.map(() => 0));
  const fadeAnims = insights.map(() => useRef(new Animated.Value(0)).current);
  
  useEffect(() => {
    // Stagger insight appearances
    insights.forEach((insight, idx) => {
      const delay = idx * 2000 + 800;
      
      Animated.timing(fadeAnims[idx], {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }).start();
      
      // Typewriter effect
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        charIndex++;
        setDisplayedChars(prev => {
          const newChars = [...prev];
          newChars[idx] = charIndex;
          return newChars;
        });
        if (charIndex >= insight.length) {
          clearInterval(typeInterval);
        }
      }, 30);
      
      // Start typing after fade in
      setTimeout(() => {}, delay + 300);
    });
  }, []);
  
  return (
    <View style={styles.insightContainer}>
      {insights.map((insight, idx) => (
        <Animated.View
          key={idx}
          style={[styles.insightBox, { opacity: fadeAnims[idx], borderLeftColor: color }]}
        >
          <Text style={styles.insightText}>
            {insight.slice(0, displayedChars[idx])}
            {displayedChars[idx] < insight.length && (
              <Text style={[styles.insightCursor, { color }]}>|</Text>
            )}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 SCORE BREAKDOWN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const ScoreBreakdown: React.FC<{ 
  totalScore: number; 
  breakdown: { label: string; value: number; color: string }[];
}> = ({ totalScore, breakdown }) => {
  const countAnim = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    countAnim.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });
    
    Animated.timing(countAnim, {
      toValue: totalScore,
      duration: 1500,
      delay: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    
    return () => countAnim.removeAllListeners();
  }, [totalScore]);
  
  return (
    <View style={styles.scoreBreakdown}>
      <Text style={styles.totalScoreLabel}>TOTAL SCORE</Text>
      <Text style={styles.totalScoreValue}>{displayScore.toLocaleString()}</Text>
      <View style={styles.breakdownItems}>
        {breakdown.map((item, idx) => (
          <View key={idx} style={styles.breakdownItem}>
            <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
            <Text style={styles.breakdownLabel}>{item.label}</Text>
            <Text style={[styles.breakdownValue, { color: item.color }]}>
              {item.value > 0 ? '+' : ''}{item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✨ AMBIENT PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

const AmbientParticles: React.FC<{ count?: number; color?: string }> = ({ count = 40, color }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * W,
      y: Math.random() * H,
      size: 2 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.3,
      speed: 0.3 + Math.random() * 0.7,
      color: color || GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)].main,
    }));
  }, [count, color]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <AnimatedParticle key={p.id} particle={p} />
      ))}
    </View>
  );
};

const AnimatedParticle: React.FC<{ particle: Particle }> = ({ particle }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(particle.opacity)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const duration = 8000 / particle.speed;
    
    // Vertical drift
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -30 - Math.random() * 50, duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(translateY, { toValue: 30 + Math.random() * 50, duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();

    // Horizontal sway
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, { toValue: -15 - Math.random() * 20, duration: duration * 1.3, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(translateX, { toValue: 15 + Math.random() * 20, duration: duration * 1.3, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();

    // Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: particle.opacity * 0.3, duration: 2000 + Math.random() * 2000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: particle.opacity, duration: 2000 + Math.random() * 2000, useNativeDriver: true }),
      ])
    ).start();

    // Scale breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.6, duration: 3000 + Math.random() * 2000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(scale, { toValue: 1.4, duration: 3000 + Math.random() * 2000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: particle.x,
        top: particle.y,
        width: particle.size,
        height: particle.size,
        borderRadius: particle.size / 2,
        backgroundColor: particle.color,
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
        shadowColor: particle.color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: particle.size * 2,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔮 GLOWING SHAPE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const GlowingShape: React.FC<{
  shape: Shape;
  onPress: (id: number) => void;
  disabled: boolean;
  index: number;
}> = ({ shape, onPress, disabled, index }) => {
  const entryScale = useRef(new Animated.Value(0)).current;
  const entryOpacity = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const floatX = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.6)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Cinematic entry
    Animated.parallel([
      Animated.spring(entryScale, {
        toValue: 1,
        delay: index * 100 + 200,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(entryOpacity, {
        toValue: 1,
        delay: index * 100 + 200,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating
    const floatDuration = 2500 + Math.random() * 1500;
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(floatY, { toValue: -12, duration: floatDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(floatY, { toValue: 12, duration: floatDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(floatX, { toValue: -6, duration: floatDuration * 1.2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(floatX, { toValue: 6, duration: floatDuration * 1.2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1500 + Math.random() * 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.5, duration: 1500 + Math.random() * 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Subtle rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000 + Math.random() * 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handlePressIn = () => {
    haptic.light();
    Animated.spring(pressScale, { toValue: 0.85, tension: 300, friction: 10, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }).start();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderShapeCore = () => {
    const baseStyle = {
      width: shape.size,
      height: shape.size,
      backgroundColor: shape.color.main,
      opacity: shape.brightness,
    };

    switch (shape.type) {
      case 'circle':
        return <View style={[baseStyle, { borderRadius: shape.size / 2 }]} />;
      case 'square':
        return <View style={[baseStyle, { borderRadius: shape.size * 0.15 }]} />;
      case 'diamond':
        return <Animated.View style={[baseStyle, { borderRadius: shape.size * 0.1, transform: [{ rotate: '45deg' }] }]} />;
      case 'triangle':
        return (
          <View style={{
            width: 0, height: 0,
            borderLeftWidth: shape.size / 2,
            borderRightWidth: shape.size / 2,
            borderBottomWidth: shape.size,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: shape.color.main,
            opacity: shape.brightness,
          }} />
        );
      case 'hexagon':
        return <View style={[baseStyle, { borderRadius: shape.size * 0.25 }]} />;
      default:
        return <View style={[baseStyle, { borderRadius: shape.size / 2 }]} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.shapeWrapper,
        {
          left: shape.x - shape.size / 2 - 20,
          top: shape.y - shape.size / 2 - 20,
          opacity: entryOpacity,
          transform: [
            { scale: Animated.multiply(entryScale, pressScale) as any },
            { translateY: floatY as any },
            { translateX: floatX as any },
          ],
        },
      ]}
    >
      {/* Outer glow */}
      <Animated.View style={[styles.glowOuter, {
        width: shape.size + 40,
        height: shape.size + 40,
        borderRadius: shape.size + 40,
        backgroundColor: shape.color.glow,
        opacity: Animated.multiply(glowPulse, 0.4) as any,
      }]} />
      
      {/* Middle glow */}
      <Animated.View style={[styles.glowMiddle, {
        width: shape.size + 24,
        height: shape.size + 24,
        borderRadius: shape.size + 24,
        backgroundColor: shape.color.glow,
        opacity: Animated.multiply(glowPulse, 0.6) as any,
      }]} />

      {/* Inner glow */}
      <View style={[styles.glowInner, {
        width: shape.size + 10,
        height: shape.size + 10,
        borderRadius: shape.size + 10,
        backgroundColor: shape.color.main + '30',
      }]} />

      {/* Shape core */}
      <Pressable
        onPress={() => !disabled && onPress(shape.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.shapeCore, { width: shape.size + 40, height: shape.size + 40 }]}
      >
        <Animated.View style={{ transform: [{ rotate: shape.type === 'hexagon' ? rotation : '0deg' }] }}>
          {renderShapeCore()}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💥 SUCCESS EXPLOSION
// ═══════════════════════════════════════════════════════════════════════════════
const SuccessExplosion: React.FC<{ origin: { x: number; y: number }; onComplete: () => void }> = ({ origin, onComplete }) => {
  const rings = [1, 2, 3];
  const particles = Array.from({ length: 20 }, (_, i) => i);
  const ringScales = rings.map(() => useRef(new Animated.Value(0)).current);
  const ringOpacities = rings.map(() => useRef(new Animated.Value(1)).current);
  const particleAnims = particles.map(() => ({
    x: useRef(new Animated.Value(0)).current,
    y: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(1)).current,
    scale: useRef(new Animated.Value(1)).current,
  }));

  useEffect(() => {
    // Shockwave rings
    rings.forEach((_, i) => {
      Animated.parallel([
        Animated.timing(ringScales[i], {
          toValue: 3 + i,
          duration: 600 + i * 100,
          delay: i * 80,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacities[i], {
          toValue: 0,
          duration: 600 + i * 100,
          delay: i * 80,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Particle burst
    particles.forEach((_, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 150;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      Animated.parallel([
        Animated.timing(particleAnims[i].x, {
          toValue: tx,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(particleAnims[i].y, {
          toValue: ty,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(particleAnims[i].opacity, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(particleAnims[i].scale, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });

    setTimeout(onComplete, 900);
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]} pointerEvents="none">
      {/* Shockwave rings */}
      {rings.map((_, i) => (
        <Animated.View
          key={`ring-${i}`}
          style={{
            position: 'absolute',
            left: origin.x - 50,
            top: origin.y - 50,
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3 - i * 0.5,
            borderColor: COLORS.cyan,
            opacity: ringOpacities[i],
            transform: [{ scale: ringScales[i] }],
          }}
        />
      ))}
      
      {/* Burst particles */}
      {particles.map((_, i) => (
        <Animated.View
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            left: origin.x - 6,
            top: origin.y - 6,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: GLOW_COLORS[i % GLOW_COLORS.length].main,
            opacity: particleAnims[i].opacity,
            transform: [
              { translateX: particleAnims[i].x },
              { translateY: particleAnims[i].y },
              { scale: particleAnims[i].scale },
            ],
            shadowColor: GLOW_COLORS[i % GLOW_COLORS.length].main,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 8,
          }}
        />
      ))}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const HomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const titleScale = useRef(new Animated.Value(0.5)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Title entrance
    Animated.parallel([
      Animated.spring(titleScale, { toValue: 1, tension: 30, friction: 5, delay: 500, useNativeDriver: true }),
      Animated.timing(titleOpacity, { toValue: 1, duration: 1000, delay: 500, useNativeDriver: true }),
    ]).start();

    Animated.timing(subtitleOpacity, { toValue: 1, duration: 800, delay: 1200, useNativeDriver: true }).start();

    // Pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.08, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.7, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.screen}>
      <AmbientParticles count={50} />
      
      {/* Central glow */}
      <Animated.View style={[styles.centerGlow, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={['transparent', COLORS.violet + '40', COLORS.violet + '20', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      <Pressable style={styles.homeContent} onPress={() => { haptic.medium(); onStart(); }}>
        <Animated.View style={{ opacity: titleOpacity, transform: [{ scale: titleScale }] }}>
          <Text style={styles.heroTitle}>PUZZLE</Text>
          <Animated.Text style={[styles.heroSubtitle, { transform: [{ scale: pulseScale }] }]}>
            MIND
          </Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.tapPrompt, { opacity: subtitleOpacity }]}>
          <Text style={styles.tapText}>TAP TO ENTER</Text>
          <View style={styles.tapLine} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 GALAXY MAP (LEVEL SELECT)
// ═══════════════════════════════════════════════════════════════════════════════
const GalaxyMap: React.FC<{
  onSelectLevel: (id: number) => void;
  onBack: () => void;
  completedLevels: number[];
  currentLevel: number;
}> = ({ onSelectLevel, onBack, completedLevels, currentLevel }) => {
  const [selectedWorld, setSelectedWorld] = useState(1);
  const worldScale = useRef(new Animated.Value(1)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(starsOpacity, { toValue: 1, duration: 1500, useNativeDriver: true }).start();
  }, []);

  const worldLevels = LEVELS.filter(l => l.world === selectedWorld);
  const world = WORLDS.find(w => w.id === selectedWorld)!;

  return (
    <View style={styles.screen}>
      <AmbientParticles count={80} color={world.color} />
      
      {/* Star field */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: starsOpacity }]}>
        {Array.from({ length: 100 }, (_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: Math.random() * W,
              top: Math.random() * H,
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              borderRadius: 2,
              backgroundColor: '#FFFFFF',
              opacity: 0.3 + Math.random() * 0.7,
            }}
          />
        ))}
      </Animated.View>

      {/* Header */}
      <View style={styles.galaxyHeader}>
        <Pressable onPress={() => { haptic.light(); onBack(); }} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.galaxyTitle}>{world.name}</Text>
        <View style={styles.backBtn} />
      </View>

      {/* World orbs */}
      <View style={styles.worldOrbs}>
        {WORLDS.map((w) => {
          const isSelected = selectedWorld === w.id;
          const isLocked = w.id > 1 && !completedLevels.includes((w.id - 1) * 4);
          return (
            <Pressable
              key={w.id}
              onPress={() => {
                if (!isLocked) {
                  haptic.select();
                  setSelectedWorld(w.id);
                }
              }}
              style={[styles.worldOrb, isSelected && styles.worldOrbSelected]}
            >
              <View style={[styles.worldOrbInner, { backgroundColor: isLocked ? '#333' : w.color + '80' }]}>
                {isSelected && <View style={[styles.worldOrbGlow, { backgroundColor: w.color }]} />}
                <Text style={[styles.worldOrbText, isLocked && styles.lockedText]}>{w.name}</Text>
                {isLocked && <Text style={styles.lockEmoji}>🔒</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Level cards */}
      <View style={styles.levelList}>
        {worldLevels.map((level, idx) => {
          const isCompleted = completedLevels.includes(level.id);
          const isUnlocked = level.id <= currentLevel || isCompleted;
          return (
            <Animated.View key={level.id} style={{ opacity: 1 }}>
              <Pressable
                onPress={() => {
                  if (isUnlocked) {
                    haptic.medium();
                    onSelectLevel(level.id);
                  }
                }}
                style={[
                  styles.levelCard,
                  isCompleted && styles.levelCardCompleted,
                  !isUnlocked && styles.levelCardLocked,
                ]}
              >
                <LinearGradient
                  colors={isUnlocked ? [world.color + '20', world.color + '05'] : ['#1a1a2a', '#0f0f1a']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.levelCardContent}>
                  <Text style={[styles.levelNum, !isUnlocked && styles.lockedText]}>{level.id}</Text>
                  <View style={styles.levelInfo}>
                    <Text style={[styles.levelName, !isUnlocked && styles.lockedText]}>{level.name}</Text>
                    <Text style={[styles.levelRule, !isUnlocked && styles.lockedText]}>
                      {isUnlocked ? getChallengeDescription(level.baseChallenge) : '???'}
                    </Text>
                  </View>
                  {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                  {!isUnlocked && <Text style={styles.lockSmall}>🔒</Text>}
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 PUZZLE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const PuzzleScreen: React.FC<{
  levelId: number;
  onComplete: (success: boolean, streak: number, score: number, profile: PlayerBehaviorProfile) => void;
  onBack: () => void;
}> = ({ levelId, onComplete, onBack }) => {
  const level = LEVELS.find(l => l.id === levelId)!;
  const world = WORLDS.find(w => w.id === level.world)!;
  
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [key, setKey] = useState(0);
  const [explosion, setExplosion] = useState<{ x: number; y: number } | null>(null);
  
  // Intelligent adaptive system state
  const [playerProfile, setPlayerProfile] = useState<PlayerBehaviorProfile>(() => createPlayerProfile());
  const [difficultyVector, setDifficultyVector] = useState<DifficultyVector>(() => createDefaultDifficultyVector(level));
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeType>(level.baseChallenge);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [hesitationCount, setHesitationCount] = useState(0);
  const roundNumberRef = useRef(0);

  const flashOpacity = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const shakeY = useRef(new Animated.Value(0)).current;
  const screenScale = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  // Generate shapes and select challenge for new round
  useEffect(() => {
    roundNumberRef.current++;
    const newChallenge = roundNumberRef.current === 1 
      ? level.baseChallenge 
      : selectNextChallenge(playerProfile, level, roundNumberRef.current);
    setCurrentChallenge(newChallenge);
    setShapes(generateShapes(difficultyVector.shapeCount, difficultyVector.spatialDensity));
    setRoundStartTime(Date.now());
    setHesitationCount(0);
  }, [key]);

  useEffect(() => {
    Animated.spring(progressWidth, {
      toValue: (streak / level.requiredStreak) * 100,
      tension: 50,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [streak]);

  const triggerSuccess = (x: number, y: number) => {
    setExplosion({ x, y });
    
    // Flash
    flashOpacity.setValue(0.4);
    Animated.timing(flashOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start();
    
    // Screen punch
    Animated.sequence([
      Animated.timing(screenScale, { toValue: 1.02, duration: 80, useNativeDriver: true }),
      Animated.spring(screenScale, { toValue: 1, tension: 100, friction: 5, useNativeDriver: true }),
    ]).start();

    haptic.success();
  };

  const triggerFailure = () => {
    // Screen shake
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    // Red flash
    flashOpacity.setValue(0.3);
    Animated.timing(flashOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start();

    // Compress
    Animated.sequence([
      Animated.timing(screenScale, { toValue: 0.97, duration: 100, useNativeDriver: true }),
      Animated.spring(screenScale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
    ]).start();

    haptic.failure();
  };

  // Track hesitation (tapping without selecting)
  const handleAreaPress = useCallback(() => {
    if (!processing) {
      setHesitationCount(h => h + 1);
    }
  }, [processing]);

  const handleShapePress = useCallback((id: number) => {
    if (processing) return;
    setProcessing(true);

    const shape = shapes.find(s => s.id === id)!;
    const correct = getCorrectId(shapes, currentChallenge);
    const isCorrect = id === correct;
    
    // Calculate reaction time
    const reactionTimeMs = Date.now() - roundStartTime;
    const clutchSave = reactionTimeMs > difficultyVector.timeLimit * 800; // Success when <20% time remaining
    
    // Create round behavior record
    const roundBehavior: RoundBehavior = {
      roundNumber: roundNumberRef.current,
      reactionTimeMs,
      hesitationCount,
      selectedCorrect: isCorrect,
      challengeType: currentChallenge,
      difficultyVector: { ...difficultyVector },
      timestamp: Date.now(),
      clutchSave: isCorrect && clutchSave,
    };
    
    // Update player profile
    const updatedProfile = updatePlayerProfile(playerProfile, roundBehavior);
    setPlayerProfile(updatedProfile);
    
    // Calculate skill-weighted score
    const roundPoints = calculateRoundScore(roundBehavior, updatedProfile);

    if (isCorrect) {
      triggerSuccess(shape.x, shape.y);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(s => s + roundPoints);

      if (newStreak >= level.requiredStreak) {
        setTimeout(() => onComplete(true, newStreak, score + roundPoints, updatedProfile), 800);
      } else {
        // Adapt difficulty after each round
        const newDifficulty = adaptDifficulty(updatedProfile, difficultyVector, level);
        setDifficultyVector(newDifficulty);
        
        setTimeout(() => {
          setKey(k => k + 1);
          setProcessing(false);
          setExplosion(null);
        }, 600);
      }
    } else {
      triggerFailure();
      setTimeout(() => onComplete(false, streak, score, updatedProfile), 800);
    }
  }, [shapes, currentChallenge, streak, score, processing, roundStartTime, hesitationCount, difficultyVector, playerProfile]);

  // Get challenge description
  const challengeDescription = getChallengeDescription(currentChallenge);

  return (
    <Animated.View style={[styles.screen, { transform: [{ scale: screenScale }, { translateX: shakeX }] }]}>
      <AmbientParticles count={30} color={world.color} />

      {/* Success flash */}
      <Animated.View
        style={[styles.screenFlash, { opacity: flashOpacity, backgroundColor: COLORS.cyan + '60' }]}
        pointerEvents="none"
      />

      {/* Header */}
      <View style={styles.puzzleHeader}>
        <Pressable onPress={() => { haptic.light(); onBack(); }} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeWorld}>{world.name}</Text>
          <Text style={styles.levelBadgeName}>{level.name}</Text>
        </View>
        <View style={styles.streakContainer}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }), backgroundColor: world.color }]} />
        <View style={styles.progressGlow} />
      </View>

      {/* Rule hint - now using dynamic challenge description */}
      <View style={styles.ruleBox}>
        <Text style={styles.ruleText}>
          <Text style={[styles.ruleHighlight, { color: world.color }]}>{challengeDescription}</Text>
        </Text>
      </View>

      {/* Shapes - with hesitation tracking */}
      <Pressable style={styles.shapesArea} onPress={handleAreaPress} key={key}>
        {shapes.map((shape, idx) => (
          <GlowingShape
            key={`${key}-${shape.id}`}
            shape={shape}
            onPress={handleShapePress}
            disabled={processing}
            index={idx}
          />
        ))}
      </Pressable>

      {/* Explosion */}
      {explosion && (
        <SuccessExplosion origin={explosion} onComplete={() => setExplosion(null)} />
      )}
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎉 VICTORY SCREEN (Enhanced with Radar Chart & Insights)
// ═══════════════════════════════════════════════════════════════════════════════
const VictoryScreen: React.FC<{
  levelId: number;
  streak: number;
  score: number;
  profile: PlayerBehaviorProfile;
  onContinue: () => void;
  onReplay: () => void;
}> = ({ levelId, streak, score, profile, onContinue, onReplay }) => {
  const level = LEVELS.find(l => l.id === levelId)!;
  const world = WORLDS.find(w => w.id === level.world)!;
  
  // Calculate performance data
  const performanceVector = calculatePerformanceVector(profile);
  const insights = generateInsights(profile);
  
  // Calculate score breakdown
  const avgRoundScore = profile.rounds.length > 0 
    ? Math.round(score / profile.rounds.filter(r => r.selectedCorrect).length) 
    : 0;
  const speedBonus = Math.round(avgRoundScore * 0.3);
  const difficultyBonus = Math.round(avgRoundScore * 0.25);
  const streakBonus = Math.round(avgRoundScore * 0.35);
  const baseScore = score - speedBonus - difficultyBonus - streakBonus;
  
  const scoreBreakdown = [
    { label: 'Base Score', value: baseScore, color: COLORS.textSecondary },
    { label: 'Speed Bonus', value: speedBonus, color: COLORS.cyan },
    { label: 'Difficulty Bonus', value: difficultyBonus, color: COLORS.magenta },
    { label: 'Streak Bonus', value: streakBonus, color: COLORS.gold },
  ];

  const contentScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    haptic.success();
    
    Animated.parallel([
      Animated.spring(contentScale, { toValue: 1, tension: 40, friction: 5, delay: 200, useNativeDriver: true }),
      Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start();

    Animated.timing(scoreAnim, { toValue: score, duration: 1500, delay: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.screen}>
      <AmbientParticles count={60} color={world.color} />
      
      <Animated.View style={[styles.victoryGlow, { opacity: glowPulse }]}>
        <LinearGradient
          colors={['transparent', world.color + '30', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.ScrollView 
        style={styles.victoryScrollView}
        contentContainerStyle={styles.victoryScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.victoryContent, { opacity: contentOpacity, transform: [{ scale: contentScale }] }]}>
          <Text style={styles.victoryEmoji}>✨</Text>
          <Text style={styles.victoryTitle}>LEVEL COMPLETE</Text>
          <Text style={[styles.victoryLevel, { color: world.color }]}>{level.name}</Text>
          
          {/* Radar Chart Performance Display */}
          <View style={styles.radarWrapper}>
            <RadarChart data={performanceVector} color={world.color} />
          </View>
          
          {/* Score Breakdown */}
          <ScoreBreakdown totalScore={score} breakdown={scoreBreakdown} />
          
          {/* Quick Stats */}
          <View style={styles.victoryStats}>
            <View style={styles.victoryStat}>
              <Text style={styles.victoryStatValue}>{streak}</Text>
              <Text style={styles.victoryStatLabel}>STREAK</Text>
            </View>
            <View style={styles.victoryDivider} />
            <View style={styles.victoryStat}>
              <Text style={styles.victoryStatValue}>{profile.rounds.length}</Text>
              <Text style={styles.victoryStatLabel}>ROUNDS</Text>
            </View>
            <View style={styles.victoryDivider} />
            <View style={styles.victoryStat}>
              <Text style={styles.victoryStatValue}>{Math.round(profile.averageReactionTime)}ms</Text>
              <Text style={styles.victoryStatLabel}>AVG TIME</Text>
            </View>
          </View>
          
          {/* Post-Match Insights */}
          <InsightDisplay insights={insights} color={world.color} />
        </Animated.View>
      </Animated.ScrollView>

      <View style={styles.victoryButtons}>
        <Pressable style={styles.primaryBtn} onPress={() => { haptic.medium(); onContinue(); }}>
          <LinearGradient colors={[world.color, world.color + '80']} style={styles.btnGradient}>
            <Text style={styles.primaryBtnText}>CONTINUE</Text>
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={() => { haptic.light(); onReplay(); }}>
          <Text style={styles.ghostBtnText}>REPLAY</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💀 DEFEAT SCREEN (Enhanced with Insights)
// ═══════════════════════════════════════════════════════════════════════════════
const DefeatScreen: React.FC<{
  levelId: number;
  streak: number;
  profile: PlayerBehaviorProfile;
  onRetry: () => void;
  onBack: () => void;
}> = ({ levelId, streak, profile, onRetry, onBack }) => {
  const level = LEVELS.find(l => l.id === levelId)!;
  const world = WORLDS.find(w => w.id === level.world)!;
  
  // Generate insights for defeat screen
  const insights = generateInsights(profile);
  
  // Calculate mini performance stats
  const accuracy = profile.rounds.length > 0 
    ? Math.round((profile.rounds.filter(r => r.selectedCorrect).length / profile.rounds.length) * 100)
    : 0;

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(contentY, { toValue: 0, duration: 600, delay: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: COLORS.void }]}>
      <AmbientParticles count={20} color="#FF444440" />

      <Animated.View style={[styles.defeatContent, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>
        <Text style={styles.defeatEmoji}>💫</Text>
        <Text style={styles.defeatTitle}>NOT QUITE</Text>
        
        {/* Mini Stats */}
        <View style={styles.defeatStats}>
          <View style={styles.defeatStatItem}>
            <Text style={styles.defeatStatValue}>{streak}</Text>
            <Text style={styles.defeatStatLabel}>STREAK</Text>
          </View>
          <View style={styles.defeatStatDivider} />
          <View style={styles.defeatStatItem}>
            <Text style={styles.defeatStatValue}>{accuracy}%</Text>
            <Text style={styles.defeatStatLabel}>ACCURACY</Text>
          </View>
          <View style={styles.defeatStatDivider} />
          <View style={styles.defeatStatItem}>
            <Text style={styles.defeatStatValue}>{profile.rounds.length}</Text>
            <Text style={styles.defeatStatLabel}>ROUNDS</Text>
          </View>
        </View>
        
        {/* Insight */}
        {insights.length > 0 && (
          <View style={styles.defeatInsightBox}>
            <Text style={styles.defeatInsightText}>{insights[0]}</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.victoryButtons}>
        <Pressable style={styles.primaryBtn} onPress={() => { haptic.medium(); onRetry(); }}>
          <LinearGradient colors={[world.color, world.color + '80']} style={styles.btnGradient}>
            <Text style={styles.primaryBtnText}>TRY AGAIN</Text>
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={() => { haptic.light(); onBack(); }}>
          <Text style={styles.ghostBtnText}>BACK TO MAP</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [lastResult, setLastResult] = useState<{ streak: number; score: number; profile: PlayerBehaviorProfile }>({ 
    streak: 0, 
    score: 0,
    profile: createPlayerProfile()
  });

  const screenOpacity = useRef(new Animated.Value(1)).current;

  const transition = (to: Screen, callback?: () => void) => {
    Animated.timing(screenOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      callback?.();
      setScreen(to);
      Animated.timing(screenOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const handleSelectLevel = (id: number) => {
    setSelectedLevel(id);
    transition('puzzle');
  };

  const handleComplete = (success: boolean, streak: number, score: number, profile: PlayerBehaviorProfile) => {
    setLastResult({ streak, score, profile });
    if (success) {
      if (!completedLevels.includes(selectedLevel)) {
        setCompletedLevels([...completedLevels, selectedLevel]);
      }
      if (selectedLevel >= currentLevel) {
        setCurrentLevel(selectedLevel + 1);
      }
      transition('victory');
    } else {
      transition('defeat');
    }
  };

  const handleContinue = () => {
    const next = selectedLevel + 1;
    if (next <= LEVELS.length) {
      setSelectedLevel(next);
      transition('puzzle');
    } else {
      transition('galaxy');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.void} />
      <LinearGradient colors={[COLORS.void, COLORS.abyss, COLORS.cosmos]} style={styles.gradient}>
        <Animated.View style={[styles.screenWrapper, { opacity: screenOpacity }]}>
          {screen === 'home' && <HomeScreen onStart={() => transition('galaxy')} />}
          {screen === 'galaxy' && (
            <GalaxyMap
              onSelectLevel={handleSelectLevel}
              onBack={() => transition('home')}
              completedLevels={completedLevels}
              currentLevel={currentLevel}
            />
          )}
          {screen === 'puzzle' && (
            <PuzzleScreen
              key={selectedLevel}
              levelId={selectedLevel}
              onComplete={handleComplete}
              onBack={() => transition('galaxy')}
            />
          )}
          {screen === 'victory' && (
            <VictoryScreen
              levelId={selectedLevel}
              streak={lastResult.streak}
              score={lastResult.score}
              profile={lastResult.profile}
              onContinue={handleContinue}
              onReplay={() => transition('puzzle')}
            />
          )}
          {screen === 'defeat' && (
            <DefeatScreen
              levelId={selectedLevel}
              streak={lastResult.streak}
              profile={lastResult.profile}
              onRetry={() => transition('puzzle')}
              onBack={() => transition('galaxy')}
            />
          )}
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.void },
  gradient: { flex: 1 },
  screenWrapper: { flex: 1 },
  screen: { flex: 1, paddingTop: 60 },
  screenFlash: { ...StyleSheet.absoluteFillObject, zIndex: 100 },

  // Home
  homeContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerGlow: { position: 'absolute', top: H * 0.2, left: 0, right: 0, height: H * 0.4 },
  heroTitle: { fontSize: 72, fontWeight: '100', color: COLORS.textPrimary, letterSpacing: 25, textShadowColor: COLORS.violet, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 30 },
  heroSubtitle: { fontSize: 36, fontWeight: '200', color: COLORS.violet, letterSpacing: 20, marginTop: -10, textShadowColor: COLORS.violet, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  tapPrompt: { position: 'absolute', bottom: 100, alignItems: 'center' },
  tapText: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 8 },
  tapLine: { width: 40, height: 1, backgroundColor: COLORS.textMuted, marginTop: 12, opacity: 0.5 },

  // Galaxy
  galaxyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  galaxyTitle: { fontSize: 18, fontWeight: '300', color: COLORS.textPrimary, letterSpacing: 12 },
  backBtn: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 28, color: COLORS.textSecondary },
  
  worldOrbs: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 30, paddingHorizontal: 20 },
  worldOrb: { alignItems: 'center' },
  worldOrbSelected: {},
  worldOrbInner: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#333' },
  worldOrbGlow: { position: 'absolute', width: 100, height: 100, borderRadius: 50, opacity: 0.3 },
  worldOrbText: { fontSize: 10, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: 2 },
  lockEmoji: { fontSize: 16, marginTop: 4 },
  lockedText: { color: COLORS.textMuted },

  levelList: { paddingHorizontal: 20, gap: 12 },
  levelCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  levelCardCompleted: { borderColor: COLORS.cyan + '40' },
  levelCardLocked: { opacity: 0.5 },
  levelCardContent: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  levelNum: { fontSize: 32, fontWeight: '100', color: COLORS.textPrimary, width: 50 },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, letterSpacing: 3 },
  levelRule: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, letterSpacing: 1 },
  checkmark: { fontSize: 20, color: COLORS.emerald },
  lockSmall: { fontSize: 16 },

  // Puzzle
  puzzleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  levelBadge: { alignItems: 'center' },
  levelBadgeWorld: { fontSize: 10, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 4 },
  levelBadgeName: { fontSize: 18, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: 6 },
  streakContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  streakFire: { fontSize: 16, marginRight: 6 },
  streakNum: { fontSize: 18, fontWeight: '700', color: COLORS.gold },

  progressBar: { height: 4, backgroundColor: COLORS.surface, marginHorizontal: 20, borderRadius: 2, overflow: 'hidden', marginBottom: 20 },
  progressFill: { height: '100%', borderRadius: 2 },
  progressGlow: { position: 'absolute', right: 0, top: -2, bottom: -2, width: 20, backgroundColor: '#FFF', opacity: 0.3, borderRadius: 10 },

  ruleBox: { alignItems: 'center', marginBottom: 20 },
  ruleText: { fontSize: 13, color: COLORS.textSecondary, letterSpacing: 2 },
  ruleHighlight: { fontWeight: '800' },

  shapesArea: { flex: 1, position: 'relative' },
  shapeWrapper: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  glowOuter: { position: 'absolute' },
  glowMiddle: { position: 'absolute' },
  glowInner: { position: 'absolute' },
  shapeCore: { alignItems: 'center', justifyContent: 'center' },

  // Victory
  victoryGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: H * 0.5 },
  victoryScrollView: { flex: 1 },
  victoryScrollContent: { paddingBottom: 40 },
  victoryContent: { alignItems: 'center', paddingTop: 20 },
  victoryEmoji: { fontSize: 60, marginBottom: 10 },
  victoryTitle: { fontSize: 24, fontWeight: '100', color: COLORS.textPrimary, letterSpacing: 12 },
  victoryLevel: { fontSize: 18, fontWeight: '600', marginTop: 8, letterSpacing: 6 },
  victoryStats: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  victoryStat: { alignItems: 'center', paddingHorizontal: 20 },
  victoryStatValue: { fontSize: 28, fontWeight: '100', color: COLORS.textPrimary },
  victoryStatLabel: { fontSize: 8, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 3, marginTop: 4 },
  victoryDivider: { width: 1, height: 40, backgroundColor: COLORS.surface },
  victoryButtons: { paddingBottom: 40, paddingHorizontal: 40, gap: 16 },
  primaryBtn: { borderRadius: 30, overflow: 'hidden' },
  btnGradient: { paddingVertical: 18, alignItems: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: 6 },
  ghostBtn: { paddingVertical: 16, alignItems: 'center' },
  ghostBtnText: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted, letterSpacing: 4 },

  // Radar Chart
  radarWrapper: { marginVertical: 20, alignItems: 'center' },
  radarContainer: { width: RADAR_RADIUS * 2 + 80, height: RADAR_RADIUS * 2 + 80, alignItems: 'center', justifyContent: 'center' },
  radarRing: { position: 'absolute', borderWidth: 1 },
  radarAxis: { position: 'absolute', height: 1, backgroundColor: COLORS.textMuted + '20' },
  radarDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6 },
  radarLabel: { position: 'absolute', width: 60, alignItems: 'center' },
  radarLabelText: { fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  radarLabelValue: { fontSize: 12, fontWeight: '200', color: COLORS.textPrimary, marginTop: 2 },
  radarCenter: { width: 16, height: 16, borderRadius: 8, position: 'absolute' },

  // Score Breakdown
  scoreBreakdown: { alignItems: 'center', marginVertical: 15, paddingHorizontal: 30 },
  totalScoreLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 4 },
  totalScoreValue: { fontSize: 48, fontWeight: '100', color: COLORS.textPrimary, marginTop: 4 },
  breakdownItems: { marginTop: 15, width: '100%' },
  breakdownItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  breakdownDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  breakdownLabel: { flex: 1, fontSize: 11, color: COLORS.textSecondary, letterSpacing: 1 },
  breakdownValue: { fontSize: 13, fontWeight: '600', letterSpacing: 1 },

  // Insight Display
  insightContainer: { marginTop: 20, paddingHorizontal: 30, width: '100%' },
  insightBox: { backgroundColor: COLORS.surface + '80', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 3 },
  insightText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  insightCursor: { fontWeight: '700' },

  // Defeat
  defeatContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  defeatEmoji: { fontSize: 64, marginBottom: 20 },
  defeatTitle: { fontSize: 28, fontWeight: '200', color: COLORS.textSecondary, letterSpacing: 10 },
  defeatStats: { flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 25 },
  defeatStatItem: { alignItems: 'center', paddingHorizontal: 20 },
  defeatStatValue: { fontSize: 24, fontWeight: '200', color: COLORS.textPrimary },
  defeatStatLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2, marginTop: 4 },
  defeatStatDivider: { width: 1, height: 30, backgroundColor: COLORS.surface },
  defeatInsightBox: { backgroundColor: COLORS.surface + '60', borderRadius: 12, padding: 20, marginTop: 10, maxWidth: 300 },
  defeatInsightText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
});
