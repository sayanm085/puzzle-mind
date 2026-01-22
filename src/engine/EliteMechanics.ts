// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 ELITE MECHANICS - Three Systems That Scale Infinitely
// Rule Discovery | Temporal Compression | Deceptive Affordance
// ═══════════════════════════════════════════════════════════════════════════════

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type MechanicType = 'rule_discovery' | 'temporal_compression' | 'deceptive_affordance';

export interface GameElement {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon';
  color: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  
  // Behavioral properties
  hasMoved: boolean;
  moveCount: number;
  appearedRound: number;
  wasSelectedBefore: boolean;
  wasRelevantLastRound: boolean;
  isSymmetric: boolean;
  distanceFromCenter: number;
  brightness: number;
  gazeTime: number; // Simulated attention
  
  // State
  isCorrect: boolean;
  isTrap: boolean;
  metadata: Record<string, any>;
}

export interface HiddenRule {
  id: string;
  name: string;
  description: string; // For debugging only - NEVER shown to player
  evaluate: (element: GameElement, context: RuleContext) => boolean;
  complexity: number;
  category: 'static' | 'temporal' | 'relational' | 'inverse' | 'contextual';
  mutatesTo?: string[]; // IDs of rules this can silently mutate into
}

export interface RuleContext {
  allElements: GameElement[];
  previousRoundState: GameElement[];
  twoRoundsAgoState: GameElement[];
  currentRound: number;
  playerSelections: string[]; // IDs selected this round
  historicalSelections: Map<number, string[]>; // Round -> selected IDs
  symmetryAxis: { x: number; y: number };
  centerPoint: { x: number; y: number };
  dominantColor: string;
  dominantShape: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1️⃣ RULE DISCOVERY - Silent Laws
// "The game never tells the rule. The player must infer."
// ═══════════════════════════════════════════════════════════════════════════════

export const HIDDEN_RULES: HiddenRule[] = [
  // ─── STATIC RULES (Observable in single round) ───
  {
    id: 'never_moved',
    name: 'The Still Ones',
    description: 'Only shapes that never moved are valid',
    evaluate: (el) => !el.hasMoved && el.moveCount === 0,
    complexity: 2,
    category: 'static',
    mutatesTo: ['most_moved'],
  },
  {
    id: 'most_moved',
    name: 'The Restless',
    description: 'Only shapes that moved the most are valid',
    evaluate: (el, ctx) => {
      const maxMoves = Math.max(...ctx.allElements.map(e => e.moveCount));
      return el.moveCount === maxMoves && maxMoves > 0;
    },
    complexity: 3,
    category: 'static',
    mutatesTo: ['never_moved'],
  },
  {
    id: 'symmetry_breaker',
    name: 'The Anomaly',
    description: 'Tap the object that violates symmetry',
    evaluate: (el) => !el.isSymmetric,
    complexity: 4,
    category: 'static',
    mutatesTo: ['symmetry_keeper'],
  },
  {
    id: 'symmetry_keeper',
    name: 'The Balanced',
    description: 'Only symmetric objects are valid',
    evaluate: (el) => el.isSymmetric,
    complexity: 3,
    category: 'static',
    mutatesTo: ['symmetry_breaker'],
  },
  {
    id: 'edge_dweller',
    name: 'The Peripheral',
    description: 'Only objects far from center are valid',
    evaluate: (el) => el.distanceFromCenter > 150,
    complexity: 2,
    category: 'static',
    mutatesTo: ['center_dweller'],
  },
  {
    id: 'center_dweller',
    name: 'The Core',
    description: 'Only objects near center are valid',
    evaluate: (el) => el.distanceFromCenter < 100,
    complexity: 2,
    category: 'static',
    mutatesTo: ['edge_dweller'],
  },
  
  // ─── TEMPORAL RULES (Require memory) ───
  {
    id: 'irrelevant_last_round',
    name: 'The Forgotten',
    description: 'The correct object was irrelevant last round',
    evaluate: (el) => el.wasRelevantLastRound === false,
    complexity: 5,
    category: 'temporal',
    mutatesTo: ['relevant_last_round'],
  },
  {
    id: 'relevant_last_round',
    name: 'The Persistent',
    description: 'The correct object was relevant last round',
    evaluate: (el) => el.wasRelevantLastRound === true,
    complexity: 4,
    category: 'temporal',
    mutatesTo: ['irrelevant_last_round'],
  },
  {
    id: 'first_appeared',
    name: 'The Elder',
    description: 'Only objects from round 1 are valid',
    evaluate: (el) => el.appearedRound === 1,
    complexity: 4,
    category: 'temporal',
  },
  {
    id: 'newest_arrival',
    name: 'The Newcomer',
    description: 'Only objects that appeared this round are valid',
    evaluate: (el, ctx) => el.appearedRound === ctx.currentRound,
    complexity: 3,
    category: 'temporal',
    mutatesTo: ['first_appeared'],
  },
  
  // ─── RELATIONAL RULES (Require comparison) ───
  {
    id: 'minority_shape',
    name: 'The Rare',
    description: 'Only the least common shape type is valid',
    evaluate: (el, ctx) => {
      const shapeCounts = new Map<string, number>();
      ctx.allElements.forEach(e => {
        shapeCounts.set(e.type, (shapeCounts.get(e.type) || 0) + 1);
      });
      const minCount = Math.min(...shapeCounts.values());
      return shapeCounts.get(el.type) === minCount;
    },
    complexity: 4,
    category: 'relational',
    mutatesTo: ['majority_shape'],
  },
  {
    id: 'majority_shape',
    name: 'The Common',
    description: 'Only the most common shape type is valid',
    evaluate: (el, ctx) => {
      const shapeCounts = new Map<string, number>();
      ctx.allElements.forEach(e => {
        shapeCounts.set(e.type, (shapeCounts.get(e.type) || 0) + 1);
      });
      const maxCount = Math.max(...shapeCounts.values());
      return shapeCounts.get(el.type) === maxCount;
    },
    complexity: 3,
    category: 'relational',
    mutatesTo: ['minority_shape'],
  },
  {
    id: 'isolated_one',
    name: 'The Solitary',
    description: 'Only the most isolated object is valid',
    evaluate: (el, ctx) => {
      const avgDistances = ctx.allElements.map(target => {
        const distances = ctx.allElements
          .filter(other => other.id !== target.id)
          .map(other => Math.sqrt(
            Math.pow(target.x - other.x, 2) + Math.pow(target.y - other.y, 2)
          ));
        return { id: target.id, avgDist: distances.reduce((a, b) => a + b, 0) / distances.length };
      });
      const mostIsolated = avgDistances.reduce((max, curr) => 
        curr.avgDist > max.avgDist ? curr : max
      );
      return el.id === mostIsolated.id;
    },
    complexity: 5,
    category: 'relational',
  },
  
  // ─── INVERSE RULES (Counter-intuitive) ───
  {
    id: 'not_brightest',
    name: 'The Dim Truth',
    description: 'The brightest object is NEVER correct',
    evaluate: (el, ctx) => {
      const maxBrightness = Math.max(...ctx.allElements.map(e => e.brightness));
      return el.brightness < maxBrightness * 0.8;
    },
    complexity: 3,
    category: 'inverse',
  },
  {
    id: 'not_center',
    name: 'The Peripheral Truth',
    description: 'Center objects are NEVER correct',
    evaluate: (el) => el.distanceFromCenter > 80,
    complexity: 3,
    category: 'inverse',
  },
  {
    id: 'not_obvious',
    name: 'The Hidden',
    description: 'The most attention-grabbing object is wrong',
    evaluate: (el, ctx) => {
      // Most obvious = brightest + largest + most central
      const obviousnessScores = ctx.allElements.map(e => ({
        id: e.id,
        score: e.brightness * 0.4 + (e.size / 100) * 0.3 + (1 - e.distanceFromCenter / 200) * 0.3,
      }));
      const mostObvious = obviousnessScores.reduce((max, curr) => 
        curr.score > max.score ? curr : max
      );
      return el.id !== mostObvious.id;
    },
    complexity: 6,
    category: 'inverse',
  },
  
  // ─── CONTEXTUAL RULES (Depend on player behavior) ───
  {
    id: 'never_selected',
    name: 'The Untouched',
    description: 'Only objects never selected before are valid',
    evaluate: (el) => !el.wasSelectedBefore,
    complexity: 4,
    category: 'contextual',
  },
  {
    id: 'hesitation_target',
    name: 'The Considered',
    description: 'The object you looked at longest is correct',
    evaluate: (el, ctx) => {
      const maxGaze = Math.max(...ctx.allElements.map(e => e.gazeTime));
      return el.gazeTime === maxGaze && maxGaze > 500;
    },
    complexity: 7,
    category: 'contextual',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 2️⃣ TEMPORAL COMPRESSION - Memory + Time
// "The answer exists in the past, but action happens now."
// ═══════════════════════════════════════════════════════════════════════════════

export interface TemporalState {
  round: number;
  elements: GameElement[];
  timestamp: number;
  visualSnapshot?: string; // Could store visual hash
}

export interface TemporalChallenge {
  observationRounds: number;   // How many rounds to observe
  actionRound: number;         // When player must act
  referenceRound: number;      // Which past round holds the answer
  decoyStates: TemporalState[]; // False memories
  compressionLevel: number;    // 1-5, affects speed and noise
  delayedPenalty: boolean;     // Wrong now, consequence later
}

export type TemporalChallengeType = 
  | 'remember_original'     // Select based on round 1 state
  | 'track_changes'         // Select what changed between rounds
  | 'predict_next'          // Select what will appear next
  | 'timeline_merge'        // Multiple timelines, find consistency
  | 'decay_detection';      // What disappeared?

export const TEMPORAL_CHALLENGES: Record<TemporalChallengeType, {
  description: string;
  complexity: number;
  setup: (baseElements: GameElement[]) => TemporalChallenge;
}> = {
  remember_original: {
    description: 'Round 1 holds the truth',
    complexity: 3,
    setup: (elements) => ({
      observationRounds: 1,
      actionRound: 3,
      referenceRound: 1,
      decoyStates: [],
      compressionLevel: 1,
      delayedPenalty: false,
    }),
  },
  track_changes: {
    description: 'What moved? What stayed?',
    complexity: 4,
    setup: (elements) => ({
      observationRounds: 2,
      actionRound: 3,
      referenceRound: 2,
      decoyStates: [],
      compressionLevel: 2,
      delayedPenalty: false,
    }),
  },
  predict_next: {
    description: 'The pattern reveals the future',
    complexity: 5,
    setup: (elements) => ({
      observationRounds: 3,
      actionRound: 4,
      referenceRound: 0, // No reference - prediction
      decoyStates: [],
      compressionLevel: 2,
      delayedPenalty: false,
    }),
  },
  timeline_merge: {
    description: 'Multiple pasts. One truth.',
    complexity: 7,
    setup: (elements) => ({
      observationRounds: 2,
      actionRound: 4,
      referenceRound: 1,
      decoyStates: [
        // Generate false timeline
        {
          round: 1,
          elements: elements.map(e => ({ ...e, x: e.x + 20, y: e.y - 10 })),
          timestamp: Date.now() - 5000,
        },
      ],
      compressionLevel: 4,
      delayedPenalty: true,
    }),
  },
  decay_detection: {
    description: 'What was lost?',
    complexity: 6,
    setup: (elements) => ({
      observationRounds: 2,
      actionRound: 3,
      referenceRound: 1,
      decoyStates: [],
      compressionLevel: 3,
      delayedPenalty: false,
    }),
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3️⃣ DECEPTIVE AFFORDANCE - Trust Betrayal
// "Some objects want to be tapped — but shouldn't be."
// ═══════════════════════════════════════════════════════════════════════════════

export interface AffordanceProfile {
  visualAttraction: number;   // 0-1, how much it draws the eye
  positionBias: number;       // 0-1, how "obvious" the position is
  sizeDominance: number;      // 0-1, relative size prominence
  colorSalience: number;      // 0-1, color pop
  symmetryAppeal: number;     // 0-1, aesthetic balance
  overallAffordance: number;  // Composite score
  
  // Behavioral reactions
  decaysOnHesitation: boolean;
  reactsToGaze: boolean;
  pulsesForAttention: boolean;
}

export interface DeceptionStrategy {
  id: string;
  name: string;
  description: string;
  applyToElements: (elements: GameElement[]) => {
    traps: string[];      // IDs of trap elements
    correct: string[];    // IDs of correct elements (counter-intuitive)
  };
  difficulty: number;
}

export const DECEPTION_STRATEGIES: DeceptionStrategy[] = [
  {
    id: 'brightest_lie',
    name: 'The Brightest Lie',
    description: 'The most visually prominent object is always wrong',
    applyToElements: (elements) => {
      const sorted = [...elements].sort((a, b) => b.brightness - a.brightness);
      return {
        traps: [sorted[0].id], // Brightest is trap
        correct: sorted.slice(-2).map(e => e.id), // Dimmest are correct
      };
    },
    difficulty: 3,
  },
  {
    id: 'center_trap',
    name: 'The Center Trap',
    description: 'Center objects are always wrong',
    applyToElements: (elements) => {
      const sorted = [...elements].sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
      return {
        traps: sorted.slice(0, 2).map(e => e.id), // Central are traps
        correct: sorted.slice(-2).map(e => e.id), // Peripheral are correct
      };
    },
    difficulty: 3,
  },
  {
    id: 'symmetry_deception',
    name: 'The Beautiful Lie',
    description: 'Symmetric, balanced objects are wrong',
    applyToElements: (elements) => {
      const symmetric = elements.filter(e => e.isSymmetric);
      const asymmetric = elements.filter(e => !e.isSymmetric);
      return {
        traps: symmetric.map(e => e.id),
        correct: asymmetric.map(e => e.id),
      };
    },
    difficulty: 4,
  },
  {
    id: 'size_inversion',
    name: 'The Small Truth',
    description: 'The largest objects are traps',
    applyToElements: (elements) => {
      const sorted = [...elements].sort((a, b) => b.size - a.size);
      return {
        traps: sorted.slice(0, 2).map(e => e.id),
        correct: sorted.slice(-2).map(e => e.id),
      };
    },
    difficulty: 2,
  },
  {
    id: 'gaze_punishment',
    name: 'The Watched Pot',
    description: 'Objects you look at longest become wrong',
    applyToElements: (elements) => {
      const sorted = [...elements].sort((a, b) => b.gazeTime - a.gazeTime);
      return {
        traps: sorted.filter(e => e.gazeTime > 800).map(e => e.id),
        correct: sorted.filter(e => e.gazeTime < 300).map(e => e.id),
      };
    },
    difficulty: 6,
  },
  {
    id: 'hesitation_decay',
    name: 'The Fading Choice',
    description: 'Safe choices decay over time - act decisively',
    applyToElements: (elements) => {
      // This would be applied dynamically based on time
      return {
        traps: [], // Dynamic based on time
        correct: elements.slice(0, 3).map(e => e.id), // Initial correct
      };
    },
    difficulty: 5,
  },
  {
    id: 'comfort_zone',
    name: 'The Comfortable Lie',
    description: 'Objects matching your past successful patterns are now wrong',
    applyToElements: (elements) => {
      // Would need player history to implement fully
      const comfortableTypes = ['circle', 'square']; // Assumed common
      return {
        traps: elements.filter(e => comfortableTypes.includes(e.type)).map(e => e.id),
        correct: elements.filter(e => !comfortableTypes.includes(e.type)).map(e => e.id),
      };
    },
    difficulty: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// AFFORDANCE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────────

export function calculateAffordance(
  element: GameElement,
  allElements: GameElement[],
  centerPoint: { x: number; y: number }
): AffordanceProfile {
  // Visual attraction: brightness + color saturation
  const visualAttraction = element.brightness;
  
  // Position bias: closer to center = more obvious
  const maxDistance = Math.sqrt(Math.pow(SCREEN_WIDTH / 2, 2) + Math.pow(SCREEN_HEIGHT / 2, 2));
  const positionBias = 1 - (element.distanceFromCenter / maxDistance);
  
  // Size dominance: relative to others
  const maxSize = Math.max(...allElements.map(e => e.size));
  const sizeDominance = element.size / maxSize;
  
  // Color salience: how much the color stands out
  // Bright, saturated colors = high salience
  const colorSalience = element.brightness * 0.7 + 0.3; // Simplified
  
  // Symmetry appeal
  const symmetryAppeal = element.isSymmetric ? 0.8 : 0.4;
  
  // Composite affordance
  const overallAffordance = (
    visualAttraction * 0.25 +
    positionBias * 0.25 +
    sizeDominance * 0.2 +
    colorSalience * 0.15 +
    symmetryAppeal * 0.15
  );
  
  return {
    visualAttraction,
    positionBias,
    sizeDominance,
    colorSalience,
    symmetryAppeal,
    overallAffordance,
    decaysOnHesitation: overallAffordance > 0.7,
    reactsToGaze: overallAffordance > 0.6,
    pulsesForAttention: overallAffordance > 0.8,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// ELITE MECHANICS ENGINE
// ─────────────────────────────────────────────────────────────────────────────────

class EliteMechanicsEngine {
  private currentRule: HiddenRule | null = null;
  private ruleHistory: string[] = [];
  private roundsSinceRuleChange: number = 0;
  private playerHypotheses: Map<string, number> = new Map(); // Rule ID -> confidence
  
  private temporalHistory: TemporalState[] = [];
  private activeTemporalChallenge: TemporalChallenge | null = null;
  
  private activeDeception: DeceptionStrategy | null = null;
  private affordanceProfiles: Map<string, AffordanceProfile> = new Map();
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RULE DISCOVERY
  // ═══════════════════════════════════════════════════════════════════════════════
  
  initializeRule(complexity: number): HiddenRule {
    const validRules = HIDDEN_RULES.filter(r => r.complexity <= complexity + 2);
    const selectedRule = validRules[Math.floor(Math.random() * validRules.length)];
    
    this.currentRule = selectedRule;
    this.roundsSinceRuleChange = 0;
    this.ruleHistory.push(selectedRule.id);
    
    return selectedRule;
  }
  
  evaluateSelection(element: GameElement, context: RuleContext): {
    isCorrect: boolean;
    shouldMutateRule: boolean;
    environmentResponse: 'stabilize' | 'contract' | 'neutral';
  } {
    if (!this.currentRule) {
      return { isCorrect: false, shouldMutateRule: false, environmentResponse: 'neutral' };
    }
    
    const isCorrect = this.currentRule.evaluate(element, context);
    this.roundsSinceRuleChange++;
    
    // Check for rule mutation (silent, unannounced)
    const shouldMutate = this.roundsSinceRuleChange >= 4 + Math.floor(Math.random() * 3);
    
    return {
      isCorrect,
      shouldMutateRule: shouldMutate,
      environmentResponse: isCorrect ? 'stabilize' : 'contract',
    };
  }
  
  mutateRule(): HiddenRule | null {
    if (!this.currentRule) return null;
    
    const mutationTargets = this.currentRule.mutatesTo;
    if (!mutationTargets || mutationTargets.length === 0) {
      // No specific mutation - pick random rule of similar complexity
      const similarRules = HIDDEN_RULES.filter(r => 
        Math.abs(r.complexity - this.currentRule!.complexity) <= 1 &&
        r.id !== this.currentRule!.id
      );
      if (similarRules.length === 0) return null;
      
      this.currentRule = similarRules[Math.floor(Math.random() * similarRules.length)];
    } else {
      // Mutate to specified target
      const targetId = mutationTargets[Math.floor(Math.random() * mutationTargets.length)];
      const newRule = HIDDEN_RULES.find(r => r.id === targetId);
      if (newRule) {
        this.currentRule = newRule;
      }
    }
    
    this.roundsSinceRuleChange = 0;
    this.ruleHistory.push(this.currentRule.id);
    
    return this.currentRule;
  }
  
  getCurrentRule(): HiddenRule | null {
    return this.currentRule;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEMPORAL COMPRESSION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  recordTemporalState(round: number, elements: GameElement[]): void {
    this.temporalHistory.push({
      round,
      elements: elements.map(e => ({ ...e })), // Deep copy
      timestamp: Date.now(),
    });
    
    // Keep limited history
    if (this.temporalHistory.length > 10) {
      this.temporalHistory.shift();
    }
  }
  
  initializeTemporalChallenge(
    type: TemporalChallengeType,
    elements: GameElement[]
  ): TemporalChallenge {
    const challengeConfig = TEMPORAL_CHALLENGES[type];
    this.activeTemporalChallenge = challengeConfig.setup(elements);
    return this.activeTemporalChallenge;
  }
  
  getTemporalReferenceState(referenceRound: number): TemporalState | null {
    return this.temporalHistory.find(s => s.round === referenceRound) || null;
  }
  
  evaluateTemporalSelection(
    selectedElement: GameElement,
    currentRound: number
  ): { isCorrect: boolean; insight: string | null } {
    if (!this.activeTemporalChallenge) {
      return { isCorrect: false, insight: null };
    }
    
    const referenceState = this.getTemporalReferenceState(
      this.activeTemporalChallenge.referenceRound
    );
    
    if (!referenceState) {
      return { isCorrect: false, insight: 'Memory fades...' };
    }
    
    // Find the element in reference state
    const referenceElement = referenceState.elements.find(e => e.id === selectedElement.id);
    
    // Different evaluation based on challenge type
    // For now, simple: was this element correct in the reference round?
    const wasCorrectInPast = referenceElement?.isCorrect || false;
    
    return {
      isCorrect: wasCorrectInPast,
      insight: wasCorrectInPast ? null : 'The past held a different truth.',
    };
  }
  
  getCompressionMultiplier(): number {
    if (!this.activeTemporalChallenge) return 1;
    return 1 + (this.activeTemporalChallenge.compressionLevel * 0.2);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // DECEPTIVE AFFORDANCE
  // ═══════════════════════════════════════════════════════════════════════════════
  
  initializeDeception(
    difficulty: number,
    elements: GameElement[]
  ): { traps: string[]; correct: string[] } {
    const validStrategies = DECEPTION_STRATEGIES.filter(s => s.difficulty <= difficulty + 1);
    this.activeDeception = validStrategies[Math.floor(Math.random() * validStrategies.length)];
    
    // Calculate affordance for all elements
    const centerPoint = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 };
    elements.forEach(el => {
      this.affordanceProfiles.set(el.id, calculateAffordance(el, elements, centerPoint));
    });
    
    return this.activeDeception.applyToElements(elements);
  }
  
  getAffordanceProfile(elementId: string): AffordanceProfile | null {
    return this.affordanceProfiles.get(elementId) || null;
  }
  
  updateGazeTime(elementId: string, deltaMs: number): void {
    const profile = this.affordanceProfiles.get(elementId);
    if (profile && profile.reactsToGaze) {
      // Element is being observed - may become a trap
    }
  }
  
  checkHesitationDecay(elementId: string, hesitationMs: number): boolean {
    const profile = this.affordanceProfiles.get(elementId);
    if (profile && profile.decaysOnHesitation && hesitationMs > 2000) {
      return true; // Element has decayed - no longer valid
    }
    return false;
  }
  
  getActiveDeception(): DeceptionStrategy | null {
    return this.activeDeception;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // COMBINED MECHANICS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  generateCombinedChallenge(
    round: number,
    difficulty: number,
    elements: GameElement[]
  ): {
    rule: HiddenRule;
    deception: { traps: string[]; correct: string[] };
    temporalActive: boolean;
    compressionLevel: number;
  } {
    // Initialize or continue rule
    if (!this.currentRule || this.roundsSinceRuleChange > 5) {
      this.initializeRule(difficulty);
    }
    
    // Add deception layer
    const deception = this.initializeDeception(difficulty, elements);
    
    // Maybe add temporal component
    const temporalActive = difficulty >= 4 && Math.random() < 0.3;
    if (temporalActive) {
      const temporalTypes: TemporalChallengeType[] = ['remember_original', 'track_changes'];
      this.initializeTemporalChallenge(
        temporalTypes[Math.floor(Math.random() * temporalTypes.length)],
        elements
      );
    }
    
    return {
      rule: this.currentRule!,
      deception,
      temporalActive,
      compressionLevel: this.getCompressionMultiplier(),
    };
  }
  
  reset(): void {
    this.currentRule = null;
    this.ruleHistory = [];
    this.roundsSinceRuleChange = 0;
    this.temporalHistory = [];
    this.activeTemporalChallenge = null;
    this.activeDeception = null;
    this.affordanceProfiles.clear();
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export const eliteMechanics = new EliteMechanicsEngine();
export default EliteMechanicsEngine;
