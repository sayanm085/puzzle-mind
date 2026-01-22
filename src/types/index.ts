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

// Difficulty vector - 8 dimensions of challenge
export interface DifficultyVector {
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
export interface RoundBehavior {
  roundNumber: number;
  reactionTimeMs: number;
  hesitationCount: number;
  selectedCorrect: boolean;
  challengeType: ChallengeType;
  difficultyVector: DifficultyVector;
  timestamp: number;
  clutchSave: boolean;
}

// Error pattern tracking for adaptive learning
export interface ErrorPattern {
  challengeType: ChallengeType;
  errorCount: number;
  lastOccurred: number;
  domain: 'visual' | 'spatial' | 'logical' | 'temporal';
}

// Complete player behavior profile
export interface PlayerBehaviorProfile {
  sessionId: string;
  sessionStartTime: number;
  rounds: RoundBehavior[];
  errorPatterns: ErrorPattern[];
  averageReactionTime: number;
  consistencyScore: number;
  confidenceIndicator: number;
  streakHistory: number[];
  peakPerformanceRound: number;
  fatigueIndicator: number;
  totalHesitations: number;
  clutchSuccesses: number;
  perfectRounds: number;
  comboMultiplier: number;
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
  speedMultiplier: number;
  difficultyMultiplier: number;
  challengeTypeWeight: number;
  consistencyBonus: number;
  streakMultiplier: number;
  clutchBonus: number;
  perfectBonus: number;
  comboBonus: number;
}

// Insight rule for post-match analysis
export interface InsightRule {
  id: string;
  condition: (profile: PlayerBehaviorProfile) => boolean;
  insight: string;
  category: 'performance' | 'behavioral' | 'skill' | 'milestone';
  priority: number;
  emoji?: string;
}

// Challenge definition with metadata
export interface ChallengeDefinition {
  type: ChallengeType;
  domain: 'visual' | 'spatial' | 'logical' | 'temporal';
  baseWeight: number;
  description: string;
  unlockLevel: number;
}

// Glow color type
export interface GlowColor {
  main: string;
  glow: string;
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
  brightness: number;
  rotation: number;
  appearTime?: number;
  isFlickering?: boolean;
  isShifting?: boolean;
  isPulsing?: boolean;
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
