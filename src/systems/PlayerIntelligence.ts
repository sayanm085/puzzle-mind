// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 PLAYER INTELLIGENCE ENGINE - Behavioral Analysis & Tracking
// ═══════════════════════════════════════════════════════════════════════════════

import { ChallengeType, PlayerBehaviorProfile, RoundBehavior, ErrorPattern, SkillVector } from '../types';

export class PlayerIntelligenceEngine {
  private roundHistory: RoundBehavior[] = [];
  private errorPatterns: ErrorPattern[] = [];
  private challengeHistory: Map<ChallengeType, { correct: number; total: number }> = new Map();
  private sessionStartTime: number = Date.now();
  private positionTapHistory: { x: number; y: number }[] = [];
  
  // Current session stats
  private currentStreak: number = 0;
  private longestStreak: number = 0;
  private totalCorrect: number = 0;
  private totalAttempts: number = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.roundHistory = [];
    this.errorPatterns = [];
    this.challengeHistory = new Map();
    this.sessionStartTime = Date.now();
    this.positionTapHistory = [];
    this.currentStreak = 0;
    this.longestStreak = 0;
    this.totalCorrect = 0;
    this.totalAttempts = 0;
  }

  recordRound(behavior: RoundBehavior): void {
    this.roundHistory.push(behavior);
    this.totalAttempts++;

    // Update challenge-specific stats
    const existing = this.challengeHistory.get(behavior.challengeType) || { correct: 0, total: 0 };
    existing.total++;
    if (behavior.wasCorrect) {
      existing.correct++;
      this.totalCorrect++;
      this.currentStreak++;
      this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
    } else {
      this.currentStreak = 0;
      this.recordError(behavior);
    }
    this.challengeHistory.set(behavior.challengeType, existing);

    // Track position bias
    if (behavior.selectedPosition) {
      this.positionTapHistory.push(behavior.selectedPosition);
    }
  }

  private recordError(behavior: RoundBehavior): void {
    const error: ErrorPattern = {
      challengeType: behavior.challengeType,
      responseTime: behavior.responseTime,
      timestamp: Date.now(),
      correctPosition: behavior.correctPosition,
      selectedPosition: behavior.selectedPosition,
      shapeContext: behavior.shapeContext,
    };
    this.errorPatterns.push(error);
  }

  getProfile(): PlayerBehaviorProfile {
    const recentRounds = this.roundHistory.slice(-10);
    const allTimes = this.roundHistory.map(r => r.responseTime);
    const recentTimes = recentRounds.map(r => r.responseTime);

    // Calculate skill vectors
    const skillVector = this.calculateSkillVector();
    
    // Calculate position bias
    const positionBias = this.calculatePositionBias();

    // Calculate recent accuracy
    const recentCorrect = recentRounds.filter(r => r.wasCorrect).length;
    const recentAccuracy = recentRounds.length > 0 ? recentCorrect / recentRounds.length : 0;

    // Calculate challenge-specific accuracy
    const challengeAccuracy: Record<string, number> = {};
    this.challengeHistory.forEach((stats, challenge) => {
      challengeAccuracy[challenge] = stats.total > 0 ? stats.correct / stats.total : 0;
    });

    // Calculate response time variance
    const avgTime = this.average(allTimes);
    const variance = allTimes.length > 1 
      ? allTimes.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / allTimes.length 
      : 0;

    return {
      averageResponseTime: avgTime,
      responseTimeVariance: variance,
      recentResponseTime: this.average(recentTimes),
      accuracy: this.totalAttempts > 0 ? this.totalCorrect / this.totalAttempts : 0,
      recentAccuracy,
      challengeAccuracy,
      skillVector,
      positionBias,
      errorPatterns: this.errorPatterns.slice(-20),
      totalRounds: this.totalAttempts,
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      sessionDuration: Date.now() - this.sessionStartTime,
      preferredChallenges: this.getPreferredChallenges(),
      struggleChallenges: this.getStruggleChallenges(),
    };
  }

  private calculateSkillVector(): SkillVector {
    const domains = {
      visual: ['largestShape', 'smallestShape', 'brightestColor', 'darkestColor', 'colorGradient', 'uniqueColor'],
      spatial: ['leftMost', 'rightMost', 'topMost', 'bottomMost', 'centerMost', 'mostIsolated', 'mostCrowded', 'diagonal'],
      logical: ['oddOneOut', 'countBased', 'patternBreaker', 'exclusion', 'majority'],
      temporal: ['firstAppeared', 'lastAppeared', 'flickering', 'pulsing', 'colorShift'],
    };

    const calculateDomainScore = (challenges: string[]): number => {
      let totalWeight = 0;
      let weightedScore = 0;
      
      challenges.forEach(c => {
        const stats = this.challengeHistory.get(c as ChallengeType);
        if (stats && stats.total > 0) {
          const weight = Math.min(stats.total, 10); // Cap weight at 10
          totalWeight += weight;
          weightedScore += (stats.correct / stats.total) * weight;
        }
      });

      return totalWeight > 0 ? weightedScore / totalWeight : 0.5;
    };

    return {
      visual: calculateDomainScore(domains.visual),
      spatial: calculateDomainScore(domains.spatial),
      logical: calculateDomainScore(domains.logical),
      temporal: calculateDomainScore(domains.temporal),
    };
  }

  private calculatePositionBias(): { corner: number; edge: number; center: number } {
    if (this.positionTapHistory.length === 0) {
      return { corner: 0.33, edge: 0.33, center: 0.33 };
    }

    let corner = 0, edge = 0, center = 0;
    const threshold = 0.3; // Normalized position threshold

    this.positionTapHistory.forEach(pos => {
      const isEdgeX = pos.x < threshold || pos.x > (1 - threshold);
      const isEdgeY = pos.y < threshold || pos.y > (1 - threshold);
      
      if (isEdgeX && isEdgeY) corner++;
      else if (isEdgeX || isEdgeY) edge++;
      else center++;
    });

    const total = this.positionTapHistory.length;
    return {
      corner: corner / total,
      edge: edge / total,
      center: center / total,
    };
  }

  private getPreferredChallenges(): ChallengeType[] {
    const sorted = Array.from(this.challengeHistory.entries())
      .filter(([_, stats]) => stats.total >= 3)
      .map(([challenge, stats]) => ({
        challenge,
        accuracy: stats.correct / stats.total,
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    return sorted.slice(0, 3).map(s => s.challenge);
  }

  private getStruggleChallenges(): ChallengeType[] {
    const sorted = Array.from(this.challengeHistory.entries())
      .filter(([_, stats]) => stats.total >= 3)
      .map(([challenge, stats]) => ({
        challenge,
        accuracy: stats.correct / stats.total,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return sorted.slice(0, 3).map(s => s.challenge);
  }

  private average(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  // Get recent performance trend
  getTrend(): 'improving' | 'declining' | 'stable' {
    if (this.roundHistory.length < 10) return 'stable';
    
    const recent5 = this.roundHistory.slice(-5);
    const prev5 = this.roundHistory.slice(-10, -5);
    
    const recentAcc = recent5.filter(r => r.wasCorrect).length / 5;
    const prevAcc = prev5.filter(r => r.wasCorrect).length / 5;
    
    const diff = recentAcc - prevAcc;
    if (diff > 0.15) return 'improving';
    if (diff < -0.15) return 'declining';
    return 'stable';
  }

  // Get momentum score (how "hot" the player is)
  getMomentum(): number {
    const streakBonus = Math.min(this.currentStreak * 0.1, 0.5);
    const profile = this.getProfile();
    const accuracyBonus = profile.recentAccuracy * 0.3;
    const trendBonus = this.getTrend() === 'improving' ? 0.2 : this.getTrend() === 'declining' ? -0.1 : 0;
    
    return Math.min(1, Math.max(0, 0.3 + streakBonus + accuracyBonus + trendBonus));
  }
}

// Singleton instance
export const playerIntelligence = new PlayerIntelligenceEngine();
