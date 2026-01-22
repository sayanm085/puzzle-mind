// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 ADAPTIVE INTELLIGENCE SYSTEM
// "The game knows how you think."
// ═══════════════════════════════════════════════════════════════════════════════

import { RuleCategory } from './ElitePuzzleEngine';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface CognitiveFingerprint {
  // Core dimensions (0-100)
  perception: number;
  spatial: number;
  logic: number;
  temporal: number;
  meta: number;
  
  // Behavioral tendencies
  impulsivityBias: number;      // -1 (deliberate) to 1 (impulsive)
  riskTolerance: number;        // 0 (cautious) to 1 (bold)
  adaptationRate: number;       // How fast they learn new rules
  consistencyScore: number;     // Performance variance
  peakTimeOfDay: number;        // 0-23 hours
  optimalSessionLength: number; // Minutes before fatigue
  
  // Weakness/strength detection
  weakestDomain: RuleCategory;
  strongestDomain: RuleCategory;
  trapSusceptibility: number;   // How often they fall for traps
  patternBlindSpots: string[];  // Specific patterns they miss
}

export interface AdaptiveParameters {
  // Puzzle generation
  baseDifficulty: number;
  domainWeighting: Record<RuleCategory, number>;
  trapDensity: number;
  ruleComplexity: number;
  temporalPressure: number;
  
  // Timing
  observationTime: number;
  actionTime: number;
  elementAppearanceDelay: number;
  
  // Deception
  falseAffordanceLevel: number;
  misdirectionIntensity: number;
  ruleInversionProbability: number;
  
  // Emotional modulation
  silenceProbability: number;
  tensionBuildRate: number;
  reliefIntensity: number;
}

export interface PerformanceSignal {
  timestamp: number;
  roundNumber: number;
  accuracy: number;
  averageResponseTime: number;
  impulsiveActionRate: number;
  trapsFallen: number;
  rulesAdapted: number;
  emotionalState: 'calm' | 'focused' | 'frustrated' | 'fatigued' | 'flow';
}

// ─────────────────────────────────────────────────────────────────────────────────
// ADAPTIVE INTELLIGENCE ENGINE
// ─────────────────────────────────────────────────────────────────────────────────

class AdaptiveIntelligence {
  private fingerprint: CognitiveFingerprint;
  private parameters: AdaptiveParameters;
  private performanceHistory: PerformanceSignal[] = [];
  private sessionStart: number = Date.now();
  private lastAdaptation: number = Date.now();
  
  // Sliding windows for analysis
  private recentWindow: number = 5;  // Last 5 rounds
  private mediumWindow: number = 20; // Last 20 rounds
  
  constructor() {
    this.fingerprint = this.createDefaultFingerprint();
    this.parameters = this.createDefaultParameters();
  }
  
  private createDefaultFingerprint(): CognitiveFingerprint {
    return {
      perception: 50,
      spatial: 50,
      logic: 50,
      temporal: 50,
      meta: 50,
      impulsivityBias: 0,
      riskTolerance: 0.5,
      adaptationRate: 0.5,
      consistencyScore: 0.5,
      peakTimeOfDay: 14, // 2 PM default
      optimalSessionLength: 15,
      weakestDomain: 'temporal',
      strongestDomain: 'perception',
      trapSusceptibility: 0.3,
      patternBlindSpots: [],
    };
  }
  
