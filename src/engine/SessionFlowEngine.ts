// ═══════════════════════════════════════════════════════════════════════════════
// 🌊 SESSION FLOW ENGINE - Anti-Burnout Cognitive Rhythm
// Wave-Based Progression | Invisible Adaptation | Session Caps
// ═══════════════════════════════════════════════════════════════════════════════

import { Animated, Easing } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type WavePhase = 'warmup' | 'stretch' | 'peak' | 'reflection';

export type CognitiveStage = 
  | 'awareness'       // Foundation - learning to observe
  | 'stability'       // Consistency - reliable performance
  | 'adaptability'    // Flexibility - handling change
  | 'insight'         // Understanding - seeing deeper patterns
  | 'mastery';        // Integration - effortless cognition

export interface SessionMetrics {
  // Time-based
  sessionStartTime: number;
  totalActiveTime: number;
  timeSinceLastInteraction: number;
  
  // Performance
  roundsCompleted: number;
  correctResponses: number;
  incorrectResponses: number;
  
  // Behavioral signals
  reactionTimes: number[];
  reactionVariance: number;
  hesitationCounts: number;
  errorPatterns: Map<string, number>; // Error type -> count
  
  // Cognitive state
  currentPhase: WavePhase;
  phaseProgress: number;
  cognitiveStage: CognitiveStage;
  stageProgress: number;
  
  // Adaptation
  currentDifficulty: number;
  adaptationHistory: { time: number; difficulty: number }[];
  
  // Session health
  fatigueLevel: number;       // 0-1
  frustrationLevel: number;   // 0-1
  engagementLevel: number;    // 0-1
  optimalPlayReached: boolean;
}

export interface WaveConfig {
  phase: WavePhase;
  duration: number;           // Expected rounds
  difficultyModifier: number; // -0.2 to +0.2
  description: string;
  transitionCues: string[];   // Subtle environmental hints
}

