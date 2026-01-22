// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 COGNITIVE UNIVERSE - NEXT GENERATION TYPE ARCHITECTURE
// Built by century-experience elite studio standards
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// CORE ENUMERATIONS & PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────────

export type Screen = 
  | 'void'           // Initial state - pure black, breathing
  | 'awakening'      // First-time player experience
  | 'nexus'          // Main hub - dimensional space
  | 'cosmos'         // Galaxy map - universal overview
  | 'sector'         // Zoomed sector view
  | 'chamber'        // Pre-puzzle mental preparation
  | 'trial'          // Active puzzle gameplay
  | 'reflection'     // Post-trial analysis
  | 'transcendence'  // Major milestone reached
  | 'dormant'        // Session end - mind at rest
  // Legacy screens
  | 'home' | 'galaxy' | 'puzzle' | 'victory' | 'defeat';

export type ChallengeType = 
  // PERCEPTION DOMAIN - Raw sensory processing
  | 'chromatic_isolation'    // Find specific color amid noise
  | 'luminance_peak'         // Identify brightest element
  | 'shadow_depth'           // Find darkest/most recessed
  | 'scale_anomaly'          // Largest/smallest detection
  | 'form_recognition'       // Shape identification
  | 'texture_variance'       // Surface pattern detection
  | 'opacity_gradient'       // Transparency ordering
  | 'saturation_extreme'     // Most/least vivid
  
  // SPATIAL DOMAIN - Dimensional reasoning
  | 'cardinal_extreme'       // Furthest in direction
  | 'centroid_proximity'     // Closest to center
  | 'isolation_index'        // Most separated element
  | 'cluster_density'        // Most crowded region
  | 'diagonal_alignment'     // Corner relationships
  | 'depth_ordering'         // Z-axis positioning
  | 'symmetry_axis'          // Mirror plane detection
  | 'boundary_distance'      // Edge proximity
  
  // LOGIC DOMAIN - Abstract reasoning
  | 'pattern_breach'         // Find rule violation
  | 'sequence_prediction'    // Next in series
  | 'set_exclusion'          // Doesn't belong
  | 'majority_rule'          // Most common attribute
  | 'inverse_logic'          // Opposite of instruction
  | 'conditional_chain'      // If-then-else reasoning
  | 'probability_weight'     // Most likely outcome
  | 'category_bridge'        // Connect disparate sets
  
  // TEMPORAL DOMAIN - Time-based cognition
  | 'emergence_order'        // Appearance sequence
  | 'duration_estimate'      // Time perception
  | 'rhythm_sync'            // Beat matching
  | 'velocity_comparison'    // Speed differentiation
  | 'phase_alignment'        // Cycle synchronization
  | 'decay_prediction'       // Fading element
  | 'pulse_frequency'        // Oscillation rate
  | 'temporal_memory'        // Remember past state
  
  // LEGACY CHALLENGE TYPES
  | 'matchColor' | 'matchShape' | 'brightestColor' | 'darkestColor' 
  | 'largestShape' | 'smallestShape' | 'colorGradient' | 'uniqueColor'
  | 'topMost' | 'bottomMost' | 'leftMost' | 'rightMost' 
  | 'centerMost' | 'mostIsolated' | 'mostCrowded' | 'diagonal'
  | 'oddOneOut' | 'patternBreaker' | 'countBased' | 'exclusion' | 'majority'
  | 'firstAppeared' | 'lastAppeared' | 'flickering' | 'colorShift' | 'pulsing';

export type ShapeType = 
  | 'sphere' | 'cube' | 'tetrahedron' | 'octahedron' 
  | 'torus' | 'cylinder' | 'cone' | 'icosahedron'
  | 'prism' | 'pyramid' | 'helix' | 'mobius'
  // Legacy shape types
  | 'circle' | 'square' | 'diamond' | 'triangle' | 'hexagon' | 'star' | 'pentagon' | 'octagon';

export type CognitiveDomain = 'perception' | 'spatial' | 'logic' | 'temporal' | 'visual' | 'logical';

