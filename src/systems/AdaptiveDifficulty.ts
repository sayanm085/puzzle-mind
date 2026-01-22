// ═══════════════════════════════════════════════════════════════════════════════
// 🎚️ ADAPTIVE DIFFICULTY ENGINE - Dynamic Challenge Adjustment
// ═══════════════════════════════════════════════════════════════════════════════

import { PlayerBehaviorProfile, DifficultyVector, ChallengeType } from '../types';

export interface AdaptiveConfig {
  targetSuccessRate: number;          // Target ~70% success
  adaptationSpeed: number;            // How fast difficulty adjusts
  minTimePressure: number;            // Minimum time multiplier
  maxTimePressure: number;            // Maximum time multiplier
  shapeCountRange: [number, number];  // Min/max shapes
  complexityRange: [number, number];  // Challenge complexity range
}

const DEFAULT_CONFIG: AdaptiveConfig = {
  targetSuccessRate: 0.70,
  adaptationSpeed: 0.15,
  minTimePressure: 0.6,
  maxTimePressure: 1.5,
  shapeCountRange: [3, 12],
  complexityRange: [0.2, 1.0],
};

export class AdaptiveDifficultyEngine {
  private config: AdaptiveConfig;
  private currentDifficulty: DifficultyVector;
  private successHistory: boolean[] = [];

  constructor(config: Partial<AdaptiveConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.currentDifficulty = this.getInitialDifficulty();
  }

  private getInitialDifficulty(): DifficultyVector {
    return {
      timePressure: 1.0,
      shapeCount: 4,
      challengeComplexity: 0.3,
      visualNoise: 0.1,
      distractorCount: 1,
    };
  }

  reset(): void {
    this.currentDifficulty = this.getInitialDifficulty();
    this.successHistory = [];
  }

  recordResult(wasCorrect: boolean): void {
    this.successHistory.push(wasCorrect);
    // Keep last 20 results
    if (this.successHistory.length > 20) {
      this.successHistory.shift();
    }
  }

  getRecentSuccessRate(): number {
    if (this.successHistory.length === 0) return this.config.targetSuccessRate;
    const recent = this.successHistory.slice(-10);
    return recent.filter(s => s).length / recent.length;
  }

  adapt(profile: PlayerBehaviorProfile): DifficultyVector {
    const recentSuccess = this.getRecentSuccessRate();
    const delta = recentSuccess - this.config.targetSuccessRate;
    const adjustment = delta * this.config.adaptationSpeed;

    // Adjust time pressure (inverse - higher skill = more time pressure)
    this.currentDifficulty.timePressure = this.clamp(
      this.currentDifficulty.timePressure - adjustment * 0.3,
      this.config.minTimePressure,
      this.config.maxTimePressure
    );

    // Adjust shape count based on performance
    if (Math.abs(delta) > 0.1) {
      const shapeAdjust = delta > 0 ? 1 : -1;
      this.currentDifficulty.shapeCount = Math.round(this.clamp(
        this.currentDifficulty.shapeCount + shapeAdjust,
        this.config.shapeCountRange[0],
        this.config.shapeCountRange[1]
      ));
    }

    // Adjust challenge complexity
    this.currentDifficulty.challengeComplexity = this.clamp(
      this.currentDifficulty.challengeComplexity + adjustment * 0.2,
      this.config.complexityRange[0],
      this.config.complexityRange[1]
    );

    // Adjust visual noise for advanced players
    if (profile.accuracy > 0.8 && profile.totalRounds > 20) {
      this.currentDifficulty.visualNoise = Math.min(0.4, this.currentDifficulty.visualNoise + 0.02);
    }

    // Adjust distractor count based on skill
    if (recentSuccess > 0.85) {
      this.currentDifficulty.distractorCount = Math.min(4, this.currentDifficulty.distractorCount + 1);
    } else if (recentSuccess < 0.5) {
      this.currentDifficulty.distractorCount = Math.max(0, this.currentDifficulty.distractorCount - 1);
    }

    return { ...this.currentDifficulty };
  }

  // Get time limit in seconds based on challenge and difficulty
  getTimeLimit(baseTime: number): number {
    return Math.round(baseTime * this.currentDifficulty.timePressure);
  }

  // Get shape count for current difficulty
  getShapeCount(levelBase: number): number {
    const variance = Math.random() > 0.5 ? 1 : 0;
    return Math.round(this.clamp(
      levelBase + (this.currentDifficulty.challengeComplexity - 0.5) * 2 + variance,
      this.config.shapeCountRange[0],
      this.config.shapeCountRange[1]
    ));
  }

  // Select challenge based on player profile and difficulty
  selectChallenge(availableChallenges: ChallengeType[], profile: PlayerBehaviorProfile): ChallengeType {
    if (availableChallenges.length === 0) return 'largestShape';
    if (availableChallenges.length === 1) return availableChallenges[0];

    // Weight challenges based on player's skill gaps
    const weights = availableChallenges.map(challenge => {
      const accuracy = profile.challengeAccuracy?.[challenge] ?? 0.5;
      const attempts = profile.totalRounds > 0 ? 1 : 0.5;
      
      // Slightly favor challenges player struggles with (for growth)
      // But not too much (to avoid frustration)
      const struggleWeight = accuracy < 0.5 ? 1.5 : accuracy > 0.8 ? 0.7 : 1.0;
      
      // Favor less-attempted challenges for variety
      const noveltyWeight = attempts < 5 ? 1.3 : 1.0;
      
      // Random element for surprise
      const randomWeight = 0.8 + Math.random() * 0.4;
      
      return {
        challenge,
        weight: struggleWeight * noveltyWeight * randomWeight,
      };
    });

    // Weighted random selection
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const { challenge, weight } of weights) {
      random -= weight;
      if (random <= 0) return challenge;
    }

    return availableChallenges[0];
  }

  // Get current difficulty summary
  getDifficultySummary(): string {
    const d = this.currentDifficulty;
    if (d.challengeComplexity < 0.3) return 'Warming Up';
    if (d.challengeComplexity < 0.5) return 'Getting Interesting';
    if (d.challengeComplexity < 0.7) return 'Challenging';
    if (d.challengeComplexity < 0.9) return 'Intense';
    return 'EXTREME';
  }

  // Get difficulty color
  getDifficultyColor(): string {
    const d = this.currentDifficulty;
    if (d.challengeComplexity < 0.3) return '#00FF88';
    if (d.challengeComplexity < 0.5) return '#00FFFF';
    if (d.challengeComplexity < 0.7) return '#FFD700';
    if (d.challengeComplexity < 0.9) return '#FF6B00';
    return '#FF0066';
  }

  getCurrentDifficulty(): DifficultyVector {
    return { ...this.currentDifficulty };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

// Singleton instance
export const adaptiveDifficulty = new AdaptiveDifficultyEngine();
