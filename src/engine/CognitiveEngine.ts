// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 COGNITIVE INTELLIGENCE ENGINE - Player Mind Analysis
// The game that studies, adapts, and evolves with the player
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PlayerMindModel,
  CognitiveVector,
  ReactionProfile,
  RiskProfile,
  FatigueModel,
  BehaviorSignature,
  LearningCurve,
  ChallengeType,
  PlayerMood,
  TrialRecord,
  DifficultyGenome,
  AdaptationSignal,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────────
// COGNITIVE ANALYSIS - Understanding the player's mind
// ─────────────────────────────────────────────────────────────────────────────────

class CognitiveIntelligenceEngine {
  private mindModel: PlayerMindModel;
  private sessionTrials: TrialRecord[] = [];
  private recentWindow: number = 20; // Trials to consider "recent"
  private historyWindow: number = 100; // Trials for historical analysis
  
  constructor() {
    this.mindModel = this.createDefaultMindModel();
  }
  
  private createDefaultMindModel(): PlayerMindModel {
    return {
      id: `mind_${Date.now()}`,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      
      cognitiveVector: {
        perception: 50,
        spatial: 50,
        logic: 50,
        temporal: 50,
        working_memory: 50,
        pattern_recognition: 50,
        inhibition: 50,
        flexibility: 50,
      },
      
      reactionProfile: {
        mean: 2000,
        median: 1800,
        variance: 500,
        percentile_25: 1400,
        percentile_75: 2400,
        trend: 'stable',
        fatigueSignal: 0,
      },
      
      riskProfile: {
        riskTolerance: 0.5,
        speedAccuracyTradeoff: 0,
        hesitationFrequency: 0,
        changeOfMindRate: 0,
        pressureResponse: 'neutral',
      },
      
      learningCurves: new Map(),
      
      fatigueModel: {
        sessionDuration: 0,
        roundsPlayed: 0,
        responseTimeDeviation: 0,
        accuracyDecline: 0,
        microPauseFrequency: 0,
        estimatedFatigue: 0,
        recommendedBreak: false,
        optimalSessionLength: 15 * 60 * 1000, // 15 minutes default
      },
      
      currentMood: 'curious',
      
      behaviorSignature: {
        preferredScreenRegion: { x: 0.5, y: 0.5, radius: 0.3 },
        scanPattern: 'random',
        peakPerformanceTime: 5 * 60 * 1000, // 5 minutes
        warmupRounds: 3,
        cooldownSignal: 0,
        confidenceThreshold: 0.7,
        revisionRate: 0,
        intuitionVsAnalysis: 0,
      },
      
      totalSessions: 0,
      totalTrials: 0,
      lifetimeAccuracy: 0,
      evolutionStage: 0,
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // TRIAL RECORDING - Every action is observed
  // ─────────────────────────────────────────────────────────────────────────────────
  
  recordTrial(trial: TrialRecord): void {
    this.sessionTrials.push(trial);
    this.mindModel.totalTrials++;
    this.mindModel.lastUpdated = Date.now();
    
    // Update all analysis systems
    this.updateReactionProfile();
    this.updateCognitiveVector(trial);
    this.updateLearningCurve(trial);
    this.updateRiskProfile(trial);
    this.updateFatigueModel(trial);
    this.updateBehaviorSignature(trial);
    this.inferMood();
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // REACTION TIME ANALYSIS - Speed and consistency patterns
  // ─────────────────────────────────────────────────────────────────────────────────
  
  private updateReactionProfile(): void {
    const recentTrials = this.sessionTrials.slice(-this.recentWindow);
    if (recentTrials.length < 5) return;
    
    const times = recentTrials.map(t => t.responseTime).sort((a, b) => a - b);
    
    // Calculate statistics
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    const median = times[Math.floor(times.length / 2)];
    const variance = times.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / times.length;
    const percentile_25 = times[Math.floor(times.length * 0.25)];
    const percentile_75 = times[Math.floor(times.length * 0.75)];
    
    // Detect trend
    const oldMean = this.mindModel.reactionProfile.mean;
    const trend = this.detectTrend(oldMean, mean, variance);
    
    // Detect fatigue signal (increasing variance + increasing mean)
    const fatigueSignal = this.calculateFatigueSignal(times);
    
    this.mindModel.reactionProfile = {
      mean,
      median,
      variance,
      percentile_25,
      percentile_75,
      trend,
      fatigueSignal,
    };
  }
  
  private detectTrend(
    oldValue: number,
    newValue: number,
    variance: number
  ): 'improving' | 'stable' | 'declining' | 'volatile' {
    const significantChange = Math.sqrt(variance) * 0.5;
    const change = oldValue - newValue;
    
    if (variance > oldValue * 0.5) return 'volatile';
    if (change > significantChange) return 'improving';
    if (change < -significantChange) return 'declining';
    return 'stable';
  }
  
  private calculateFatigueSignal(times: number[]): number {
    if (times.length < 10) return 0;
    
    const firstHalf = times.slice(0, Math.floor(times.length / 2));
    const secondHalf = times.slice(Math.floor(times.length / 2));
    
    const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    // Fatigue = slowing down over time
    const slowdown = (secondMean - firstMean) / firstMean;
    return Math.max(0, Math.min(1, slowdown * 2));
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // COGNITIVE VECTOR - Multi-dimensional skill tracking
  // ─────────────────────────────────────────────────────────────────────────────────
  
  private updateCognitiveVector(trial: TrialRecord): void {
    const domain = this.getChallengeTypeDomain(trial.challengeType);
    const performance = this.calculateTrialPerformance(trial);
    const learningRate = 0.1; // How quickly we update beliefs
    
    // Update the relevant cognitive dimension
    const cogVec = this.mindModel.cognitiveVector;
    
    switch (domain) {
      case 'perception':
        cogVec.perception = this.smoothUpdate(cogVec.perception, performance, learningRate);
        break;
      case 'spatial':
        cogVec.spatial = this.smoothUpdate(cogVec.spatial, performance, learningRate);
        break;
      case 'logic':
        cogVec.logic = this.smoothUpdate(cogVec.logic, performance, learningRate);
        break;
      case 'temporal':
        cogVec.temporal = this.smoothUpdate(cogVec.temporal, performance, learningRate);
        break;
    }
    
    // Update meta-cognitive skills
    if (trial.correct) {
      cogVec.working_memory = this.smoothUpdate(cogVec.working_memory, performance * 0.5, learningRate * 0.5);
    }
    
    // Pattern recognition improves with streaks
    const recentCorrect = this.sessionTrials.slice(-5).filter(t => t.correct).length;
    if (recentCorrect >= 4) {
      cogVec.pattern_recognition = this.smoothUpdate(cogVec.pattern_recognition, 80, learningRate);
    }
    
    // Inhibition = not making hasty wrong decisions
    if (!trial.correct && trial.responseTime < 1000) {
      cogVec.inhibition = this.smoothUpdate(cogVec.inhibition, 30, learningRate);
    } else if (trial.correct) {
      cogVec.inhibition = this.smoothUpdate(cogVec.inhibition, 70, learningRate * 0.5);
    }
    
    // Flexibility = handling different challenge types
    const recentTypes = new Set(this.sessionTrials.slice(-10).map(t => t.challengeType));
    if (recentTypes.size >= 3) {
      const typeAccuracy = this.sessionTrials.slice(-10).filter(t => t.correct).length / 10;
      cogVec.flexibility = this.smoothUpdate(cogVec.flexibility, typeAccuracy * 100, learningRate);
    }
  }
  
  private smoothUpdate(current: number, target: number, rate: number): number {
    return current + (target - current) * rate;
  }
  
  private calculateTrialPerformance(trial: TrialRecord): number {
    if (!trial.correct) return 20;
    
    // Base performance on speed (faster = better, up to a point)
    const speedScore = Math.max(0, 100 - (trial.responseTime / 50));
    
    // Consider difficulty
    const difficultyBonus = (trial.genome?.ruleComplexity || 0.5) * 20;
    
    return Math.min(100, speedScore + difficultyBonus);
  }
  
  private getChallengeTypeDomain(type: ChallengeType): 'perception' | 'spatial' | 'logic' | 'temporal' {
    const perceptionTypes = ['chromatic_isolation', 'luminance_peak', 'shadow_depth', 'scale_anomaly', 
                            'form_recognition', 'texture_variance', 'opacity_gradient', 'saturation_extreme',
                            'matchColor', 'matchShape', 'brightestColor', 'darkestColor', 'largestShape', 
                            'smallestShape', 'colorGradient', 'uniqueColor'];
    
    const spatialTypes = ['cardinal_extreme', 'centroid_proximity', 'isolation_index', 'cluster_density',
                         'diagonal_alignment', 'depth_ordering', 'symmetry_axis', 'boundary_distance',
                         'topMost', 'bottomMost', 'leftMost', 'rightMost', 'centerMost', 'mostIsolated', 
                         'mostCrowded', 'diagonal'];
    
    const logicTypes = ['pattern_breach', 'sequence_prediction', 'set_exclusion', 'majority_rule',
                       'inverse_logic', 'conditional_chain', 'probability_weight', 'category_bridge',
                       'oddOneOut', 'patternBreaker', 'countBased', 'exclusion', 'majority'];
    
    const temporalTypes = ['emergence_order', 'duration_estimate', 'rhythm_sync', 'velocity_comparison',
                          'phase_alignment', 'decay_prediction', 'pulse_frequency', 'temporal_memory',
                          'firstAppeared', 'lastAppeared', 'flickering', 'colorShift', 'pulsing'];
    
    if (perceptionTypes.includes(type)) return 'perception';
    if (spatialTypes.includes(type)) return 'spatial';
    if (logicTypes.includes(type)) return 'logic';
    if (temporalTypes.includes(type)) return 'temporal';
    
    return 'perception'; // Default
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // LEARNING CURVES - Track mastery per challenge type
  // ─────────────────────────────────────────────────────────────────────────────────
  
  private updateLearningCurve(trial: TrialRecord): void {
    const type = trial.challengeType;
    let curve = this.mindModel.learningCurves.get(type);
    
    if (!curve) {
      curve = {
        challengeType: type,
        exposures: 0,
        initialAccuracy: trial.correct ? 100 : 0,
        currentAccuracy: trial.correct ? 100 : 0,
        plateauLevel: 0,
        improvementRate: 0,
        lastExposure: Date.now(),
      };
      this.mindModel.learningCurves.set(type, curve);
    }
    
    curve.exposures++;
    curve.lastExposure = Date.now();
    
    // Calculate running accuracy for this challenge type
    const typeTrials = this.sessionTrials.filter(t => t.challengeType === type);
    const accuracy = typeTrials.filter(t => t.correct).length / typeTrials.length * 100;
    
    // Track improvement rate
    const previousAccuracy = curve.currentAccuracy;
    curve.currentAccuracy = accuracy;
    curve.improvementRate = (accuracy - previousAccuracy) / curve.exposures;
    
    // Detect plateau (accuracy stable for 5+ trials)
    if (curve.exposures >= 5 && Math.abs(curve.improvementRate) < 1) {
      curve.plateauLevel = accuracy;
    }
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // RISK PROFILE - Speed vs accuracy, hesitation, pressure response
  // ─────────────────────────────────────────────────────────────────────────────────
  
  private updateRiskProfile(trial: TrialRecord): void {
    const profile = this.mindModel.riskProfile;
    const recentTrials = this.sessionTrials.slice(-this.recentWindow);
    
    // Speed-accuracy tradeoff
    const fastTrials = recentTrials.filter(t => t.responseTime < 1500);
    const slowTrials = recentTrials.filter(t => t.responseTime >= 1500);
    
    const fastAccuracy = fastTrials.length > 0 
      ? fastTrials.filter(t => t.correct).length / fastTrials.length 
      : 0.5;
    const slowAccuracy = slowTrials.length > 0 
      ? slowTrials.filter(t => t.correct).length / slowTrials.length 
      : 0.5;
    
    // Negative = prioritizes accuracy, Positive = prioritizes speed
    profile.speedAccuracyTradeoff = this.smoothUpdate(
      profile.speedAccuracyTradeoff,
      (fastTrials.length / recentTrials.length) - 0.5,
      0.1
    );
    
    // Hesitation frequency (long pauses before answering)
    const hesitationThreshold = this.mindModel.reactionProfile.percentile_75 * 1.5;
    const hesitations = recentTrials.filter(t => t.responseTime > hesitationThreshold).length;
    profile.hesitationFrequency = hesitations / recentTrials.length;
    
    // Pressure response - how accuracy changes with high difficulty
    const highPressureTrials = recentTrials.filter(t => 
      t.genome && t.genome.ruleComplexity > 0.7
    );
    const lowPressureTrials = recentTrials.filter(t => 
      t.genome && t.genome.ruleComplexity <= 0.7
    );
    
    if (highPressureTrials.length >= 3 && lowPressureTrials.length >= 3) {
      const highAccuracy = highPressureTrials.filter(t => t.correct).length / highPressureTrials.length;
      const lowAccuracy = lowPressureTrials.filter(t => t.correct).length / lowPressureTrials.length;
      
      if (highAccuracy > lowAccuracy * 1.1) {
        profile.pressureResponse = 'thrives';
      } else if (highAccuracy < lowAccuracy * 0.8) {
        profile.pressureResponse = 'struggles';
      } else {
        profile.pressureResponse = 'neutral';
      }
    }
    
    // Risk tolerance - willingness to guess quickly
    profile.riskTolerance = this.smoothUpdate(
      profile.riskTolerance,
      fastAccuracy > 0.6 ? 0.7 : 0.3,
      0.05
    );
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // FATIGUE MODEL - Detecting mental exhaustion
  // ─────────────────────────────────────────────────────────────────────────────────
  
  private updateFatigueModel(trial: TrialRecord): void {
    const fatigue = this.mindModel.fatigueModel;
    const sessionStart = this.sessionTrials[0]?.timestamp || Date.now();
    
    fatigue.sessionDuration = Date.now() - sessionStart;
    fatigue.roundsPlayed = this.sessionTrials.length;
    
    // Response time deviation (increasing deviation = fatigue)
    const recentTimes = this.sessionTrials.slice(-10).map(t => t.responseTime);
    const mean = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
    fatigue.responseTimeDeviation = Math.sqrt(
      recentTimes.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / recentTimes.length
    ) / mean;
    
    // Accuracy decline
    if (this.sessionTrials.length >= 20) {
      const firstHalf = this.sessionTrials.slice(0, 10);
      const lastHalf = this.sessionTrials.slice(-10);
      
      const firstAccuracy = firstHalf.filter(t => t.correct).length / 10;
      const lastAccuracy = lastHalf.filter(t => t.correct).length / 10;
      
      fatigue.accuracyDecline = Math.max(0, firstAccuracy - lastAccuracy);
    }
    
    // Estimate overall fatigue (0-1)
    fatigue.estimatedFatigue = Math.min(1, 
      (fatigue.sessionDuration / (20 * 60 * 1000)) * 0.3 + // Time component
      fatigue.responseTimeDeviation * 0.3 +                 // Consistency component
      fatigue.accuracyDecline * 0.4                         // Performance component
    );
    
    // Recommend break if fatigue is high
    fatigue.recommendedBreak = fatigue.estimatedFatigue > 0.7;
    
    // Update optimal session length based on when performance peaked
    if (fatigue.accuracyDecline > 0.1 && fatigue.optimalSessionLength > fatigue.sessionDuration) {
      fatigue.optimalSessionLength = fatigue.sessionDuration * 0.8;
    }
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // BEHAVIOR SIGNATURE - Unique player fingerprint
  // ─────────────────────────────────────────────────────────────────────────────────
  
  private updateBehaviorSignature(trial: TrialRecord): void {
    const sig = this.mindModel.behaviorSignature;
    
    // Update preferred screen region based on tap positions
    if (trial.position) {
      sig.preferredScreenRegion.x = this.smoothUpdate(sig.preferredScreenRegion.x, trial.position.x, 0.05);
      sig.preferredScreenRegion.y = this.smoothUpdate(sig.preferredScreenRegion.y, trial.position.y, 0.05);
    }
    
    // Detect scan pattern from position sequences
    const recentPositions = this.sessionTrials.slice(-10)
      .filter(t => t.position)
      .map(t => t.position!);
    
    if (recentPositions.length >= 5) {
      sig.scanPattern = this.detectScanPattern(recentPositions);
    }
    
    // Peak performance time - when accuracy was highest
    const windowSize = 5;
    let maxAccuracy = 0;
    let peakTime = 0;
    
    for (let i = windowSize; i <= this.sessionTrials.length; i++) {
      const window = this.sessionTrials.slice(i - windowSize, i);
      const accuracy = window.filter(t => t.correct).length / windowSize;
      if (accuracy > maxAccuracy) {
        maxAccuracy = accuracy;
        peakTime = window[0].timestamp - this.sessionTrials[0].timestamp;
      }
    }
    
    if (maxAccuracy > 0.6) {
      sig.peakPerformanceTime = peakTime;
    }
    
    // Warmup rounds - how many trials until consistent accuracy
    const earlyAccuracy = this.sessionTrials.slice(0, 5).filter(t => t.correct).length / 5;
    const midAccuracy = this.sessionTrials.slice(5, 15).filter(t => t.correct).length / 10;
    
    if (midAccuracy > earlyAccuracy * 1.2) {
      sig.warmupRounds = 5;
    } else if (earlyAccuracy >= 0.6) {
      sig.warmupRounds = 0;
    }
    
    // Intuition vs analysis (fast + correct = intuitive)
    const intuitiveTrial = trial.responseTime < 1200 && trial.correct;
    const analyticTrial = trial.responseTime >= 2000 && trial.correct;
    
    if (intuitiveTrial) {
      sig.intuitionVsAnalysis = this.smoothUpdate(sig.intuitionVsAnalysis, 1, 0.1);
    } else if (analyticTrial) {
      sig.intuitionVsAnalysis = this.smoothUpdate(sig.intuitionVsAnalysis, -1, 0.1);
    }
  }
  
  private detectScanPattern(
    positions: { x: number; y: number }[]
  ): 'systematic' | 'random' | 'center-out' | 'edge-first' {
    // Calculate movement directions
    const movements: number[] = [];
    for (let i = 1; i < positions.length; i++) {
      const angle = Math.atan2(
        positions[i].y - positions[i-1].y,
        positions[i].x - positions[i-1].x
      );
      movements.push(angle);
    }
    
    // Check for systematic (consistent direction)
    const angleVariance = this.calculateVariance(movements);
    if (angleVariance < 0.5) return 'systematic';
    
    // Check for center-out pattern
    const centerDistances = positions.map(p => 
      Math.sqrt(Math.pow(p.x - 0.5, 2) + Math.pow(p.y - 0.5, 2))
    );
    const increasingDistance = centerDistances.every((d, i) => 
      i === 0 || d >= centerDistances[i-1] * 0.9
    );
    if (increasingDistance) return 'center-out';
    
    // Check for edge-first
    const edgeCount = positions.filter(p => 
      p.x < 0.2 || p.x > 0.8 || p.y < 0.2 || p.y > 0.8
    ).length;
    if (edgeCount > positions.length * 0.6) return 'edge-first';
    
    return 'random';
  }
  
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // MOOD INFERENCE - Understanding emotional state
  // ─────────────────────────────────────────────────────────────────────────────────
  
  private inferMood(): void {
    const recentTrials = this.sessionTrials.slice(-10);
    if (recentTrials.length < 5) {
      this.mindModel.currentMood = 'curious';
      return;
    }
    
    const accuracy = recentTrials.filter(t => t.correct).length / recentTrials.length;
    const avgTime = recentTrials.reduce((sum, t) => sum + t.responseTime, 0) / recentTrials.length;
    const fatigue = this.mindModel.fatigueModel.estimatedFatigue;
    const trend = this.mindModel.reactionProfile.trend;
    
    // Flow state: high accuracy + fast responses + improving trend
    if (accuracy > 0.8 && avgTime < 1500 && trend === 'improving') {
      this.mindModel.currentMood = 'flowing';
      return;
    }
    
    // Focused: high accuracy, moderate speed
    if (accuracy > 0.7 && trend !== 'declining') {
      this.mindModel.currentMood = 'focused';
      return;
    }
    
    // Determined: struggling but not slowing down
    if (accuracy < 0.6 && avgTime < this.mindModel.reactionProfile.median) {
      this.mindModel.currentMood = 'determined';
      return;
    }
    
    // Frustrated: low accuracy + volatile responses
    if (accuracy < 0.5 && trend === 'volatile') {
      this.mindModel.currentMood = 'frustrated';
      return;
    }
    
    // Fatigued: high fatigue signal
    if (fatigue > 0.6) {
      this.mindModel.currentMood = 'fatigued';
      return;
    }
    
    // Default: curious (exploration mode)
    this.mindModel.currentMood = 'curious';
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // DIFFICULTY ADAPTATION - The game adapts invisibly
  // ─────────────────────────────────────────────────────────────────────────────────
  
  generateAdaptationSignals(): AdaptationSignal[] {
    const signals: AdaptationSignal[] = [];
    const recentTrials = this.sessionTrials.slice(-10);
    
    if (recentTrials.length < 5) return signals;
    
    const accuracy = recentTrials.filter(t => t.correct).length / recentTrials.length;
    const avgTime = recentTrials.reduce((sum, t) => sum + t.responseTime, 0) / recentTrials.length;
    const targetAccuracy = 0.70; // Sweet spot for engagement
    
    // Time allocation adjustment
    if (avgTime > 3000 && accuracy > 0.6) {
      signals.push({
        metric: 'timeAllocation',
        direction: 'decrease',
        magnitude: 0.1,
        confidence: 0.8,
        reason: 'Player is comfortable, can handle more time pressure',
      });
    } else if (avgTime < 1500 && accuracy < 0.5) {
      signals.push({
        metric: 'timeAllocation',
        direction: 'increase',
        magnitude: 0.15,
        confidence: 0.7,
        reason: 'Player rushing, needs more time to think',
      });
    }
    
    // Shape population adjustment
    if (accuracy > targetAccuracy + 0.15) {
      signals.push({
        metric: 'shapePopulation',
        direction: 'increase',
        magnitude: 1,
        confidence: 0.7,
        reason: 'High accuracy suggests capacity for more shapes',
      });
    } else if (accuracy < targetAccuracy - 0.15) {
      signals.push({
        metric: 'shapePopulation',
        direction: 'decrease',
        magnitude: 1,
        confidence: 0.8,
        reason: 'Low accuracy indicates overwhelm',
      });
    }
    
    // Rule complexity based on learning curves
    const weakestDomain = this.findWeakestDomain();
    if (weakestDomain && accuracy < 0.5) {
      signals.push({
        metric: 'ruleComplexity',
        direction: 'decrease',
        magnitude: 0.1,
        confidence: 0.6,
        reason: `Struggling with ${weakestDomain} challenges`,
      });
    }
    
    // Distractor ratio based on error patterns
    if (accuracy < 0.6 && this.hasDistractorConfusion()) {
      signals.push({
        metric: 'distractorRatio',
        direction: 'decrease',
        magnitude: 0.1,
        confidence: 0.75,
        reason: 'Player confusing distractors with targets',
      });
    }
    
    // Mood-based adjustments
    if (this.mindModel.currentMood === 'frustrated') {
      signals.push({
        metric: 'ambiguityLevel',
        direction: 'decrease',
        magnitude: 0.2,
        confidence: 0.9,
        reason: 'Reducing ambiguity due to frustration',
      });
    } else if (this.mindModel.currentMood === 'flowing') {
      signals.push({
        metric: 'ruleComplexity',
        direction: 'increase',
        magnitude: 0.1,
        confidence: 0.7,
        reason: 'Player in flow, can handle more complexity',
      });
    }
    
    return signals;
  }
  
  private findWeakestDomain(): string | null {
    const cv = this.mindModel.cognitiveVector;
    const domains = ['perception', 'spatial', 'logic', 'temporal'];
    
    let weakest = domains[0];
    let lowestScore = cv.perception;
    
    domains.forEach(domain => {
      const score = cv[domain as keyof CognitiveVector];
      if (typeof score === 'number' && score < lowestScore) {
        lowestScore = score;
        weakest = domain;
      }
    });
    
    return lowestScore < 40 ? weakest : null;
  }
  
  private hasDistractorConfusion(): boolean {
    // Analyze if errors tend to be near-misses
    const recentErrors = this.sessionTrials.slice(-20).filter(t => !t.correct);
    // For now, assume confusion if error rate is high with moderate response time
    return recentErrors.length > 8;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────────────
  
  getMindModel(): PlayerMindModel {
    return this.mindModel;
  }
  
  getCognitiveVector(): CognitiveVector {
    return this.mindModel.cognitiveVector;
  }
  
  getReactionProfile(): ReactionProfile {
    return this.mindModel.reactionProfile;
  }
  
  getRiskProfile(): RiskProfile {
    return this.mindModel.riskProfile;
  }
  
  getFatigueModel(): FatigueModel {
    return this.mindModel.fatigueModel;
  }
  
  getCurrentMood(): PlayerMood {
    return this.mindModel.currentMood;
  }
  
  getBehaviorSignature(): BehaviorSignature {
    return this.mindModel.behaviorSignature;
  }
  
  getSessionStats(): {
    trials: number;
    accuracy: number;
    avgResponseTime: number;
    currentStreak: number;
    peakStreak: number;
  } {
    const trials = this.sessionTrials.length;
    const correct = this.sessionTrials.filter(t => t.correct).length;
    const avgTime = trials > 0 
      ? this.sessionTrials.reduce((sum, t) => sum + t.responseTime, 0) / trials 
      : 0;
    
    // Calculate streaks
    let currentStreak = 0;
    let peakStreak = 0;
    let tempStreak = 0;
    
    for (const trial of this.sessionTrials) {
      if (trial.correct) {
        tempStreak++;
        peakStreak = Math.max(peakStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    // Current streak is from end
    for (let i = this.sessionTrials.length - 1; i >= 0; i--) {
      if (this.sessionTrials[i].correct) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return {
      trials,
      accuracy: trials > 0 ? correct / trials : 0,
      avgResponseTime: avgTime,
      currentStreak,
      peakStreak,
    };
  }
  
  startNewSession(): void {
    this.mindModel.totalSessions++;
    this.sessionTrials = [];
    this.mindModel.fatigueModel.sessionDuration = 0;
    this.mindModel.fatigueModel.roundsPlayed = 0;
    this.mindModel.fatigueModel.estimatedFatigue = 0;
    this.mindModel.fatigueModel.recommendedBreak = false;
    this.mindModel.currentMood = 'curious';
  }
  
  exportMindModel(): string {
    return JSON.stringify({
      ...this.mindModel,
      learningCurves: Array.from(this.mindModel.learningCurves.entries()),
    });
  }
  
  importMindModel(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.mindModel = {
        ...parsed,
        learningCurves: new Map(parsed.learningCurves || []),
      };
    } catch (e) {
      console.warn('Failed to import mind model:', e);
    }
  }
}

// Singleton instance
export const cognitiveEngine = new CognitiveIntelligenceEngine();

export default cognitiveEngine;