export type EventType = 
  | 'daily_trial'        // Refreshes every 24h
  | 'weekly_expedition'  // Week-long challenge chain
  | 'mind_storm'         // Time-limited chaos event
  | 'anomaly_breach'     // Rare spawning event
  | 'legendary_echo'     // Hidden legendary challenge
  | 'cosmic_alignment'   // Special calendar events
  | 'neural_cascade'     // Streak-based unlocks
  | 'void_whisper';      // Random mysterious events

export type MissionState = 'locked' | 'available' | 'active' | 'completed' | 'mastered' | 'transcended';

export type PlayerMood = 'focused' | 'fatigued' | 'frustrated' | 'flowing' | 'curious' | 'determined';

// ─────────────────────────────────────────────────────────────────────────────────
// VISUAL ENGINE TYPES - Pseudo-3D Rendering System
// ─────────────────────────────────────────────────────────────────────────────────

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface LightSource {
  id: string;
  position: Vector3D;
  intensity: number;        // 0-1
  color: string;
  radius: number;
  type: 'key' | 'rim' | 'fill' | 'ambient';
  castsShadow: boolean;
  falloff: 'linear' | 'quadratic' | 'none';
}

export interface ShadowConfig {
  enabled: boolean;
  offset: { x: number; y: number };
  blur: number;
  opacity: number;
  color: string;
  elevation: number;        // Pseudo-Z height
}

export interface DepthConfig {
  nearPlane: number;
  farPlane: number;
  focalDistance: number;
  aperture: number;         // Blur intensity
  bokehSize: number;
}

export interface ParallaxLayer {
  id: string;
  depth: number;            // 0 = foreground, 1 = background
  content: 'particles' | 'shapes' | 'nebula' | 'grid' | 'void';
  opacity: number;
  blurAmount: number;
  scale: number;
  velocity: Vector3D;
}

export interface CameraState {
  position: Vector3D;
  target: Vector3D;
  fov: number;
  shake: { intensity: number; decay: number };
  zoom: number;
  rotation: number;
  inertia: { velocity: Vector3D; friction: number };
}

