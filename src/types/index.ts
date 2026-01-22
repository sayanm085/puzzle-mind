// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 INTELLIGENT ADAPTIVE SYSTEM TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// Challenge types across 4 cognitive domains
export type ChallengeType = 
  // Visual Domain
  | 'matchColor' | 'matchShape' | 'brightestColor' | 'darkestColor' 
  | 'largestShape' | 'smallestShape' | 'colorGradient' | 'uniqueColor'
  // Spatial Domain
  | 'topMost' | 'bottomMost' | 'leftMost' | 'rightMost' 
  | 'centerMost' | 'mostIsolated' | 'mostCrowded' | 'diagonal'
  // Logical Domain
  | 'oddOneOut' | 'patternBreaker' | 'countBased' | 'exclusion' | 'majority'
  // Temporal Domain
  | 'firstAppeared' | 'lastAppeared' | 'flickering' | 'colorShift' | 'pulsing';

export type ShapeType = 'circle' | 'square' | 'diamond' | 'triangle' | 'hexagon' | 'star' | 'pentagon' | 'octagon';
export type Screen = 'home' | 'galaxy' | 'puzzle' | 'victory' | 'defeat';

// Skill vector for player profiling
export interface SkillVector {
  visual: number;
  spatial: number;
  logical: number;
  temporal: number;
}

// Difficulty vector - adaptive challenge parameters
export interface DifficultyVector {
  timePressure: number;       // Time multiplier
  shapeCount: number;         // 3-12 shapes
  challengeComplexity: number; // 0-1 complexity
  visualNoise: number;        // 0-1 visual distraction
  distractorCount: number;    // wrong answers that look right
}

// Individual round behavior tracking
export interface RoundBehavior {
  roundNumber: number;
  responseTime: number;
  wasCorrect: boolean;
  challengeType: ChallengeType;
  selectedPosition?: { x: number; y: number };
  correctPosition?: { x: number; y: number };
  shapeContext?: any;
  timestamp: number;
}

// Error pattern tracking for adaptive learning
export interface ErrorPattern {
  challengeType: ChallengeType;
  responseTime: number;
  timestamp: number;
  correctPosition?: { x: number; y: number };
  selectedPosition?: { x: number; y: number };
  shapeContext?: any;
}

// Complete player behavior profile
export interface PlayerBehaviorProfile {
  averageResponseTime: number;
  responseTimeVariance: number;
  recentResponseTime: number;
  accuracy: number;
  recentAccuracy: number;
  challengeAccuracy?: Record<string, number>;
  skillVector: SkillVector;
  positionBias?: { corner: number; edge: number; center: number };
  errorPatterns: ErrorPattern[];
  totalRounds: number;
  currentStreak: number;
  longestStreak: number;
  sessionDuration: number;
  preferredChallenges: ChallengeType[];
  struggleChallenges: ChallengeType[];
}

// Performance vector for radar chart
export interface PerformanceVector {
  speed: number;
  accuracy: number;
  consistency: number;
  spatial: number;
  pattern: number;
  pressure: number;
}

// Scoring configuration
export interface ScoringConfig {
  basePoints: number;
  streakMultiplierMax: number;
  streakMultiplierIncrement: number;
  speedBonusMax: number;
  accuracyBonusMax: number;
  difficultyMultiplierRange: [number, number];
  comboThreshold: number;
  perfectRoundBonus: number;
}

// Insight rule for post-match analysis
export interface InsightRule {
  id: string;
  condition: (profile: PlayerBehaviorProfile) => boolean;
  message: string;
  icon: string;
  category: 'tempo' | 'precision' | 'mastery' | 'pattern' | 'flow' | 'milestone';
}

// Challenge definition with metadata
export interface ChallengeDefinition {
  type: ChallengeType;
  domain: 'visual' | 'spatial' | 'logical' | 'temporal';
  baseWeight: number;
  description: string;
  unlockLevel: number;
  complexity: number;
}

// Glow color type
export interface GlowColor {
  hex: string;
  name: string;
}

// Shape interface
export interface Shape {
  id: number;
  type: ShapeType;
  color: GlowColor;
  size: number;
  x: number;
  y: number;
  glowIntensity: number;
  rotation: number;
  appearanceOrder?: number;
  isMoving?: boolean;
  isRotating?: boolean;
  isPulsing?: boolean;
  isFlickering?: boolean;
}

// Level interface
export interface Level {
  id: number;
  name: string;
  baseChallenge: ChallengeType;
  shapeCount: number;
  requiredStreak: number;
  world: number;
  unlocked: boolean;
  availableChallenges: ChallengeType[];
  specialModifier?: 'moving' | 'rotating' | 'pulsing' | 'chaos' | 'zen' | 'blitz';
  timeLimit?: number;
  bonusObjective?: string;
}

// World interface
export interface World {
  id: number;
  name: string;
  color: string;
  description: string;
  icon: string;
  unlockRequirement: number;
  backgroundEffect?: 'nebula' | 'stars' | 'void' | 'aurora' | 'matrix';
}

// Particle interface
export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  color: string;
}

// Achievement interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (profile: PlayerBehaviorProfile) => boolean;
  unlocked: boolean;
}

// Power-up interface (for future use)
export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number;
  effect: 'slowTime' | 'highlight' | 'shield' | 'doublePoints';
}

// Game state for context
export interface GameState {
  currentLevel: number;
  completedLevels: number[];
  totalScore: number;
  highestStreak: number;
  totalPlayTime: number;
  achievements: string[];
}