  private createDefaultParameters(): AdaptiveParameters {
    return {
      baseDifficulty: 3,
      domainWeighting: {
        perception: 0.3,
        spatial: 0.25,
        logic: 0.25,
        temporal: 0.15,
        meta: 0.05,
      },
      trapDensity: 0.15,
      ruleComplexity: 1,
      temporalPressure: 0.5,
      observationTime: 2000,
      actionTime: 12000,
      elementAppearanceDelay: 100,
      falseAffordanceLevel: 0.2,
      misdirectionIntensity: 0.1,
      ruleInversionProbability: 0,
      silenceProbability: 0.1,
      tensionBuildRate: 0.5,
      reliefIntensity: 0.5,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SIGNAL PROCESSING - Learn from every action
  // ═══════════════════════════════════════════════════════════════════════════════
  
  recordPerformance(signal: PerformanceSignal): void {
    this.performanceHistory.push(signal);
    
    // Trim old history
    if (this.performanceHistory.length > 100) {
      this.performanceHistory = this.performanceHistory.slice(-100);
    }
    
    // Update fingerprint
    this.updateFingerprint(signal);
    
    // Check if adaptation is needed
    if (this.shouldAdapt()) {
      this.adaptParameters();
    }
  }
  
  private updateFingerprint(signal: PerformanceSignal): void {
    const learningRate = 0.1;
    
    // Update impulsivity bias
    if (signal.impulsiveActionRate > 0.5) {
      this.fingerprint.impulsivityBias = this.lerp(
        this.fingerprint.impulsivityBias,
        1,
        learningRate
      );
    } else if (signal.impulsiveActionRate < 0.2) {
      this.fingerprint.impulsivityBias = this.lerp(
        this.fingerprint.impulsivityBias,
        -1,
        learningRate
      );
    }
    
    // Update trap susceptibility
    if (signal.trapsFallen > 0) {
      this.fingerprint.trapSusceptibility = this.lerp(
        this.fingerprint.trapSusceptibility,
        Math.min(1, this.fingerprint.trapSusceptibility + 0.1),
        learningRate
      );
    } else {
      this.fingerprint.trapSusceptibility = this.lerp(
        this.fingerprint.trapSusceptibility,
        Math.max(0, this.fingerprint.trapSusceptibility - 0.02),
        learningRate
      );
    }
    
    // Update adaptation rate based on rule learning
    if (signal.rulesAdapted > 0) {
      this.fingerprint.adaptationRate = this.lerp(
        this.fingerprint.adaptationRate,
        Math.min(1, this.fingerprint.adaptationRate + 0.05),
        learningRate
      );
    }
    
    // Update consistency score
    const recentAccuracies = this.performanceHistory
      .slice(-this.recentWindow)
      .map(s => s.accuracy);
    
    if (recentAccuracies.length >= 3) {
      const variance = this.calculateVariance(recentAccuracies);
      this.fingerprint.consistencyScore = this.lerp(
        this.fingerprint.consistencyScore,
        Math.max(0, 1 - variance),
        learningRate
      );
    }
    
    // Detect emotional state based on patterns
    this.detectEmotionalState();
  }
  
  private detectEmotionalState(): 'calm' | 'focused' | 'frustrated' | 'fatigued' | 'flow' {
    if (this.performanceHistory.length < 3) return 'calm';
    
    const recent = this.performanceHistory.slice(-5);
    const avgAccuracy = this.average(recent.map(s => s.accuracy));
    const avgResponseTime = this.average(recent.map(s => s.averageResponseTime));
    const consistencyTrend = this.calculateTrend(recent.map(s => s.accuracy));
    
    const sessionDuration = (Date.now() - this.sessionStart) / 60000; // Minutes
    
    // Fatigue detection
    if (sessionDuration > this.fingerprint.optimalSessionLength * 1.2) {
      if (consistencyTrend < -0.1 || avgResponseTime > 3000) {
        return 'fatigued';
      }
    }
    
    // Flow state detection
    if (avgAccuracy > 0.85 && this.fingerprint.consistencyScore > 0.7) {
      if (avgResponseTime < 2000 && avgResponseTime > 800) {
        return 'flow';
      }
    }
    
    // Frustration detection
    if (consistencyTrend < -0.2 && avgAccuracy < 0.5) {
      return 'frustrated';
    }
    
    // Focused state
    if (avgAccuracy > 0.7 && consistencyTrend >= 0) {
      return 'focused';
    }
    
    return 'calm';
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ADAPTATION - The game responds
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private shouldAdapt(): boolean {
    const timeSinceLastAdaptation = Date.now() - this.lastAdaptation;
    const roundsSinceLastAdaptation = this.performanceHistory.filter(
      s => s.timestamp > this.lastAdaptation
    ).length;
    
    // Adapt every 3 rounds or every 2 minutes
    return roundsSinceLastAdaptation >= 3 || timeSinceLastAdaptation > 120000;
  }
  
  private adaptParameters(): void {
    this.lastAdaptation = Date.now();
    
    const recentPerformance = this.performanceHistory.slice(-this.recentWindow);
    if (recentPerformance.length === 0) return;
    
    const avgAccuracy = this.average(recentPerformance.map(s => s.accuracy));
    const emotionalState = this.detectEmotionalState();
    
    // ─── Difficulty Adjustment ───
    if (avgAccuracy > 0.85) {
      // Too easy - increase challenge
      this.parameters.baseDifficulty = Math.min(10, this.parameters.baseDifficulty + 0.5);
      this.parameters.trapDensity = Math.min(0.4, this.parameters.trapDensity + 0.05);
      this.parameters.ruleComplexity = Math.min(5, this.parameters.ruleComplexity + 0.3);
    } else if (avgAccuracy < 0.5) {
      // Too hard - reduce challenge
      this.parameters.baseDifficulty = Math.max(1, this.parameters.baseDifficulty - 0.5);
      this.parameters.trapDensity = Math.max(0.05, this.parameters.trapDensity - 0.05);
      this.parameters.ruleComplexity = Math.max(1, this.parameters.ruleComplexity - 0.3);
    }
    
    // ─── Temporal Pressure Adjustment ───
    if (this.fingerprint.impulsivityBias > 0.5) {
      // Player is impulsive - give them more time to encourage deliberation
      this.parameters.actionTime = Math.min(20000, this.parameters.actionTime + 1000);
      this.parameters.observationTime = Math.min(4000, this.parameters.observationTime + 500);
    } else if (this.fingerprint.impulsivityBias < -0.3) {
      // Player is deliberate - can handle more pressure
      this.parameters.actionTime = Math.max(8000, this.parameters.actionTime - 500);
      this.parameters.temporalPressure = Math.min(1, this.parameters.temporalPressure + 0.1);
    }
    
    // ─── Trap Density Adjustment ───
    if (this.fingerprint.trapSusceptibility > 0.5) {
      // Player falls for traps often - teach them
      this.parameters.trapDensity = Math.min(0.35, this.parameters.trapDensity + 0.05);
      this.parameters.falseAffordanceLevel = Math.min(0.5, this.parameters.falseAffordanceLevel + 0.05);
    }
    
    // ─── Domain Weighting ───
    this.updateDomainWeighting();
    
    // ─── Emotional State Response ───
    switch (emotionalState) {
      case 'frustrated':
        // Back off significantly
        this.parameters.baseDifficulty = Math.max(1, this.parameters.baseDifficulty - 1);
        this.parameters.silenceProbability = 0.2; // More breathing room
        this.parameters.trapDensity = Math.max(0.05, this.parameters.trapDensity - 0.1);
        break;
        
      case 'fatigued':
        // Signal end of session
        this.parameters.reliefIntensity = 1; // Strong positive feedback
        this.parameters.temporalPressure = 0.3; // Less time pressure
        break;
        
      case 'flow':
        // Maintain the zone - subtle increases only
        this.parameters.baseDifficulty += 0.1;
        this.parameters.silenceProbability = 0.05; // Minimize interruption
        break;
        
      case 'focused':
        // Good state - can introduce complexity
        this.parameters.ruleInversionProbability = Math.min(0.3, 
          this.parameters.ruleInversionProbability + 0.05);
        break;
    }
  }
  
  private updateDomainWeighting(): void {
    // Identify weakest domain and increase its weight (challenge weakness)
    const domainScores: Record<RuleCategory, number> = {
      perception: this.fingerprint.perception,
      spatial: this.fingerprint.spatial,
      logic: this.fingerprint.logic,
      temporal: this.fingerprint.temporal,
      meta: this.fingerprint.meta,
    };
    
    const sortedDomains = (Object.entries(domainScores) as [RuleCategory, number][])
      .sort((a, b) => a[1] - b[1]);
    
    this.fingerprint.weakestDomain = sortedDomains[0][0];
    this.fingerprint.strongestDomain = sortedDomains[sortedDomains.length - 1][0];
    
    // 40% focus on weakness, 30% on strength, 30% distributed
    const totalWeight = 1;
    const weaknessWeight = 0.4;
    const strengthWeight = 0.3;
    const otherWeight = (totalWeight - weaknessWeight - strengthWeight) / 3;
    
    for (const domain of Object.keys(this.parameters.domainWeighting) as RuleCategory[]) {
      if (domain === this.fingerprint.weakestDomain) {
        this.parameters.domainWeighting[domain] = weaknessWeight;
      } else if (domain === this.fingerprint.strongestDomain) {
        this.parameters.domainWeighting[domain] = strengthWeight;
      } else {
        this.parameters.domainWeighting[domain] = otherWeight;
      }
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // GETTERS - Expose state for puzzle generation
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getParameters(): AdaptiveParameters {
    return { ...this.parameters };
  }
  
  getFingerprint(): CognitiveFingerprint {
    return { ...this.fingerprint };
  }
  
  getNextPuzzleBias(): RuleCategory {
    // Use weighted random selection based on domain weighting
    const weights = this.parameters.domainWeighting;
    const random = Math.random();
    let cumulative = 0;
    
    for (const [domain, weight] of Object.entries(weights) as [RuleCategory, number][]) {
      cumulative += weight;
      if (random <= cumulative) {
        return domain;
      }
    }
    
    return 'perception';
  }
  
  getDifficultyForNextPuzzle(): number {
    // Add slight variance to prevent predictability
    const variance = (Math.random() - 0.5) * 1;
    return Math.max(1, Math.min(10, this.parameters.baseDifficulty + variance));
  }
  
  shouldTriggerSilence(): boolean {
    return Math.random() < this.parameters.silenceProbability;
  }
  
  shouldInvertRule(): boolean {
    return Math.random() < this.parameters.ruleInversionProbability;
  }
  
  getEmotionalState(): 'calm' | 'focused' | 'frustrated' | 'fatigued' | 'flow' {
    return this.detectEmotionalState();
  }
  
  // Session insights for reflection screen
  generateSessionInsight(): string {
    const state = this.detectEmotionalState();
    const accuracy = this.average(
      this.performanceHistory.slice(-10).map(s => s.accuracy)
    );
    
    const insights = {
      flow: [
        'You entered a state of deep focus today.',
        'The patterns revealed themselves clearly.',
        'Your mind found its rhythm.',
      ],
      focused: [
        'Concentration held steady.',
        'Your awareness sharpened through the session.',
        'Deliberate actions, measured progress.',
      ],
      frustrated: [
        'Resistance met. Growth follows.',
        'The challenge exposed edges to refine.',
        'Difficulty reveals, not defeats.',
      ],
      fatigued: [
        'Rest now. Return stronger.',
        'The mind has limits. Honor them.',
        'Quality diminishes past capacity.',
      ],
      calm: [
        'A measured session. Neither peak nor valley.',
        'Consistency is its own achievement.',
        'The baseline holds.',
      ],
    };
    
    const stateInsights = insights[state];
    return stateInsights[Math.floor(Math.random() * stateInsights.length)];
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════════
  
  private lerp(current: number, target: number, rate: number): number {
    return current + (target - current) * rate;
  }
  
  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const avg = this.average(values);
    const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
    return this.average(squaredDiffs);
  }
  
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    // Simple linear regression slope
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }
  
  // Reset for new session
  startNewSession(): void {
    this.sessionStart = Date.now();
    this.performanceHistory = [];
    // Keep fingerprint and parameters - they persist across sessions
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export const adaptiveIntelligence = new AdaptiveIntelligence();
export default AdaptiveIntelligence;
