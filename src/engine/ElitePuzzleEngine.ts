// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 ELITE PUZZLE ENGINE - Rule-Based Cognitive Challenges
// Multi-condition puzzles that test understanding, not reaction
// ═══════════════════════════════════════════════════════════════════════════════

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────────
// CORE TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type ShapeType = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon';
export type LogicOperator = 'AND' | 'OR' | 'NOT' | 'XOR' | 'IMPLIES';
export type RuleCategory = 'perception' | 'spatial' | 'logic' | 'temporal' | 'meta';

export interface RuleCondition {
  property: 'shape' | 'color' | 'size' | 'position' | 'group' | 'count' | 'sequence';
  operator: '=' | '!=' | '>' | '<' | 'contains' | 'near' | 'far' | 'between';
  value: any;
  inverted?: boolean; // Rule can flip mid-round
}

export interface PuzzleRule {
  id: string;
  name: string;
  description: string; // Cryptic, not explicit
  conditions: RuleCondition[];
  logic: LogicOperator;
  category: RuleCategory;
  complexity: number; // 1-10
  deceptionLevel: number; // How many false affordances
  timeComponent?: 'immediate' | 'delayed' | 'sequence' | 'rhythm';
}

export interface PuzzleElement {
  id: string;
  type: ShapeType;
  color: string;
  secondaryColor?: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  group?: string;
  sequence?: number;
  appearedAt?: number;
  isValid: boolean; // True target based on current rules
  isTrap: boolean; // Looks valid but isn't
  isDecoy: boolean; // Clearly wrong (reduces cognitive load)
  metadata: Record<string, any>;
}

export interface PuzzleState {
  id: string;
  round: number;
  rules: PuzzleRule[];
  elements: PuzzleElement[];
  activeRuleIndex: number;
  ruleInversionPending: boolean;
  ruleInversionAt?: number;
  phase: 'observe' | 'act' | 'wait' | 'verify';
  phaseStartTime: number;
  phaseDuration: number;
  temporalSequence: string[]; // IDs in order of appearance
  playerActions: PlayerAction[];
  silenceBeforeReveal: boolean;
}

export interface PlayerAction {
  elementId: string;
  timestamp: number;
  wasCorrect: boolean;
  responseTime: number;
  hesitationTime: number; // Time hovering before commit
  wasImpulsive: boolean; // < 400ms
  wasDeliberate: boolean; // > 2000ms
}

// ─────────────────────────────────────────────────────────────────────────────────
// COLOR SYSTEM - Meaningful, earned colors
// ─────────────────────────────────────────────────────────────────────────────────

export const COGNITIVE_PALETTE = {
  // Base - nearly invisible until earned
  void: '#0A0A0F',
  abyss: '#05050A',
  whisper: '#151520',
  
  // Meaning colors - appear only when significant
  valid: '#00D4AA',      // Correct choice
  trap: '#FF3366',       // False affordance  
  neutral: '#4A4A5A',    // Non-interactive
  pending: '#FFD700',    // Awaiting action
  
  // Cognitive domain colors
  perception: '#00FFFF',  // Cyan - seeing
  spatial: '#FF6B35',     // Orange - positioning
  logic: '#A855F7',       // Purple - reasoning
  temporal: '#3B82F6',    // Blue - time
  meta: '#10B981',        // Green - self-awareness
  
  // State colors
  focus: '#FFFFFF',
  blur: '#333340',
  warning: '#FF4444',
  silence: '#000000',
};

// ─────────────────────────────────────────────────────────────────────────────────
// RULE TEMPLATES - The DNA of cognitive challenges
// ─────────────────────────────────────────────────────────────────────────────────

