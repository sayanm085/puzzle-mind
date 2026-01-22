// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 SCORING SYSTEM - Skill-Weighted Point Calculation
// ═══════════════════════════════════════════════════════════════════════════════

import { PlayerBehaviorProfile, ScoringConfig, ChallengeType } from '../types';
import { CHALLENGE_DEFINITIONS, getChallengeByType } from '../constants/challenges';

const DEFAULT_SCORING: ScoringConfig = {
  basePoints: 100,
  streakMultiplierMax: 3.0,
  streakMultiplierIncrement: 0.25,
  speedBonusMax: 50,
  accuracyBonusMax: 30,
  difficultyMultiplierRange: [0.8, 2.0],
  comboThreshold: 3,
  perfectRoundBonus: 200,
};

export interface ScoreBreakdownResult {
  base: number;
  streakBonus: number;
  speedBonus: number;
  accuracyBonus: number;
  difficultyBonus: number;
  comboBonus: number;
  perfectBonus: number;
  total: number;
  multiplier: number;
}

export class ScoringSystem {
  private config: ScoringConfig;
  private comboCount: number = 0;
  private roundScores: number[] = [];
  private totalScore: number = 0;

  constructor(config: Partial<ScoringConfig> = {}) {
    this.config = { ...DEFAULT_SCORING, ...config };
  }

  reset(): void {
    this.comboCount = 0;
    this.roundScores = [];
    this.totalScore = 0;
  }

  calculateScore(
    wasCorrect: boolean,
    responseTime: number,
    challengeType: ChallengeType,
    streak: number,
    profile: PlayerBehaviorProfile,
    timeLimit: number = 10
  ): ScoreBreakdownResult {
    if (!wasCorrect) {
      this.comboCount = 0;
      return this.getZeroScore();
    }

    this.comboCount++;
    
    // Base points
    const base = this.config.basePoints;

    // Streak multiplier
    const streakMultiplier = Math.min(
      1 + (streak * this.config.streakMultiplierIncrement),
      this.config.streakMultiplierMax
    );
    const streakBonus = Math.round(base * (streakMultiplier - 1));

    // Speed bonus (faster = more points)
    const timeRatio = Math.max(0, (timeLimit * 1000 - responseTime) / (timeLimit * 1000));
    const speedBonus = Math.round(this.config.speedBonusMax * timeRatio * timeRatio);

    // Accuracy bonus (based on recent performance)
    const accuracyBonus = Math.round(this.config.accuracyBonusMax * profile.recentAccuracy);

    // Difficulty bonus (based on challenge complexity)
    const challenge = getChallengeByType(challengeType);
    const complexityFactor = challenge?.complexity ?? 0.5;
    const difficultyMultiplier = this.config.difficultyMultiplierRange[0] + 
      complexityFactor * (this.config.difficultyMultiplierRange[1] - this.config.difficultyMultiplierRange[0]);
    const difficultyBonus = Math.round(base * (difficultyMultiplier - 1));

    // Combo bonus (for consecutive fast correct answers)
    const comboBonus = this.comboCount >= this.config.comboThreshold 
      ? Math.round(25 * (this.comboCount - this.config.comboThreshold + 1))
      : 0;

    // Perfect bonus (for perfect accuracy with speed)
    const perfectBonus = (profile.recentAccuracy === 1 && responseTime < timeLimit * 500) 
      ? this.config.perfectRoundBonus 
      : 0;

    const total = base + streakBonus + speedBonus + accuracyBonus + difficultyBonus + comboBonus + perfectBonus;
    
    this.roundScores.push(total);
    this.totalScore += total;

    return {
      base,
      streakBonus,
      speedBonus,
      accuracyBonus,
      difficultyBonus,
      comboBonus,
      perfectBonus,
      total,
      multiplier: streakMultiplier,
    };
  }

  private getZeroScore(): ScoreBreakdownResult {
    return {
      base: 0,
      streakBonus: 0,
      speedBonus: 0,
      accuracyBonus: 0,
      difficultyBonus: 0,
      comboBonus: 0,
      perfectBonus: 0,
      total: 0,
      multiplier: 1,
    };
  }

  getTotalScore(): number {
    return this.totalScore;
  }

  getAverageScore(): number {
    if (this.roundScores.length === 0) return 0;
    return Math.round(this.totalScore / this.roundScores.length);
  }

  getComboCount(): number {
    return this.comboCount;
  }

  // Get star rating (1-3 stars)
  getStarRating(levelTargetScore: number): number {
    const ratio = this.totalScore / levelTargetScore;
    if (ratio >= 1.5) return 3;
    if (ratio >= 1.0) return 2;
    if (ratio >= 0.5) return 1;
    return 0;
  }

  // Get performance grade
  getGrade(): string {
    const avg = this.getAverageScore();
    if (avg >= 400) return 'S+';
    if (avg >= 350) return 'S';
    if (avg >= 300) return 'A+';
    if (avg >= 250) return 'A';
    if (avg >= 200) return 'B+';
    if (avg >= 150) return 'B';
    if (avg >= 100) return 'C';
    return 'D';
  }

  // Get grade color
  getGradeColor(): string {
    const grade = this.getGrade();
    switch (grade) {
      case 'S+': return '#FFD700';
      case 'S': return '#FFA500';
      case 'A+': return '#FF6B6B';
      case 'A': return '#FF69B4';
      case 'B+': return '#00CED1';
      case 'B': return '#00BFFF';
      case 'C': return '#98FB98';
      default: return '#AAAAAA';
    }
  }
}

// Singleton instance
export const scoringSystem = new ScoringSystem();
