import { Level, World, ChallengeType } from '../types';
import { COLORS } from './colors';

// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 WORLDS (10 Unique Worlds)
// ═══════════════════════════════════════════════════════════════════════════════
export const WORLDS: World[] = [
  { id: 1, name: 'GENESIS', color: COLORS.violet, description: 'Where it all begins', icon: '🌟', unlockRequirement: 0, backgroundEffect: 'nebula' },
  { id: 2, name: 'PULSE', color: COLORS.cyan, description: 'Feel the rhythm', icon: '💫', unlockRequirement: 5, backgroundEffect: 'stars' },
  { id: 3, name: 'EMBER', color: COLORS.gold, description: 'Burning bright', icon: '🔥', unlockRequirement: 10, backgroundEffect: 'aurora' },
  { id: 4, name: 'BLOOM', color: COLORS.rose, description: 'Beauty in chaos', icon: '🌸', unlockRequirement: 15, backgroundEffect: 'nebula' },
  { id: 5, name: 'MATRIX', color: COLORS.emerald, description: 'Beyond the code', icon: '💎', unlockRequirement: 20, backgroundEffect: 'matrix' },
  { id: 6, name: 'INFERNO', color: COLORS.orange, description: 'Trial by fire', icon: '⚡', unlockRequirement: 25, backgroundEffect: 'aurora' },
  { id: 7, name: 'ABYSS', color: COLORS.blue, description: 'The deep unknown', icon: '🌊', unlockRequirement: 30, backgroundEffect: 'void' },
  { id: 8, name: 'NOVA', color: COLORS.lime, description: 'Explosive energy', icon: '☄️', unlockRequirement: 35, backgroundEffect: 'stars' },
  { id: 9, name: 'PHANTOM', color: COLORS.magenta, description: 'Now you see it', icon: '👁️', unlockRequirement: 40, backgroundEffect: 'nebula' },
  { id: 10, name: 'OMEGA', color: COLORS.gold, description: 'The ultimate test', icon: '♾️', unlockRequirement: 45, backgroundEffect: 'void' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 50 LEVELS - Progressive Difficulty
// ═══════════════════════════════════════════════════════════════════════════════
export const LEVELS: Level[] = [
  // WORLD 1: GENESIS (Levels 1-5) - Tutorial Zone
  { id: 1, name: 'DAWN', baseChallenge: 'largestShape', shapeCount: 3, requiredStreak: 2, world: 1, unlocked: true,
    availableChallenges: ['largestShape'], bonusObjective: 'Complete in under 10s' },
  { id: 2, name: 'SPARK', baseChallenge: 'smallestShape', shapeCount: 3, requiredStreak: 2, world: 1, unlocked: true,
    availableChallenges: ['smallestShape', 'largestShape'] },
  { id: 3, name: 'GLOW', baseChallenge: 'brightestColor', shapeCount: 3, requiredStreak: 3, world: 1, unlocked: true,
    availableChallenges: ['brightestColor', 'largestShape', 'smallestShape'] },
  { id: 4, name: 'ECHO', baseChallenge: 'leftMost', shapeCount: 4, requiredStreak: 3, world: 1, unlocked: true,
    availableChallenges: ['leftMost', 'rightMost', 'largestShape'] },
  { id: 5, name: 'RISE', baseChallenge: 'darkestColor', shapeCount: 4, requiredStreak: 3, world: 1, unlocked: true,
    availableChallenges: ['darkestColor', 'brightestColor', 'leftMost', 'rightMost'], bonusObjective: 'Perfect streak!' },

  // WORLD 2: PULSE (Levels 6-10) - Speed Introduction
  { id: 6, name: 'DRIFT', baseChallenge: 'topMost', shapeCount: 4, requiredStreak: 3, world: 2, unlocked: false,
    availableChallenges: ['topMost', 'bottomMost', 'largestShape', 'smallestShape'] },
  { id: 7, name: 'WAVE', baseChallenge: 'bottomMost', shapeCount: 4, requiredStreak: 4, world: 2, unlocked: false,
    availableChallenges: ['bottomMost', 'topMost', 'brightestColor', 'darkestColor'] },
  { id: 8, name: 'FLUX', baseChallenge: 'uniqueColor', shapeCount: 5, requiredStreak: 4, world: 2, unlocked: false,
    availableChallenges: ['uniqueColor', 'largestShape', 'smallestShape', 'leftMost'] },
  { id: 9, name: 'SYNC', baseChallenge: 'rightMost', shapeCount: 5, requiredStreak: 4, world: 2, unlocked: false,
    availableChallenges: ['rightMost', 'leftMost', 'topMost', 'bottomMost'], specialModifier: 'blitz', timeLimit: 8 },
  { id: 10, name: 'BEAT', baseChallenge: 'centerMost', shapeCount: 5, requiredStreak: 4, world: 2, unlocked: false,
    availableChallenges: ['centerMost', 'largestShape', 'brightestColor'], bonusObjective: '100% accuracy' },

  // WORLD 3: EMBER (Levels 11-15) - Challenge Ramp
  { id: 11, name: 'BLAZE', baseChallenge: 'largestShape', shapeCount: 5, requiredStreak: 4, world: 3, unlocked: false,
    availableChallenges: ['largestShape', 'smallestShape', 'centerMost', 'uniqueColor'] },
  { id: 12, name: 'SCORCH', baseChallenge: 'oddOneOut', shapeCount: 5, requiredStreak: 4, world: 3, unlocked: false,
    availableChallenges: ['oddOneOut', 'brightestColor', 'darkestColor'] },
  { id: 13, name: 'KINDLE', baseChallenge: 'brightestColor', shapeCount: 6, requiredStreak: 4, world: 3, unlocked: false,
    availableChallenges: ['brightestColor', 'darkestColor', 'largestShape', 'smallestShape'], specialModifier: 'pulsing' },
  { id: 14, name: 'IGNITE', baseChallenge: 'countBased', shapeCount: 6, requiredStreak: 5, world: 3, unlocked: false,
    availableChallenges: ['countBased', 'largestShape', 'smallestShape', 'topMost'] },
  { id: 15, name: 'FURY', baseChallenge: 'colorGradient', shapeCount: 6, requiredStreak: 5, world: 3, unlocked: false,
    availableChallenges: ['colorGradient', 'oddOneOut', 'uniqueColor'], bonusObjective: 'No hesitation' },

  // WORLD 4: BLOOM (Levels 16-20) - Beauty & Complexity
  { id: 16, name: 'PETAL', baseChallenge: 'smallestShape', shapeCount: 6, requiredStreak: 5, world: 4, unlocked: false,
    availableChallenges: ['smallestShape', 'centerMost', 'uniqueColor', 'oddOneOut'] },
  { id: 17, name: 'NECTAR', baseChallenge: 'mostIsolated', shapeCount: 6, requiredStreak: 5, world: 4, unlocked: false,
    availableChallenges: ['mostIsolated', 'largestShape', 'brightestColor'] },
  { id: 18, name: 'THORN', baseChallenge: 'darkestColor', shapeCount: 7, requiredStreak: 5, world: 4, unlocked: false,
    availableChallenges: ['darkestColor', 'mostIsolated', 'countBased'], specialModifier: 'rotating' },
  { id: 19, name: 'BLOSSOM', baseChallenge: 'centerMost', shapeCount: 7, requiredStreak: 5, world: 4, unlocked: false,
    availableChallenges: ['centerMost', 'mostIsolated', 'oddOneOut', 'colorGradient'] },
  { id: 20, name: 'GARDEN', baseChallenge: 'mostCrowded', shapeCount: 7, requiredStreak: 5, world: 4, unlocked: false,
    availableChallenges: ['mostCrowded', 'mostIsolated', 'uniqueColor'], bonusObjective: 'Speed demon - under 5s avg' },

  // WORLD 5: MATRIX (Levels 21-25) - Logic Zone
  { id: 21, name: 'CODE', baseChallenge: 'oddOneOut', shapeCount: 7, requiredStreak: 5, world: 5, unlocked: false,
    availableChallenges: ['oddOneOut', 'countBased', 'mostCrowded', 'mostIsolated'] },
  { id: 22, name: 'BINARY', baseChallenge: 'patternBreaker', shapeCount: 7, requiredStreak: 5, world: 5, unlocked: false,
    availableChallenges: ['patternBreaker', 'oddOneOut', 'colorGradient'] },
  { id: 23, name: 'GLITCH', baseChallenge: 'countBased', shapeCount: 8, requiredStreak: 5, world: 5, unlocked: false,
    availableChallenges: ['countBased', 'patternBreaker', 'centerMost'], specialModifier: 'chaos' },
  { id: 24, name: 'HACK', baseChallenge: 'uniqueColor', shapeCount: 8, requiredStreak: 6, world: 5, unlocked: false,
    availableChallenges: ['uniqueColor', 'oddOneOut', 'mostCrowded', 'mostIsolated'] },
  { id: 25, name: 'DECRYPT', baseChallenge: 'diagonal', shapeCount: 8, requiredStreak: 6, world: 5, unlocked: false,
    availableChallenges: ['diagonal', 'patternBreaker', 'countBased'], bonusObjective: 'Flawless victory' },

  // WORLD 6: INFERNO (Levels 26-30) - Intensity
  { id: 26, name: 'SPARK', baseChallenge: 'brightestColor', shapeCount: 8, requiredStreak: 6, world: 6, unlocked: false,
    availableChallenges: ['brightestColor', 'darkestColor', 'diagonal', 'mostIsolated'], specialModifier: 'blitz', timeLimit: 6 },
  { id: 27, name: 'FLAME', baseChallenge: 'mostCrowded', shapeCount: 8, requiredStreak: 6, world: 6, unlocked: false,
    availableChallenges: ['mostCrowded', 'mostIsolated', 'patternBreaker'] },
  { id: 28, name: 'BURN', baseChallenge: 'exclusion', shapeCount: 8, requiredStreak: 6, world: 6, unlocked: false,
    availableChallenges: ['exclusion', 'oddOneOut', 'diagonal', 'countBased'] },
  { id: 29, name: 'CHAR', baseChallenge: 'colorGradient', shapeCount: 9, requiredStreak: 6, world: 6, unlocked: false,
    availableChallenges: ['colorGradient', 'exclusion', 'patternBreaker'], specialModifier: 'moving' },
  { id: 30, name: 'ASH', baseChallenge: 'majority', shapeCount: 9, requiredStreak: 6, world: 6, unlocked: false,
    availableChallenges: ['majority', 'exclusion', 'oddOneOut', 'countBased'], bonusObjective: 'Survive the fire' },

  // WORLD 7: ABYSS (Levels 31-35) - Depths
  { id: 31, name: 'SINK', baseChallenge: 'bottomMost', shapeCount: 9, requiredStreak: 6, world: 7, unlocked: false,
    availableChallenges: ['bottomMost', 'mostIsolated', 'majority', 'exclusion'] },
  { id: 32, name: 'DEPTH', baseChallenge: 'darkestColor', shapeCount: 9, requiredStreak: 6, world: 7, unlocked: false,
    availableChallenges: ['darkestColor', 'smallestShape', 'diagonal'], specialModifier: 'zen' },
  { id: 33, name: 'CRUSH', baseChallenge: 'mostCrowded', shapeCount: 9, requiredStreak: 7, world: 7, unlocked: false,
    availableChallenges: ['mostCrowded', 'majority', 'patternBreaker', 'exclusion'] },
  { id: 34, name: 'VOID', baseChallenge: 'mostIsolated', shapeCount: 10, requiredStreak: 7, world: 7, unlocked: false,
    availableChallenges: ['mostIsolated', 'diagonal', 'colorGradient'] },
  { id: 35, name: 'TRENCH', baseChallenge: 'firstAppeared', shapeCount: 10, requiredStreak: 7, world: 7, unlocked: false,
    availableChallenges: ['firstAppeared', 'lastAppeared', 'majority'], bonusObjective: 'Memory master' },

  // WORLD 8: NOVA (Levels 36-40) - Explosive
  { id: 36, name: 'BURST', baseChallenge: 'largestShape', shapeCount: 10, requiredStreak: 7, world: 8, unlocked: false,
    availableChallenges: ['largestShape', 'firstAppeared', 'lastAppeared', 'majority'], specialModifier: 'pulsing' },
  { id: 37, name: 'DETONATE', baseChallenge: 'brightestColor', shapeCount: 10, requiredStreak: 7, world: 8, unlocked: false,
    availableChallenges: ['brightestColor', 'colorGradient', 'exclusion'] },
  { id: 38, name: 'EXPLODE', baseChallenge: 'oddOneOut', shapeCount: 10, requiredStreak: 7, world: 8, unlocked: false,
    availableChallenges: ['oddOneOut', 'patternBreaker', 'firstAppeared'], specialModifier: 'chaos' },
  { id: 39, name: 'SHATTER', baseChallenge: 'diagonal', shapeCount: 11, requiredStreak: 7, world: 8, unlocked: false,
    availableChallenges: ['diagonal', 'mostIsolated', 'lastAppeared', 'majority'] },
  { id: 40, name: 'IMPLODE', baseChallenge: 'flickering', shapeCount: 11, requiredStreak: 7, world: 8, unlocked: false,
    availableChallenges: ['flickering', 'firstAppeared', 'lastAppeared'], bonusObjective: 'Eyes like a hawk' },

  // WORLD 9: PHANTOM (Levels 41-45) - Illusion
  { id: 41, name: 'GHOST', baseChallenge: 'flickering', shapeCount: 11, requiredStreak: 8, world: 9, unlocked: false,
    availableChallenges: ['flickering', 'pulsing', 'colorGradient', 'mostIsolated'] },
  { id: 42, name: 'SHADOW', baseChallenge: 'pulsing', shapeCount: 11, requiredStreak: 8, world: 9, unlocked: false,
    availableChallenges: ['pulsing', 'flickering', 'darkestColor'] },
  { id: 43, name: 'MIRAGE', baseChallenge: 'colorShift', shapeCount: 11, requiredStreak: 8, world: 9, unlocked: false,
    availableChallenges: ['colorShift', 'flickering', 'pulsing'], specialModifier: 'moving' },
  { id: 44, name: 'ILLUSION', baseChallenge: 'patternBreaker', shapeCount: 12, requiredStreak: 8, world: 9, unlocked: false,
    availableChallenges: ['patternBreaker', 'colorShift', 'pulsing', 'oddOneOut'] },
  { id: 45, name: 'VANISH', baseChallenge: 'colorShift', shapeCount: 12, requiredStreak: 8, world: 9, unlocked: false,
    availableChallenges: ['colorShift', 'flickering', 'pulsing', 'firstAppeared'], bonusObjective: 'Trust nothing' },

  // WORLD 10: OMEGA (Levels 46-50) - Ultimate Challenge
  { id: 46, name: 'ALPHA', baseChallenge: 'majority', shapeCount: 12, requiredStreak: 8, world: 10, unlocked: false,
    availableChallenges: ['majority', 'exclusion', 'colorShift', 'flickering'], specialModifier: 'blitz', timeLimit: 5 },
  { id: 47, name: 'APEX', baseChallenge: 'patternBreaker', shapeCount: 12, requiredStreak: 9, world: 10, unlocked: false,
    availableChallenges: ['patternBreaker', 'colorGradient', 'pulsing', 'diagonal'] },
  { id: 48, name: 'ZENITH', baseChallenge: 'exclusion', shapeCount: 12, requiredStreak: 9, world: 10, unlocked: false,
    availableChallenges: ['exclusion', 'majority', 'flickering', 'colorShift'], specialModifier: 'chaos' },
  { id: 49, name: 'PINNACLE', baseChallenge: 'colorShift', shapeCount: 12, requiredStreak: 9, world: 10, unlocked: false,
    availableChallenges: ['colorShift', 'pulsing', 'flickering', 'patternBreaker', 'diagonal'], specialModifier: 'moving' },
  { id: 50, name: 'INFINITY', baseChallenge: 'flickering', shapeCount: 12, requiredStreak: 10, world: 10, unlocked: false,
    availableChallenges: ['flickering', 'pulsing', 'colorShift', 'exclusion', 'patternBreaker', 'majority'], 
    specialModifier: 'chaos', bonusObjective: 'BECOME LEGEND', timeLimit: 4 },
];

// Get levels for a specific world
export function getLevelsByWorld(worldId: number): Level[] {
  return LEVELS.filter(l => l.world === worldId);
}

// Get world by ID
export function getWorldById(worldId: number): World | undefined {
  return WORLDS.find(w => w.id === worldId);
}

// Check if world is unlocked
export function isWorldUnlocked(worldId: number, completedLevels: number[]): boolean {
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return false;
  return completedLevels.length >= world.unlockRequirement;
}