const RULE_TEMPLATES: Omit<PuzzleRule, 'id'>[] = [
  // ═══ PERCEPTION RULES ═══
  {
    name: 'Chromatic Alignment',
    description: 'What the eye sees, the mind questions.',
    conditions: [
      { property: 'color', operator: '=', value: 'TARGET_COLOR' },
    ],
    logic: 'AND',
    category: 'perception',
    complexity: 1,
    deceptionLevel: 0,
  },
  {
    name: 'Scale Disparity',
    description: 'Size speaks, but softly.',
    conditions: [
      { property: 'size', operator: '>', value: 'MEDIAN' },
    ],
    logic: 'AND',
    category: 'perception',
    complexity: 2,
    deceptionLevel: 1,
  },
  {
    name: 'Luminance Paradox',
    description: 'The brightest are not always seen.',
    conditions: [
      { property: 'color', operator: '=', value: 'BRIGHTEST' },
      { property: 'size', operator: '<', value: 'MEDIAN' },
    ],
    logic: 'AND',
    category: 'perception',
    complexity: 4,
    deceptionLevel: 2,
  },
  
  // ═══ SPATIAL RULES ═══
  {
    name: 'Cardinal Isolation',
    description: 'The edges hold secrets.',
    conditions: [
      { property: 'position', operator: 'near', value: 'EDGE' },
    ],
    logic: 'AND',
    category: 'spatial',
    complexity: 2,
    deceptionLevel: 1,
  },
  {
    name: 'Centroid Convergence',
    description: 'The center knows.',
    conditions: [
      { property: 'position', operator: 'near', value: 'CENTER' },
      { property: 'shape', operator: '!=', value: 'DOMINANT_SHAPE' },
    ],
    logic: 'AND',
    category: 'spatial',
    complexity: 4,
    deceptionLevel: 2,
  },
  {
    name: 'Cluster Defiance',
    description: 'Together they hide, alone they reveal.',
    conditions: [
      { property: 'position', operator: 'far', value: 'CLUSTER_CENTER' },
    ],
    logic: 'AND',
    category: 'spatial',
    complexity: 5,
    deceptionLevel: 3,
  },
  
  // ═══ LOGIC RULES ═══
  {
    name: 'Categorical Exclusion',
    description: 'What does not belong, belongs.',
    conditions: [
      { property: 'shape', operator: '!=', value: 'MAJORITY_SHAPE' },
    ],
    logic: 'NOT',
    category: 'logic',
    complexity: 3,
    deceptionLevel: 2,
  },
  {
    name: 'Conditional Alignment',
    description: 'If one, then the other. But which?',
    conditions: [
      { property: 'color', operator: '=', value: 'TARGET_COLOR' },
      { property: 'shape', operator: '=', value: 'TARGET_SHAPE' },
    ],
    logic: 'XOR',
    category: 'logic',
    complexity: 5,
    deceptionLevel: 3,
  },
  {
    name: 'Inverse Protocol',
    description: 'The rule changes. Adapt.',
    conditions: [
      { property: 'shape', operator: '=', value: 'TARGET_SHAPE', inverted: true },
    ],
    logic: 'AND',
    category: 'logic',
    complexity: 6,
    deceptionLevel: 4,
  },
  {
    name: 'Majority Override',
    description: 'The many deceive. Seek the few.',
    conditions: [
      { property: 'count', operator: '<', value: 3 },
      { property: 'group', operator: '=', value: 'MINORITY' },
    ],
    logic: 'AND',
    category: 'logic',
    complexity: 6,
    deceptionLevel: 4,
  },
  
  // ═══ TEMPORAL RULES ═══
  {
    name: 'Emergence Order',
    description: 'First to arrive, first to fall.',
    conditions: [
      { property: 'sequence', operator: '=', value: 'FIRST' },
    ],
    logic: 'AND',
    category: 'temporal',
    complexity: 4,
    deceptionLevel: 2,
    timeComponent: 'sequence',
  },
  {
    name: 'Delayed Recognition',
    description: 'Wait. Observe. Then act.',
    conditions: [
      { property: 'sequence', operator: '>', value: 3 },
      { property: 'color', operator: '=', value: 'TARGET_COLOR' },
    ],
    logic: 'AND',
    category: 'temporal',
    complexity: 5,
    deceptionLevel: 3,
    timeComponent: 'delayed',
  },
  {
    name: 'Rhythm Disruption',
    description: 'The pattern breaks. Find where.',
    conditions: [
      { property: 'sequence', operator: '=', value: 'RHYTHM_BREAK' },
    ],
    logic: 'AND',
    category: 'temporal',
    complexity: 7,
    deceptionLevel: 4,
    timeComponent: 'rhythm',
  },
  
  // ═══ META RULES ═══
  {
    name: 'Self-Referential',
    description: 'The answer questions the question.',
    conditions: [
      { property: 'group', operator: 'contains', value: 'PREVIOUS_ANSWER' },
    ],
    logic: 'AND',
    category: 'meta',
    complexity: 8,
    deceptionLevel: 5,
  },
  {
    name: 'Observer Effect',
    description: 'Looking changes what is seen.',
    conditions: [
      { property: 'shape', operator: '=', value: 'LEAST_LOOKED' },
    ],
    logic: 'AND',
    category: 'meta',
    complexity: 9,
    deceptionLevel: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// ELITE PUZZLE ENGINE CLASS
// ─────────────────────────────────────────────────────────────────────────────────

class ElitePuzzleEngine {
  private currentState: PuzzleState | null = null;
  private playerProfile: PlayerProfile;
  private ruleHistory: string[] = [];
  private sessionStart: number = Date.now();
  
  constructor() {
    this.playerProfile = this.createDefaultProfile();
  }
  
  private createDefaultProfile(): PlayerProfile {
    return {
      observerScore: 50,
      strategistScore: 50,
      reactorScore: 50,
      architectScore: 50,
      impulsivityRate: 0,
      deliberationRate: 0,
      ruleAdaptationSpeed: 0,
      patternBreakRecognition: 0,
      falseAffordanceResistance: 0,
      temporalAwareness: 0,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PUZZLE GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  generatePuzzle(
    round: number,
    difficulty: number,
    domainBias?: RuleCategory
  ): PuzzleState {
    // Select appropriate rules based on difficulty and player profile
    const rules = this.selectRules(difficulty, domainBias);
    
    // Generate elements that satisfy the rules (with traps)
    const elements = this.generateElements(rules, difficulty);
    
    // Determine phase timing
    const phases = this.calculatePhases(rules, difficulty);
    
    this.currentState = {
      id: `puzzle_${Date.now()}`,
      round,
      rules,
      elements,
      activeRuleIndex: 0,
      ruleInversionPending: difficulty > 5 && Math.random() < 0.3,
      phase: 'observe',
      phaseStartTime: Date.now(),
      phaseDuration: phases.observe,
      temporalSequence: [],
      playerActions: [],
      silenceBeforeReveal: difficulty > 7,
    };
    
    return this.currentState;
  }
  
  private selectRules(difficulty: number, bias?: RuleCategory): PuzzleRule[] {
    const availableRules = RULE_TEMPLATES.filter(r => r.complexity <= difficulty + 2);
    
    // Bias towards specific category if provided
    let selectedTemplates = availableRules;
    if (bias) {
      const biasedRules = availableRules.filter(r => r.category === bias);
      const otherRules = availableRules.filter(r => r.category !== bias);
      selectedTemplates = [...biasedRules, ...otherRules.slice(0, 2)];
    }
    
    // Pick 1-3 rules based on difficulty
    const ruleCount = Math.min(3, Math.floor(difficulty / 3) + 1);
    const selected: PuzzleRule[] = [];
    
    for (let i = 0; i < ruleCount && selectedTemplates.length > 0; i++) {
      const index = Math.floor(Math.random() * selectedTemplates.length);
      const template = selectedTemplates.splice(index, 1)[0];
      selected.push({
        ...template,
        id: `rule_${Date.now()}_${i}`,
      });
    }
    
    return selected;
  }
  
  private generateElements(rules: PuzzleRule[], difficulty: number): PuzzleElement[] {
    const elements: PuzzleElement[] = [];
    const elementCount = Math.min(12, 6 + Math.floor(difficulty * 0.8));
    
    // Calculate game area
    const gameArea = {
      x: 30,
      y: 200,
      width: SCREEN_WIDTH - 60,
      height: SCREEN_HEIGHT - 450,
    };
    
    // Determine valid targets based on rules
    const validCount = Math.max(2, Math.floor(elementCount * 0.25));
    const trapCount = Math.floor(difficulty * 0.3); // Traps increase with difficulty
    const decoyCount = elementCount - validCount - trapCount;
    
    // Generate valid elements
    for (let i = 0; i < validCount; i++) {
      elements.push(this.createValidElement(i, rules, gameArea, elements));
    }
    
    // Generate trap elements (look valid but aren't)
    for (let i = 0; i < trapCount; i++) {
      elements.push(this.createTrapElement(i, rules, gameArea, elements));
    }
    
    // Generate decoy elements
    for (let i = 0; i < decoyCount; i++) {
      elements.push(this.createDecoyElement(i, rules, gameArea, elements));
    }
    
    // Shuffle to prevent position-based solving
    return this.shuffleArray(elements);
  }
  
  private createValidElement(
    index: number,
    rules: PuzzleRule[],
    area: { x: number; y: number; width: number; height: number },
    existing: PuzzleElement[]
  ): PuzzleElement {
    const pos = this.findNonOverlappingPosition(area, existing, 80);
    const primaryRule = rules[0];
    
    // Create element that satisfies the rule(s)
    const type = this.getValidShapeForRule(primaryRule);
    const color = this.getValidColorForRule(primaryRule);
    const size = this.getValidSizeForRule(primaryRule, 45, 70);
    
    return {
      id: `element_valid_${index}_${Date.now()}`,
      type,
      color,
      x: pos.x,
      y: pos.y,
      size,
      opacity: 1,
      rotation: 0,
      isValid: true,
      isTrap: false,
      isDecoy: false,
      metadata: { ruleMatch: primaryRule.id },
    };
  }
  
  private createTrapElement(
    index: number,
    rules: PuzzleRule[],
    area: { x: number; y: number; width: number; height: number },
    existing: PuzzleElement[]
  ): PuzzleElement {
    const pos = this.findNonOverlappingPosition(area, existing, 80);
    const primaryRule = rules[0];
    
    // Create element that LOOKS valid but fails one condition
    const type = this.getValidShapeForRule(primaryRule);
    // Use similar but wrong color
    const color = this.getSimilarWrongColor(this.getValidColorForRule(primaryRule));
    const size = this.getValidSizeForRule(primaryRule, 45, 70);
    
    return {
      id: `element_trap_${index}_${Date.now()}`,
      type,
      color,
      x: pos.x,
      y: pos.y,
      size,
      opacity: 1,
      rotation: 0,
      isValid: false,
      isTrap: true,
      isDecoy: false,
      metadata: { trapType: 'color_similar' },
    };
  }
  
  private createDecoyElement(
    index: number,
    rules: PuzzleRule[],
    area: { x: number; y: number; width: number; height: number },
    existing: PuzzleElement[]
  ): PuzzleElement {
    const pos = this.findNonOverlappingPosition(area, existing, 80);
    const primaryRule = rules[0];
    
    // Clearly different from valid elements
    const type = this.getInvalidShapeForRule(primaryRule);
    const color = this.getRandomColor();
    const size = 40 + Math.random() * 25;
    
    return {
      id: `element_decoy_${index}_${Date.now()}`,
      type,
      color,
      x: pos.x,
      y: pos.y,
      size,
      opacity: 0.85,
      rotation: Math.random() * 15 - 7.5,
      isValid: false,
      isTrap: false,
      isDecoy: true,
      metadata: {},
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RULE RESOLUTION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private getValidShapeForRule(rule: PuzzleRule): ShapeType {
    const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
    
    // Check if rule specifies a shape
    const shapeCondition = rule.conditions.find(c => c.property === 'shape');
    if (shapeCondition) {
      if (shapeCondition.operator === '=' && typeof shapeCondition.value === 'string') {
        // For now, return a random shape (in real impl, resolve TARGET_SHAPE etc)
        return shapes[Math.floor(Math.random() * shapes.length)];
      }
      if (shapeCondition.operator === '!=' && shapeCondition.value === 'MAJORITY_SHAPE') {
        // Return minority shape
        return shapes[Math.floor(Math.random() * 2)]; // Less common shapes
      }
    }
    
    return shapes[Math.floor(Math.random() * shapes.length)];
  }
  
  private getInvalidShapeForRule(rule: PuzzleRule): ShapeType {
    const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
    const validShape = this.getValidShapeForRule(rule);
    const others = shapes.filter(s => s !== validShape);
    return others[Math.floor(Math.random() * others.length)];
  }
  
  private getValidColorForRule(rule: PuzzleRule): string {
    // Colors that feel "valid" and intentional
    const validColors = [
      COGNITIVE_PALETTE.valid,
      '#4ECDC4', // Teal
      '#7B68EE', // Purple
      '#FFD93D', // Gold
      '#00BFFF', // Deep sky blue
    ];
    
    const colorCondition = rule.conditions.find(c => c.property === 'color');
    if (colorCondition) {
      // Return a color that satisfies the condition
      return validColors[Math.floor(Math.random() * validColors.length)];
    }
    
    return validColors[Math.floor(Math.random() * validColors.length)];
  }
  
  private getSimilarWrongColor(validColor: string): string {
    // Return a color that's close but distinguishable
    const trapColors: Record<string, string> = {
      [COGNITIVE_PALETTE.valid]: '#00AA88', // Darker green
      '#4ECDC4': '#3DBDB4', // Slightly different teal
      '#7B68EE': '#6B58DE', // Slightly different purple
      '#FFD93D': '#EEC82D', // Slightly different gold
      '#00BFFF': '#00AFEF', // Slightly different blue
    };
    
    return trapColors[validColor] || '#5A5A6A';
  }
  
  private getRandomColor(): string {
    const colors = [
      '#FF6B6B', '#4A4A5A', '#666677', '#555566', '#7A7A8A',
      '#884444', '#448844', '#444488', '#886644', '#448886',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  private getValidSizeForRule(rule: PuzzleRule, min: number, max: number): number {
    const sizeCondition = rule.conditions.find(c => c.property === 'size');
    
    if (sizeCondition) {
      if (sizeCondition.operator === '>' && sizeCondition.value === 'MEDIAN') {
        return min + (max - min) * 0.7 + Math.random() * (max - min) * 0.3;
      }
      if (sizeCondition.operator === '<' && sizeCondition.value === 'MEDIAN') {
        return min + Math.random() * (max - min) * 0.4;
      }
    }
    
    return min + Math.random() * (max - min);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SPATIAL UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private findNonOverlappingPosition(
    area: { x: number; y: number; width: number; height: number },
    existing: PuzzleElement[],
    minDistance: number
  ): { x: number; y: number } {
    let x: number, y: number;
    let attempts = 0;
    
    do {
      x = area.x + Math.random() * area.width;
      y = area.y + Math.random() * area.height;
      attempts++;
      
      const tooClose = existing.some(e => {
        const dist = Math.sqrt(Math.pow(e.x - x, 2) + Math.pow(e.y - y, 2));
        return dist < minDistance;
      });
      
      if (!tooClose || attempts > 50) {
        break;
      }
    } while (attempts < 50);
    
    return { x, y };
  }
  
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  
  private calculatePhases(
    rules: PuzzleRule[],
    difficulty: number
  ): { observe: number; act: number; wait: number } {
    const hasTemporalRule = rules.some(r => r.timeComponent);
    
    return {
      observe: hasTemporalRule ? 3000 : 1500,
      act: 15000 - difficulty * 500,
      wait: hasTemporalRule ? 2000 : 0,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PLAYER INTERACTION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  processAction(elementId: string, timestamp: number): ActionResult {
    if (!this.currentState) {
      return { success: false, reason: 'no_active_puzzle' };
    }
    
    const element = this.currentState.elements.find(e => e.id === elementId);
    if (!element) {
      return { success: false, reason: 'element_not_found' };
    }
    
    const lastAction = this.currentState.playerActions[this.currentState.playerActions.length - 1];
    const responseTime = lastAction
      ? timestamp - lastAction.timestamp
      : timestamp - this.currentState.phaseStartTime;
    
    const action: PlayerAction = {
      elementId,
      timestamp,
      wasCorrect: element.isValid,
      responseTime,
      hesitationTime: 0, // Would track with touch events
      wasImpulsive: responseTime < 400,
      wasDeliberate: responseTime > 2000,
    };
    
    this.currentState.playerActions.push(action);
    
    // Update player profile
    this.updatePlayerProfile(action, element);
    
    if (element.isValid) {
      return {
        success: true,
        feedback: 'valid',
        scoreModifier: this.calculateScoreModifier(action),
        insightGenerated: this.maybeGenerateInsight(action),
      };
    } else if (element.isTrap) {
      return {
        success: false,
        feedback: 'trap',
        reason: 'false_affordance',
        penalty: 'combo_reset',
        insightGenerated: this.generateTrapInsight(),
      };
    } else {
      return {
        success: false,
        feedback: 'wrong',
        reason: 'decoy_selected',
        penalty: 'minor',
      };
    }
  }
  
  private calculateScoreModifier(action: PlayerAction): number {
    let modifier = 1.0;
    
    // Deliberate correct answers worth more
    if (action.wasDeliberate && action.wasCorrect) {
      modifier *= 1.5;
    }
    
    // Impulsive correct answers worth less
    if (action.wasImpulsive && action.wasCorrect) {
      modifier *= 0.8;
    }
    
    return modifier;
  }
  
  private updatePlayerProfile(action: PlayerAction, element: PuzzleElement): void {
    if (action.wasImpulsive) {
      this.playerProfile.impulsivityRate = 
        this.playerProfile.impulsivityRate * 0.9 + 0.1;
      this.playerProfile.reactorScore += action.wasCorrect ? 2 : -3;
    }
    
    if (action.wasDeliberate && action.wasCorrect) {
      this.playerProfile.deliberationRate =
        this.playerProfile.deliberationRate * 0.9 + 0.1;
      this.playerProfile.strategistScore += 2;
    }
    
    if (element.isTrap && !action.wasCorrect) {
      // Fell for trap
      this.playerProfile.falseAffordanceResistance -= 0.05;
    } else if (element.isTrap && action.wasCorrect) {
      // Avoided trap (shouldn't happen - traps aren't valid)
    }
    
    // Clamp values
    this.playerProfile.observerScore = Math.max(0, Math.min(100, this.playerProfile.observerScore));
    this.playerProfile.strategistScore = Math.max(0, Math.min(100, this.playerProfile.strategistScore));
    this.playerProfile.reactorScore = Math.max(0, Math.min(100, this.playerProfile.reactorScore));
    this.playerProfile.architectScore = Math.max(0, Math.min(100, this.playerProfile.architectScore));
  }
  
  private maybeGenerateInsight(action: PlayerAction): string | null {
    // Generate insights sparingly
    if (Math.random() > 0.1) return null;
    
    if (action.wasDeliberate && action.wasCorrect) {
      return 'Patience reveals patterns others miss.';
    }
    
    return null;
  }
  
  private generateTrapInsight(): string {
    const insights = [
      'The obvious path deceives.',
      'Similarity is not identity.',
      'Your eye moved faster than your mind.',
      'The trap was set. You walked in.',
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RULE INVERSION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  checkForRuleInversion(): RuleInversionEvent | null {
    if (!this.currentState || !this.currentState.ruleInversionPending) {
      return null;
    }
    
    const timeSinceStart = Date.now() - this.currentState.phaseStartTime;
    const halfwayPoint = this.currentState.phaseDuration * 0.5;
    
    if (timeSinceStart > halfwayPoint && !this.currentState.ruleInversionAt) {
      this.currentState.ruleInversionAt = Date.now();
      
      // Invert the first rule
      const rule = this.currentState.rules[0];
      if (rule.conditions[0]) {
        rule.conditions[0].inverted = !rule.conditions[0].inverted;
      }
      
      // Recalculate valid elements
      this.currentState.elements = this.currentState.elements.map(e => ({
        ...e,
        isValid: !e.isValid && !e.isTrap, // Swap valid/invalid (but traps stay traps)
      }));
      
      return {
        type: 'inversion',
        message: 'The rule shifts.',
        timestamp: Date.now(),
      };
    }
    
    return null;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getCurrentState(): PuzzleState | null {
    return this.currentState;
  }
  
  getPlayerProfile(): PlayerProfile {
    return { ...this.playerProfile };
  }
  
  getRemainingValidTargets(): number {
    if (!this.currentState) return 0;
    
    const validIds = this.currentState.elements
      .filter(e => e.isValid)
      .map(e => e.id);
    
    const selectedValidIds = this.currentState.playerActions
      .filter(a => a.wasCorrect)
      .map(a => a.elementId);
    
    return validIds.filter(id => !selectedValidIds.includes(id)).length;
  }
  
  getActiveRule(): PuzzleRule | null {
    if (!this.currentState) return null;
    return this.currentState.rules[this.currentState.activeRuleIndex] || null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// SUPPORTING TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface PlayerProfile {
  observerScore: number;      // Notices subtle details
  strategistScore: number;    // Plans before acting
  reactorScore: number;       // Fast correct responses
  architectScore: number;     // Understands underlying rules
  impulsivityRate: number;
  deliberationRate: number;
  ruleAdaptationSpeed: number;
  patternBreakRecognition: number;
  falseAffordanceResistance: number;
  temporalAwareness: number;
}

interface ActionResult {
  success: boolean;
  feedback?: 'valid' | 'trap' | 'wrong';
  reason?: string;
  scoreModifier?: number;
  penalty?: 'combo_reset' | 'minor' | 'major';
  insightGenerated?: string | null;
}

interface RuleInversionEvent {
  type: 'inversion';
  message: string;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export const elitePuzzleEngine = new ElitePuzzleEngine();
export default ElitePuzzleEngine;