export interface VolumetricEffect {
  type: 'glow' | 'fog' | 'rays' | 'dust' | 'energy';
  color: string;
  intensity: number;
  density: number;
  animated: boolean;
  frequency: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ANIMATION PHILOSOPHY TYPES - Cinematic Motion System
// ─────────────────────────────────────────────────────────────────────────────────

export interface PhysicsProperties {
  mass: number;
  friction: number;
  bounciness: number;
  drag: number;
  angularDrag: number;
}

export interface MotionCurve {
  type: 'cubic-bezier' | 'spring' | 'decay' | 'keyframe';
  bezier?: [number, number, number, number];
  spring?: { tension: number; friction: number; mass: number };
  decay?: { velocity: number; deceleration: number };
  keyframes?: { time: number; value: number; easing: string }[];
}

export interface IdleAnimation {
  type: 'breathe' | 'hover' | 'pulse' | 'drift' | 'shimmer' | 'rotate';
  amplitude: number;
  frequency: number;
  phase: number;
  axis?: 'x' | 'y' | 'z' | 'scale' | 'rotation' | 'opacity';
}

export interface TransitionConfig {
  duration: number;
  delay: number;
  curve: MotionCurve;
  stagger?: number;
  direction?: 'forward' | 'reverse' | 'both';
}

export interface CinematicSequence {
  id: string;
  steps: {
    target: string;
    property: string;
    from: number;
    to: number;
    duration: number;
    delay: number;
    curve: MotionCurve;
  }[];
  loop: boolean;
  autoReverse: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COGNITIVE INTELLIGENCE ENGINE - Player Mind Model
// ─────────────────────────────────────────────────────────────────────────────────

export interface CognitiveVector {
  perception: number;
  spatial: number;
  logic: number;
  temporal: number;
  working_memory: number;
  pattern_recognition: number;
  inhibition: number;
  flexibility: number;
}

export interface ReactionProfile {
  mean: number;
  median: number;
  variance: number;
  percentile_25: number;
  percentile_75: number;
  trend: 'improving' | 'stable' | 'declining' | 'volatile';
  fatigueSignal: number;
}

export interface RiskProfile {
  riskTolerance: number;
  speedAccuracyTradeoff: number;
  hesitationFrequency: number;
  changeOfMindRate: number;
  pressureResponse: 'thrives' | 'neutral' | 'struggles';
}

export interface LearningCurve {
  challengeType: ChallengeType;
  exposures: number;
  initialAccuracy: number;
  currentAccuracy: number;
  plateauLevel: number;
  improvementRate: number;
  lastExposure: number;
}

export interface FatigueModel {
  sessionDuration: number;
  roundsPlayed: number;
  responseTimeDeviation: number;
  accuracyDecline: number;
  microPauseFrequency: number;
  estimatedFatigue: number;
  recommendedBreak: boolean;
  optimalSessionLength: number;
}

export interface BehaviorSignature {
  preferredScreenRegion: { x: number; y: number; radius: number };
  scanPattern: 'systematic' | 'random' | 'center-out' | 'edge-first';
  peakPerformanceTime: number;
  warmupRounds: number;
  cooldownSignal: number;
  confidenceThreshold: number;
  revisionRate: number;
  intuitionVsAnalysis: number;
}

export interface PlayerMindModel {
  id: string;
  createdAt: number;
  lastUpdated: number;
  cognitiveVector: CognitiveVector;
  reactionProfile: ReactionProfile;
  riskProfile: RiskProfile;
  learningCurves: Map<ChallengeType, LearningCurve>;
  fatigueModel: FatigueModel;
  currentMood: PlayerMood;
  behaviorSignature: BehaviorSignature;
  totalSessions: number;
  totalTrials: number;
  lifetimeAccuracy: number;
  evolutionStage: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ADAPTIVE DIFFICULTY - Invisible Challenge Mutation
// ─────────────────────────────────────────────────────────────────────────────────

export interface DifficultyGenome {
  timeAllocation: number;
  shapePopulation: number;
  distractorRatio: number;
  colorSimilarity: number;
  sizeDifferentiation: number;
  spatialDensity: number;
  ruleComplexity: number;
  memoryLoad: number;
  attentionSplits: number;
  decayRate: number;
  rhythmComplexity: number;
  ambiguityLevel: number;
  trapDensity: number;
}

export interface AdaptationSignal {
  metric: keyof DifficultyGenome;
  direction: 'increase' | 'decrease';
  magnitude: number;
  confidence: number;
  reason: string;
}

export interface DifficultyState {
  currentGenome: DifficultyGenome;
  targetSuccessRate: number;
  recentSuccessRate: number;
  adaptationHistory: AdaptationSignal[];
  stabilityIndex: number;
  playerComfort: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// UNIVERSE STRUCTURE - Galaxy-Scale World Architecture
// ─────────────────────────────────────────────────────────────────────────────────

export interface CosmicCoordinate {
  sector: number;
  cluster: number;
  node: number;
  depth: number;
}

export interface Sector {
  id: string;
  name: string;
  subtitle: string;
  coordinate: CosmicCoordinate;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  // Convenience aliases for UI components
  color: string; // Alias for primaryColor
  icon: string;  // Sector icon emoji
  backgroundEffect: 'nebula' | 'void' | 'aurora' | 'storm' | 'crystals' | 'organic';
  ambientSound: string;
  chambers: Chamber[];
  totalChambers: number;
  completedChambers: number;
  state: 'undiscovered' | 'glimpsed' | 'accessible' | 'explored' | 'mastered' | 'transcended';
  unlockCondition: UnlockCondition;
  mythicTitle: string;
  description: string;
  discoveryDialogue: string;
}

export interface Chamber {
  id: string;
  sectorId: string;
  index: number;
  name: string;
  essence: string;
  primaryDomain: CognitiveDomain;
  challengePool: ChallengeType[];
  trialCount: number;
  difficulty: number; // 1-5 difficulty rating for UI
  baseGenome: DifficultyGenome;
  modifier?: ChamberModifier;
  state: MissionState;
  bestPerformance?: PerformanceRecord;
  attempts: number;
  evolutionReward: number;
  unlocks?: string[];
}

export interface ChamberModifier {
  type: 'temporal_flux' | 'spatial_warp' | 'sensory_overload' | 'zen_focus' | 
        'chaos_entropy' | 'mirror_realm' | 'shadow_play' | 'velocity_storm';
  intensity: number;
  description: string;
  icon: string;
  visualEffect: string;
}

export interface UnlockCondition {
  type: 'evolution' | 'chambers' | 'mastery' | 'streak' | 'event' | 'secret';
  requirement: number | string;
  current: number;
  description: string;
}

export interface Anomaly {
  id: string;
  coordinate: CosmicCoordinate;
  type: 'rift' | 'echo' | 'nexus' | 'void_pocket' | 'time_eddy';
  state: 'dormant' | 'active' | 'closing' | 'depleted';
  appearedAt: number;
  expiresAt?: number;
  challenge: LegendaryChallenge;
  pulseColor: string;
  intensity: number;
}

export interface LegendaryChallenge {
  id: string;
  title: string;
  epithet: string;
  genome: DifficultyGenome;
  domains: CognitiveDomain[];
  trialCount: number;
  minimumEvolution: number;
  titleReward?: string;
  cosmeticReward?: string;
  evolutionBonus: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// MISSION & EVENT SYSTEM - Living World Events
// ─────────────────────────────────────────────────────────────────────────────────

export interface DailyTrial {
  id: string;
  date: string;
  theme: string;
  domains: CognitiveDomain[];
  trialCount: number;
  genome: DifficultyGenome;
  completed: boolean;
  performance?: PerformanceRecord;
  evolutionReward: number;
  streakBonus: number;
}

export interface WeeklyExpedition {
  id: string;
  weekStart: string;
  name: string;
  chapters: {
    day: number;
    challenge: ChallengeType;
    completed: boolean;
  }[];
  currentChapter: number;
  totalCompleted: number;
  chapterRewards: number[];
  completionReward: number;
}

export interface MindStorm {
  id: string;
  startTime: number;
  endTime: number;
  name: string;
  description: string;
  modifier: ChamberModifier;
  multiplier: number;
  personalBest: number;
  ambientColor: string;
  particleEffect: string;
}

export interface CosmicEvent {
  id: string;
  type: EventType;
  startTime: number;
  endTime?: number;
  content: DailyTrial | WeeklyExpedition | MindStorm | Anomaly;
  acknowledged: boolean;
  participated: boolean;
  completed: boolean;
  title: string;
  teaser: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

// ─────────────────────────────────────────────────────────────────────────────────
// SCORING & PROGRESSION - Beyond Numbers
// ─────────────────────────────────────────────────────────────────────────────────

export interface TrialRecord {
  timestamp: number;
  challengeType: ChallengeType;
  correct: boolean;
  responseTime: number;
  genome: DifficultyGenome;
  position?: { x: number; y: number };
}

export interface PerformanceRecord {
  chamberId: string;
  completedAt: number;
  accuracy: number;
  averageResponseTime: number;
  consistency: number;
  peakStreak: number;
  flowState: number;
  rawScore: number;
  multipliedScore: number;
  evolutionEarned: number;
  grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  trials: TrialRecord[];
}

export interface EvolutionState {
  current: number;
  lifetime: number;
  stage: number;
  title: string;
  nextMilestone: number;
  worldComplexity: number;
  audioDepth: number;
  ruleLayersUnlocked: number;
}

export interface ProgressionMilestone {
  stage: number;
  title: string;
  subtitle: string;
  requiredEvolution: number;
  newChallengeTypes: ChallengeType[];
  newSectors: string[];
  visualUpgrade: string;
  audioUpgrade: string;
  dialogue: string[];
  cinematicId: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ANALYTICS & SELF-REFLECTION - Visual Intelligence Display
// ─────────────────────────────────────────────────────────────────────────────────

export interface RadarMetric {
  id: string;
  label: string;
  value: number;
  trend: number;
  percentile: number;
}

export interface TemporalAnalysis {
  sessionStart: number;
  currentTime: number;
  accuracyTimeline: { time: number; value: number }[];
  responseTimeline: { time: number; value: number }[];
  warmupEnd: number;
  peakStart: number;
  peakEnd: number;
  declineStart?: number;
  optimalDuration: number;
  fatigueOnset: number;
}

export interface FocusStability {
  overall: number;
  responseConsistency: number;
  accuracyConsistency: number;
  decisionConfidence: number;
  volatilityPeriods: { start: number; end: number; severity: number }[];
  recoveryAbility: number;
}

export interface CognitiveBalance {
  domains: Record<CognitiveDomain, number>;
  specialist: CognitiveDomain | null;
  weakness: CognitiveDomain | null;
  balanced: boolean;
  recommendations: {
    domain: CognitiveDomain;
    reason: string;
    suggestedChambers: string[];
  }[];
}

export interface AnalyticsDashboard {
  currentSession: {
    duration: number;
    trialsCompleted: number;
    currentAccuracy: number;
    currentStreak: number;
    estimatedFatigue: number;
  };
  cognitiveRadar: RadarMetric[];
  temporalAnalysis: TemporalAnalysis;
  focusStability: FocusStability;
  cognitiveBalance: CognitiveBalance;
  evolutionHistory: { date: string; value: number }[];
  sessionHistory: { date: string; duration: number; performance: number }[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// DIALOGUE & INSIGHT SYSTEM - Observer Communication
// ─────────────────────────────────────────────────────────────────────────────────

export interface InsightCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Insight {
  id: string;
  category: 'perception' | 'tempo' | 'precision' | 'growth' | 'pattern' | 'pressure' | 'milestone' | 'mastery' | 'flow';
  message: string;
  subtext?: string;
  conditions: InsightCondition[];
  priority: number;
  cooldown: number;
  lastShown?: number;
  tone: 'neutral' | 'encouraging' | 'challenging' | 'mysterious' | 'profound';
  duration: 'brief' | 'standard' | 'extended';
}

export interface InsightCondition {
  metric: string;
  operator: '>' | '<' | '==' | '>=' | '<=' | 'between' | 'trend';
  value: number | string | boolean | [number, number];
}

export interface SessionReflection {
  headline: string;
  subheadline: string;
  insights: Insight[];
  highlightedMetric: {
    label: string;
    value: string;
    context: string;
    trend: 'up' | 'down' | 'stable';
  };
  suggestion: string;
  overallTone: 'celebratory' | 'analytical' | 'encouraging' | 'challenging';
}

export interface VoidWhisper {
  id: string;
  message: string;
  condition: () => boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  seenCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// UI/UX SPATIAL TYPES - Dimensional Interface
// ─────────────────────────────────────────────────────────────────────────────────

export interface DimensionalTransition {
  type: 'portal' | 'fold' | 'dissolve' | 'emergence' | 'collapse' | 'phase';
  duration: number;
  curve: MotionCurve;
  soundEffect?: string;
}

export interface SpatialMenu {
  id: string;
  layers: {
    depth: number;
    elements: SpatialElement[];
    parallaxFactor: number;
  }[];
  ambientAnimation: CinematicSequence;
}

export interface SpatialElement {
  id: string;
  type: 'text' | 'shape' | 'particle' | 'glow' | 'line';
  position: Vector3D;
  scale: Vector3D;
  rotation: Vector3D;
  content: string | any;
  interactive: boolean;
  hoverEffect?: string;
  pressEffect?: string;
}

export interface TypographyStyle {
  family: string;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  size: number;
  letterSpacing: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  color: string;
  glow?: { color: string; radius: number; opacity: number };
}

// ─────────────────────────────────────────────────────────────────────────────────
// GAME SHAPE & TRIAL TYPES - Core Gameplay Elements
// ─────────────────────────────────────────────────────────────────────────────────

export interface GlowColor {
  hex: string;
  name: string;
  hue?: number;
  saturation?: number;
  lightness?: number;
}

export interface Shape {
  id: number | string;
  type: ShapeType;
  color: GlowColor;
  size: number;
  x: number;
  y: number;
  rotation: number;
  opacity?: number;
  glowIntensity: number;
  position?: Vector3D;
  receivesLight?: boolean;
  castsShadow?: boolean;
  emissive?: number;
  idleAnimations?: IdleAnimation[];
  physics?: PhysicsProperties;
  isTarget?: boolean;
  isDistractor?: boolean;
  appearanceOrder?: number;
  isMoving?: boolean;
  isRotating?: boolean;
  isPulsing?: boolean;
  isFlickering?: boolean;
  isPhasing?: boolean;
}

export interface TrialState {
  chamberId: string;
  trialIndex: number;
  totalTrials: number;
  challengeType: ChallengeType;
  instruction: string;
  shapes: Shape[];
  targetShapeId: string;
  startTime: number;
  timeLimit: number;
  elapsed: number;
  phase: 'preparing' | 'active' | 'responding' | 'revealing' | 'transitioning';
  selectedShapeId?: string;
  result?: 'correct' | 'incorrect' | 'timeout';
  streakAtRisk: number;
  pressureLevel: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// GLOBAL GAME STATE - Living System State
// ─────────────────────────────────────────────────────────────────────────────────

export interface GameUniverse {
  mindModel: PlayerMindModel;
  evolutionState: EvolutionState;
  discoveredSectors: string[];
  completedChambers: string[];
  anomaliesEncountered: string[];
  activeEvents: CosmicEvent[];
  dailyTrialStreak: number;
  currentScreen: Screen;
  currentSector?: string;
  currentChamber?: string;
  currentTrial?: TrialState;
  difficultyState: DifficultyState;
  analytics: AnalyticsDashboard;
  settings: GameSettings;
  firstLaunch: boolean;
  lastSessionEnd: number;
  totalPlaytime: number;
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  ambientVolume: number;
  particleDensity: 'low' | 'medium' | 'high' | 'ultra';
  glowIntensity: number;
  screenShake: boolean;
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  reducedMotion: boolean;
  highContrast: boolean;
  hapticFeedback: boolean;
  showTimer: boolean;
  analyticsEnabled: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// LEGACY COMPATIBILITY - Bridge to existing code
// ─────────────────────────────────────────────────────────────────────────────────

export interface SkillVector {
  visual: number;
  spatial: number;
  logical: number;
  temporal: number;
}

export interface DifficultyVector {
  timePressure: number;
  shapeCount: number;
  challengeComplexity: number;
  visualNoise: number;
  distractorCount: number;
}

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

export interface PlayerBehaviorProfile {
  averageResponseTime: number;
  responseTimeVariance: number;
  recentResponseTime: number;
  accuracy: number;
  recentAccuracy: number;
  challengeAccuracy?: Record<string, number>;
  skillVector: SkillVector;
  positionBias?: { corner: number; edge: number; center: number };
  errorPatterns: any[];
  totalRounds: number;
  currentStreak: number;
  longestStreak: number;
  sessionDuration: number;
  preferredChallenges: ChallengeType[];
  struggleChallenges: ChallengeType[];
}

export interface InsightRule {
  id: string;
  condition: (profile: PlayerBehaviorProfile) => boolean;
  message: string;
  icon: string;
  category: 'tempo' | 'precision' | 'mastery' | 'pattern' | 'flow' | 'milestone';
}

export interface ChallengeDefinition {
  type: ChallengeType;
  domain: CognitiveDomain;
  baseWeight: number;
  description: string;
  unlockLevel: number;
  complexity: number;
}

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

export interface World {
  id: number;
  name: string;
  color: string;
  description: string;
  icon: string;
  unlockRequirement: number;
  backgroundEffect?: 'nebula' | 'stars' | 'void' | 'aurora' | 'matrix';
}

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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (profile: PlayerBehaviorProfile) => boolean;
  unlocked: boolean;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number;
  effect: 'slowTime' | 'highlight' | 'shield' | 'doublePoints';
}

export interface GameState {
  currentLevel: number;
  completedLevels: number[];
  totalScore: number;
  highestStreak: number;
  totalPlayTime: number;
  achievements: string[];
}

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

export interface PerformanceVector {
  speed: number;
  accuracy: number;
  consistency: number;
  spatial: number;
  pattern: number;
  pressure: number;
}

export interface ErrorPattern {
  challengeType: ChallengeType;
  responseTime: number;
  timestamp: number;
  correctPosition?: { x: number; y: number };
  selectedPosition?: { x: number; y: number };
  shapeContext?: any;
}