export interface StageUnlocks {
  ruleTypes: string[];
  deceptionStyles: string[];
  environments: string[];
  mechanics: string[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

export const WAVE_PHASES: Record<WavePhase, WaveConfig> = {
  warmup: {
    phase: 'warmup',
    duration: 3,
    difficultyModifier: -0.2,
    description: 'Confidence building',
    transitionCues: [
      'Environment gently brightens',
      'Ambient sounds soften',
      'Timing feels generous',
    ],
  },
  stretch: {
    phase: 'stretch',
    duration: 4,
    difficultyModifier: 0,
    description: 'New challenges introduced',
    transitionCues: [
      'Subtle complexity emerges',
      'Patterns shift slightly',
      'Attention naturally sharpens',
    ],
  },
  peak: {
    phase: 'peak',
    duration: 3,
    difficultyModifier: 0.15,
    description: 'High challenge, high engagement',
    transitionCues: [
      'Focus intensifies',
      'Time feels compressed',
      'Clarity required',
    ],
  },
  reflection: {
    phase: 'reflection',
    duration: 2,
    difficultyModifier: -0.3,
    description: 'Integration and calm',
    transitionCues: [
      'Pace naturally slows',
      'Breathing deepens',
      'Insights surface',
    ],
  },
};

export const COGNITIVE_STAGES: Record<CognitiveStage, {
  name: string;
  description: string;
  requirements: { roundsTotal: number; accuracyMin: number };
  unlocks: StageUnlocks;
}> = {
  awareness: {
    name: 'Awareness',
    description: 'Learning to truly observe',
    requirements: { roundsTotal: 0, accuracyMin: 0 },
    unlocks: {
      ruleTypes: ['static'],
      deceptionStyles: ['size_inversion'],
      environments: ['void'],
      mechanics: ['basic_selection'],
    },
  },
  stability: {
    name: 'Stability',
    description: 'Building consistent patterns',
    requirements: { roundsTotal: 20, accuracyMin: 0.5 },
    unlocks: {
      ruleTypes: ['static', 'relational'],
      deceptionStyles: ['brightest_lie', 'center_trap'],
      environments: ['void', 'crystal'],
      mechanics: ['basic_selection', 'rule_discovery'],
    },
  },
  adaptability: {
    name: 'Adaptability',
    description: 'Embracing change gracefully',
    requirements: { roundsTotal: 50, accuracyMin: 0.6 },
    unlocks: {
      ruleTypes: ['static', 'relational', 'temporal'],
      deceptionStyles: ['brightest_lie', 'center_trap', 'symmetry_deception'],
      environments: ['void', 'crystal', 'nebula'],
      mechanics: ['basic_selection', 'rule_discovery', 'temporal_memory'],
    },
  },
  insight: {
    name: 'Insight',
    description: 'Seeing deeper truths',
    requirements: { roundsTotal: 100, accuracyMin: 0.65 },
    unlocks: {
      ruleTypes: ['static', 'relational', 'temporal', 'inverse'],
      deceptionStyles: ['brightest_lie', 'center_trap', 'symmetry_deception', 'hesitation_decay'],
      environments: ['void', 'crystal', 'nebula', 'singularity'],
      mechanics: ['basic_selection', 'rule_discovery', 'temporal_memory', 'deceptive_affordance'],
    },
  },
  mastery: {
    name: 'Mastery',
    description: 'Effortless cognition',
    requirements: { roundsTotal: 200, accuracyMin: 0.7 },
    unlocks: {
      ruleTypes: ['static', 'relational', 'temporal', 'inverse', 'contextual'],
      deceptionStyles: ['brightest_lie', 'center_trap', 'symmetry_deception', 'hesitation_decay', 'gaze_punishment', 'comfort_zone'],
      environments: ['void', 'crystal', 'nebula', 'singularity', 'transcendence'],
      mechanics: ['basic_selection', 'rule_discovery', 'temporal_memory', 'deceptive_affordance', 'combined_mechanics'],
    },
  },
};

// Optimal session duration (in minutes)
const OPTIMAL_SESSION_MIN = 10;
const OPTIMAL_SESSION_MAX = 20;
const ABSOLUTE_MAX_SESSION = 30;

// ─────────────────────────────────────────────────────────────────────────────────
// ANIMATED VALUES
// ─────────────────────────────────────────────────────────────────────────────────

export const sessionAnimations = {
  waveIntensity: new Animated.Value(0.5),    // Current wave intensity
  difficultyPulse: new Animated.Value(1),     // Subtle difficulty indicator
  fatigueOverlay: new Animated.Value(0),      // Fatigue visual
  reflectionGlow: new Animated.Value(0),      // Reflection phase glow
};

// ─────────────────────────────────────────────────────────────────────────────────
// SESSION FLOW ENGINE
// ─────────────────────────────────────────────────────────────────────────────────

class SessionFlowEngine {
  private metrics: SessionMetrics;
  private waveStartRound: number = 0;
  private phaseSequence: WavePhase[] = ['warmup', 'stretch', 'peak', 'reflection'];
  private currentPhaseIndex: number = 0;
  private totalLifetimeRounds: number = 0;
  private listeners: Set<(metrics: SessionMetrics) => void> = new Set();
  
  constructor() {
    this.metrics = this.createInitialMetrics();
  }
  
  private createInitialMetrics(): SessionMetrics {
    return {
      sessionStartTime: Date.now(),
      totalActiveTime: 0,
      timeSinceLastInteraction: 0,
      roundsCompleted: 0,
      correctResponses: 0,
      incorrectResponses: 0,
      reactionTimes: [],
      reactionVariance: 0,
      hesitationCounts: 0,
      errorPatterns: new Map(),
      currentPhase: 'warmup',
      phaseProgress: 0,
      cognitiveStage: 'awareness',
      stageProgress: 0,
      currentDifficulty: 3,
      adaptationHistory: [{ time: Date.now(), difficulty: 3 }],
      fatigueLevel: 0,
      frustrationLevel: 0,
      engagementLevel: 0.7,
      optimalPlayReached: false,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // WAVE-BASED COGNITIVE FLOW
  // ═══════════════════════════════════════════════════════════════════════════════
  
  startSession(): void {
    this.metrics = this.createInitialMetrics();
    this.waveStartRound = 0;
    this.currentPhaseIndex = 0;
    this.animateWaveTransition('warmup');
    this.notifyListeners();
  }
  
  recordRoundResult(
    isCorrect: boolean,
    reactionTimeMs: number,
    hesitated: boolean,
    errorType?: string
  ): {
    phaseChanged: boolean;
    newPhase?: WavePhase;
    stageChanged: boolean;
    newStage?: CognitiveStage;
    shouldEndSession: boolean;
    sessionEndReason?: string;
    feedback?: string;
  } {
    // Update basic metrics
    this.metrics.roundsCompleted++;
    this.totalLifetimeRounds++;
    
    if (isCorrect) {
      this.metrics.correctResponses++;
    } else {
      this.metrics.incorrectResponses++;
      if (errorType) {
        const count = this.metrics.errorPatterns.get(errorType) || 0;
        this.metrics.errorPatterns.set(errorType, count + 1);
      }
    }
    
    // Track reaction times
    this.metrics.reactionTimes.push(reactionTimeMs);
    if (this.metrics.reactionTimes.length > 20) {
      this.metrics.reactionTimes.shift();
    }
    this.calculateReactionVariance();
    
    if (hesitated) {
      this.metrics.hesitationCounts++;
    }
    
    // Update time
    this.metrics.totalActiveTime = Date.now() - this.metrics.sessionStartTime;
    
    // Calculate fatigue and frustration
    this.updateFatigueLevels(isCorrect, reactionTimeMs);
    
    // Check phase progression
    const phaseResult = this.checkPhaseProgression();
    
    // Check stage progression
    const stageResult = this.checkStageProgression();
    
    // Adapt difficulty invisibly
    this.adaptDifficulty();
    
    // Check session end conditions
    const sessionResult = this.checkSessionEnd();
    
    this.notifyListeners();
    
    return {
      phaseChanged: phaseResult.changed,
      newPhase: phaseResult.newPhase,
      stageChanged: stageResult.changed,
      newStage: stageResult.newStage,
      shouldEndSession: sessionResult.shouldEnd,
      sessionEndReason: sessionResult.reason,
      feedback: this.generateSubtleFeedback(isCorrect),
    };
  }
  
  private checkPhaseProgression(): { changed: boolean; newPhase?: WavePhase } {
    const currentConfig = WAVE_PHASES[this.metrics.currentPhase];
    const roundsInPhase = this.metrics.roundsCompleted - this.waveStartRound;
    
    this.metrics.phaseProgress = Math.min(roundsInPhase / currentConfig.duration, 1);
    
    if (roundsInPhase >= currentConfig.duration) {
      // Move to next phase
      this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.phaseSequence.length;
      const newPhase = this.phaseSequence[this.currentPhaseIndex];
      
      this.metrics.currentPhase = newPhase;
      this.metrics.phaseProgress = 0;
      this.waveStartRound = this.metrics.roundsCompleted;
      
      this.animateWaveTransition(newPhase);
      
      return { changed: true, newPhase };
    }
    
    return { changed: false };
  }
  
  private checkStageProgression(): { changed: boolean; newStage?: CognitiveStage } {
    const stages: CognitiveStage[] = ['awareness', 'stability', 'adaptability', 'insight', 'mastery'];
    const currentIndex = stages.indexOf(this.metrics.cognitiveStage);
    
    if (currentIndex >= stages.length - 1) {
      return { changed: false };
    }
    
    const nextStage = stages[currentIndex + 1];
    const nextRequirements = COGNITIVE_STAGES[nextStage].requirements;
    
    const accuracy = this.metrics.correctResponses / Math.max(this.metrics.roundsCompleted, 1);
    
    // Update stage progress
    const roundsProgress = Math.min(this.totalLifetimeRounds / nextRequirements.roundsTotal, 1);
    const accuracyProgress = Math.min(accuracy / nextRequirements.accuracyMin, 1);
    this.metrics.stageProgress = (roundsProgress + accuracyProgress) / 2;
    
    if (
      this.totalLifetimeRounds >= nextRequirements.roundsTotal &&
      accuracy >= nextRequirements.accuracyMin
    ) {
      this.metrics.cognitiveStage = nextStage;
      this.metrics.stageProgress = 0;
      
      return { changed: true, newStage: nextStage };
    }
    
    return { changed: false };
  }
  
  private animateWaveTransition(phase: WavePhase): void {
    const intensityTargets: Record<WavePhase, number> = {
      warmup: 0.3,
      stretch: 0.5,
      peak: 0.9,
      reflection: 0.2,
    };
    
    Animated.parallel([
      Animated.timing(sessionAnimations.waveIntensity, {
        toValue: intensityTargets[phase],
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: false,
      }),
      Animated.timing(sessionAnimations.reflectionGlow, {
        toValue: phase === 'reflection' ? 1 : 0,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // INVISIBLE DIFFICULTY ADJUSTMENT
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private adaptDifficulty(): void {
    // Get base difficulty from phase
    const phaseModifier = WAVE_PHASES[this.metrics.currentPhase].difficultyModifier;
    
    // Calculate performance-based adjustment
    const performanceAdjustment = this.calculatePerformanceAdjustment();
    
    // Calculate fatigue adjustment
    const fatigueAdjustment = -this.metrics.fatigueLevel * 0.3;
    
    // Calculate frustration adjustment
    const frustrationAdjustment = -this.metrics.frustrationLevel * 0.4;
    
    // Combine adjustments (small, invisible changes)
    const totalAdjustment = phaseModifier + performanceAdjustment + fatigueAdjustment + frustrationAdjustment;
    
    // Apply adjustment smoothly
    const targetDifficulty = Math.max(1, Math.min(10, this.metrics.currentDifficulty + totalAdjustment));
    
    // Smooth transition
    this.metrics.currentDifficulty = this.metrics.currentDifficulty * 0.8 + targetDifficulty * 0.2;
    
    // Record adaptation
    this.metrics.adaptationHistory.push({
      time: Date.now(),
      difficulty: this.metrics.currentDifficulty,
    });
    
    // Keep history limited
    if (this.metrics.adaptationHistory.length > 50) {
      this.metrics.adaptationHistory.shift();
    }
    
    // Animate difficulty pulse (subtle visual)
    Animated.sequence([
      Animated.timing(sessionAnimations.difficultyPulse, {
        toValue: 1 + Math.abs(totalAdjustment) * 0.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sessionAnimations.difficultyPulse, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }
  
  private calculatePerformanceAdjustment(): number {
    const recentRounds = 5;
    const recentCorrect = this.metrics.correctResponses;
    const total = this.metrics.roundsCompleted;
    
    if (total < recentRounds) return 0;
    
    const recentAccuracy = recentCorrect / total;
    
    // High variance in reaction times = struggling
    const varianceAdjustment = this.metrics.reactionVariance > 500 ? -0.1 : 0;
    
    // Recent accuracy adjustments
    let accuracyAdjustment = 0;
    if (recentAccuracy > 0.85) accuracyAdjustment = 0.15;
    else if (recentAccuracy > 0.7) accuracyAdjustment = 0.05;
    else if (recentAccuracy < 0.4) accuracyAdjustment = -0.2;
    else if (recentAccuracy < 0.55) accuracyAdjustment = -0.1;
    
    // Hesitation adjustment
    const hesitationRate = this.metrics.hesitationCounts / Math.max(total, 1);
    const hesitationAdjustment = hesitationRate > 0.5 ? -0.15 : 0;
    
    return accuracyAdjustment + varianceAdjustment + hesitationAdjustment;
  }
  
  private calculateReactionVariance(): void {
    if (this.metrics.reactionTimes.length < 3) {
      this.metrics.reactionVariance = 0;
      return;
    }
    
    const times = this.metrics.reactionTimes;
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    const squaredDiffs = times.map(t => Math.pow(t - mean, 2));
    this.metrics.reactionVariance = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / times.length);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // FATIGUE & FRUSTRATION DETECTION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private updateFatigueLevels(isCorrect: boolean, reactionTime: number): void {
    const sessionMinutes = this.metrics.totalActiveTime / 60000;
    
    // Fatigue increases with time
    const timeFatigue = Math.min(sessionMinutes / ABSOLUTE_MAX_SESSION, 1);
    
    // Fatigue increases with high reaction variance
    const varianceFatigue = Math.min(this.metrics.reactionVariance / 1000, 0.5);
    
    // Update fatigue (slow increase, slow decrease)
    this.metrics.fatigueLevel = Math.min(1, 
      this.metrics.fatigueLevel * 0.95 + (timeFatigue + varianceFatigue) * 0.05
    );
    
    // Frustration from errors
    if (!isCorrect) {
      this.metrics.frustrationLevel = Math.min(1, this.metrics.frustrationLevel + 0.15);
    } else {
      this.metrics.frustrationLevel = Math.max(0, this.metrics.frustrationLevel - 0.08);
    }
    
    // Frustration from slow reactions
    const avgReaction = this.metrics.reactionTimes.length > 0
      ? this.metrics.reactionTimes.reduce((a, b) => a + b, 0) / this.metrics.reactionTimes.length
      : 1000;
    if (reactionTime > avgReaction * 1.5) {
      this.metrics.frustrationLevel = Math.min(1, this.metrics.frustrationLevel + 0.05);
    }
    
    // Update engagement (inverse relationship with fatigue/frustration)
    const baseEngagement = isCorrect ? 0.8 : 0.6;
    this.metrics.engagementLevel = 
      baseEngagement * (1 - this.metrics.fatigueLevel * 0.5) * (1 - this.metrics.frustrationLevel * 0.3);
    
    // Animate fatigue overlay
    Animated.timing(sessionAnimations.fatigueOverlay, {
      toValue: this.metrics.fatigueLevel * 0.3,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SESSION CAPS & OPTIMAL ENDING
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private checkSessionEnd(): { shouldEnd: boolean; reason?: string } {
    const sessionMinutes = this.metrics.totalActiveTime / 60000;
    
    // Check absolute maximum
    if (sessionMinutes >= ABSOLUTE_MAX_SESSION) {
      return {
        shouldEnd: true,
        reason: 'Your mind has worked deeply today. Rest now to consolidate.',
      };
    }
    
    // Check optimal play window
    if (sessionMinutes >= OPTIMAL_SESSION_MIN && !this.metrics.optimalPlayReached) {
      // Check if performance is starting to decline
      const recentPerformance = this.getRecentPerformanceTrend();
      
      if (recentPerformance === 'declining' || this.metrics.fatigueLevel > 0.6) {
        this.metrics.optimalPlayReached = true;
        return {
          shouldEnd: true,
          reason: 'Your mind has adapted enough for today. Return tomorrow stronger.',
        };
      }
    }
    
    // Check frustration cap
    if (this.metrics.frustrationLevel > 0.85) {
      return {
        shouldEnd: true,
        reason: 'Challenge accepted. Step back, breathe. Return when ready.',
      };
    }
    
    // Optimal window passed, suggest ending
    if (sessionMinutes >= OPTIMAL_SESSION_MAX && !this.metrics.optimalPlayReached) {
      this.metrics.optimalPlayReached = true;
      return {
        shouldEnd: true,
        reason: 'You\'ve reached a natural stopping point. Your progress is saved.',
      };
    }
    
    return { shouldEnd: false };
  }
  
  private getRecentPerformanceTrend(): 'improving' | 'stable' | 'declining' {
    if (this.metrics.adaptationHistory.length < 5) return 'stable';
    
    const recent = this.metrics.adaptationHistory.slice(-5);
    const oldAvg = (recent[0].difficulty + recent[1].difficulty) / 2;
    const newAvg = (recent[3].difficulty + recent[4].difficulty) / 2;
    
    if (newAvg > oldAvg + 0.3) return 'improving';
    if (newAvg < oldAvg - 0.3) return 'declining';
    return 'stable';
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // FEEDBACK GENERATION (Non-manipulative)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private generateSubtleFeedback(isCorrect: boolean): string | undefined {
    // Only generate feedback occasionally
    if (Math.random() > 0.3) return undefined;
    
    const phase = this.metrics.currentPhase;
    
    if (phase === 'reflection') {
      return this.generateReflectionInsight();
    }
    
    // No "good job!" or "try again!" - just observations
    return undefined;
  }
  
  private generateReflectionInsight(): string {
    const accuracy = this.metrics.correctResponses / Math.max(this.metrics.roundsCompleted, 1);
    const avgReaction = this.metrics.reactionTimes.length > 0
      ? this.metrics.reactionTimes.reduce((a, b) => a + b, 0) / this.metrics.reactionTimes.length
      : 0;
    
    const insights: string[] = [];
    
    // Performance insights (descriptive, not praising)
    if (accuracy > 0.8) {
      insights.push('Pattern recognition is sharp.');
    } else if (accuracy > 0.6) {
      insights.push('Attention is focusing.');
    } else {
      insights.push('Observation deepens with practice.');
    }
    
    // Reaction insights
    if (this.metrics.reactionVariance < 200) {
      insights.push('Response timing is consistent.');
    } else if (this.metrics.reactionVariance > 500) {
      insights.push('Reaction speed varies - normal under new challenges.');
    }
    
    // Error pattern insights
    if (this.metrics.errorPatterns.size > 0) {
      const mostCommonError = [...this.metrics.errorPatterns.entries()]
        .sort((a, b) => b[1] - a[1])[0];
      if (mostCommonError[1] >= 3) {
        insights.push(`Pattern noted: ${mostCommonError[0]} challenges require more attention.`);
      }
    }
    
    return insights[Math.floor(Math.random() * insights.length)];
  }
  
  generateSessionSummary(): {
    description: string;
    cognitiveChanges: string[];
    suggestions: string[];
  } {
    const accuracy = this.metrics.correctResponses / Math.max(this.metrics.roundsCompleted, 1);
    const sessionMinutes = Math.round(this.metrics.totalActiveTime / 60000);
    
    const description = `${sessionMinutes} minutes of focused practice. ${this.metrics.roundsCompleted} challenges completed.`;
    
    const cognitiveChanges: string[] = [];
    
    // Reaction time analysis
    if (this.metrics.reactionTimes.length >= 5) {
      const firstHalf = this.metrics.reactionTimes.slice(0, Math.floor(this.metrics.reactionTimes.length / 2));
      const secondHalf = this.metrics.reactionTimes.slice(Math.floor(this.metrics.reactionTimes.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg < firstAvg * 0.85) {
        cognitiveChanges.push('Reaction speed improved through the session.');
      } else if (secondAvg > firstAvg * 1.15) {
        cognitiveChanges.push('Fatigue affected reaction time toward the end.');
      } else {
        cognitiveChanges.push('Consistent response timing throughout.');
      }
    }
    
    // Accuracy analysis
    if (accuracy > 0.75) {
      cognitiveChanges.push('Strong pattern recognition under varying conditions.');
    } else if (accuracy > 0.5) {
      cognitiveChanges.push('Developing understanding of complex rule patterns.');
    } else {
      cognitiveChanges.push('Exploring new cognitive territory - errors are learning.');
    }
    
    // Suggestions (not manipulative)
    const suggestions: string[] = [];
    
    if (this.metrics.fatigueLevel > 0.5) {
      suggestions.push('Rest enhances consolidation. Return tomorrow.');
    } else if (sessionMinutes < OPTIMAL_SESSION_MIN) {
      suggestions.push('Brief session complete. Longer sessions deepen learning.');
    } else {
      suggestions.push('Optimal session length reached. Progress is natural.');
    }
    
    return { description, cognitiveChanges, suggestions };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // GETTERS & UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getMetrics(): SessionMetrics {
    return { ...this.metrics };
  }
  
  getCurrentPhase(): WavePhase {
    return this.metrics.currentPhase;
  }
  
  getCurrentStage(): CognitiveStage {
    return this.metrics.cognitiveStage;
  }
  
  getDifficulty(): number {
    return this.metrics.currentDifficulty;
  }
  
  getStageUnlocks(): StageUnlocks {
    return COGNITIVE_STAGES[this.metrics.cognitiveStage].unlocks;
  }
  
  getPhaseDescription(): string {
    return WAVE_PHASES[this.metrics.currentPhase].description;
  }
  
  subscribe(listener: (metrics: SessionMetrics) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getMetrics()));
  }
  
  reset(): void {
    this.metrics = this.createInitialMetrics();
    this.waveStartRound = 0;
    this.currentPhaseIndex = 0;
    // Don't reset totalLifetimeRounds - that's persistent
    this.notifyListeners();
  }
  
  // For persistence
  setLifetimeRounds(rounds: number): void {
    this.totalLifetimeRounds = rounds;
  }
  
  getLifetimeRounds(): number {
    return this.totalLifetimeRounds;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export const sessionFlow = new SessionFlowEngine();
export default SessionFlowEngine;
