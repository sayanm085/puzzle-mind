// ═══════════════════════════════════════════════════════════════════════════════
// 💾 PUZZLE MIND - Persistent Data Management
// Real data, real progress, real achievements
// ═══════════════════════════════════════════════════════════════════════════════

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerMindModel } from '../types';

// ─────────────────────────────────────────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  PLAYER_MIND: '@puzzle_mind/player_mind',
  COMPLETED_CHAMBERS: '@puzzle_mind/completed_chambers',
  UNLOCKED_SECTORS: '@puzzle_mind/unlocked_sectors',
  SECTOR_PROGRESS: '@puzzle_mind/sector_progress',
  SESSION_HISTORY: '@puzzle_mind/session_history',
  GAME_SETTINGS: '@puzzle_mind/settings',
  DAILY_CHALLENGE: '@puzzle_mind/daily_challenge',
};

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface SessionRecord {
  id: string;
  timestamp: number;
  sectorId: string;
  chamberId: string;
  accuracy: number;
  responseTime: number;
  score: number;
  roundsPlayed: number;
  duration: number; // in seconds
}

export interface DailyChallengeRecord {
  date: string; // YYYY-MM-DD
  completed: boolean;
  score: number;
  bestStreak: number;
}

export interface GameSaveData {
  playerMind: PlayerMindModel;
  completedChambers: string[];
  unlockedSectors: string[];
  sectorProgress: Record<string, number>;
  sessionHistory: SessionRecord[];
  dailyChallenges: Record<string, DailyChallengeRecord>;
  lastPlayedAt: number;
  totalPlayTime: number; // in seconds
  createdAt: number;
  version: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DEFAULT VALUES
// ─────────────────────────────────────────────────────────────────────────────────

const createDefaultPlayerMind = (): PlayerMindModel => ({
  id: `mind_${Date.now()}`,
  createdAt: Date.now(),
  lastUpdated: Date.now(),
  totalSessions: 0,
  totalTrials: 0,
  lifetimeAccuracy: 0,
  evolutionStage: 1,
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
    mean: 800,
    median: 750,
    variance: 100,
    percentile_25: 600,
    percentile_75: 900,
    trend: 'stable',
    fatigueSignal: 0,
  },
  riskProfile: {
    riskTolerance: 0.5,
    speedAccuracyTradeoff: 0.5,
    hesitationFrequency: 0.2,
    changeOfMindRate: 0.1,
    pressureResponse: 'neutral',
  },
  fatigueModel: {
    sessionDuration: 0,
    roundsPlayed: 0,
    responseTimeDeviation: 0,
    accuracyDecline: 0,
    microPauseFrequency: 0,
    estimatedFatigue: 0,
    recommendedBreak: false,
    optimalSessionLength: 15,
  },
  learningCurves: new Map(),
  behaviorSignature: {
    preferredScreenRegion: { x: 0.5, y: 0.5, radius: 0.3 },
    scanPattern: 'center-out',
    peakPerformanceTime: 5,
    warmupRounds: 3,
    cooldownSignal: 0,
    confidenceThreshold: 0.7,
    revisionRate: 0.1,
    intuitionVsAnalysis: 0.5,
  },
  currentMood: 'focused',
});

const createDefaultSaveData = (): GameSaveData => ({
  playerMind: createDefaultPlayerMind(),
  completedChambers: [],
  unlockedSectors: ['genesis'],
  sectorProgress: {},
  sessionHistory: [],
  dailyChallenges: {},
  lastPlayedAt: Date.now(),
  totalPlayTime: 0,
  createdAt: Date.now(),
  version: '1.0.0',
});

// ─────────────────────────────────────────────────────────────────────────────────
// GAME STORAGE CLASS
// ─────────────────────────────────────────────────────────────────────────────────

class GameStorage {
  private cache: GameSaveData | null = null;
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private isDirty: boolean = false;

  // Initialize and load saved data
  async initialize(): Promise<GameSaveData> {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_MIND);
      
      if (savedData) {
        const parsed = JSON.parse(savedData) as GameSaveData;
        // Migrate old data if needed
        this.cache = this.migrateData(parsed);
        console.log('📂 Game data loaded:', {
          sessions: this.cache.playerMind.totalSessions,
          trials: this.cache.playerMind.totalTrials,
          accuracy: Math.round(this.cache.playerMind.lifetimeAccuracy * 100) + '%',
          chambers: this.cache.completedChambers.length,
        });
      } else {
        this.cache = createDefaultSaveData();
        console.log('🆕 New game data created');
        await this.save();
      }
      
      return this.cache;
    } catch (error) {
      console.error('❌ Failed to load game data:', error);
      this.cache = createDefaultSaveData();
      return this.cache;
    }
  }

  // Migrate old data format to new format
  private migrateData(data: Partial<GameSaveData>): GameSaveData {
    const defaultData = createDefaultSaveData();
    
    return {
      ...defaultData,
      ...data,
      playerMind: {
        ...defaultData.playerMind,
        ...data.playerMind,
        cognitiveVector: {
          ...defaultData.playerMind.cognitiveVector,
          ...data.playerMind?.cognitiveVector,
        },
        reactionProfile: {
          ...defaultData.playerMind.reactionProfile,
          ...data.playerMind?.reactionProfile,
        },
        riskProfile: {
          ...defaultData.playerMind.riskProfile,
          ...data.playerMind?.riskProfile,
        },
        fatigueModel: {
          ...defaultData.playerMind.fatigueModel,
          ...data.playerMind?.fatigueModel,
        },
        behaviorSignature: {
          ...defaultData.playerMind.behaviorSignature,
          ...data.playerMind?.behaviorSignature,
        },
        // Map doesn't serialize to JSON, so we always use a fresh Map
        learningCurves: new Map(),
      },
      completedChambers: data.completedChambers || [],
      unlockedSectors: data.unlockedSectors || ['genesis'],
      sectorProgress: data.sectorProgress || {},
      sessionHistory: data.sessionHistory || [],
      dailyChallenges: data.dailyChallenges || {},
    };
  }

  // Get current game data
  getData(): GameSaveData {
    if (!this.cache) {
      throw new Error('GameStorage not initialized. Call initialize() first.');
    }
    return this.cache;
  }

  // Get player mind
  getPlayerMind(): PlayerMindModel {
    return this.getData().playerMind;
  }

  // Save data (debounced)
  private async save(): Promise<void> {
    if (!this.cache) return;
    
    try {
      this.cache.lastPlayedAt = Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_MIND, JSON.stringify(this.cache));
      this.isDirty = false;
      console.log('💾 Game data saved');
    } catch (error) {
      console.error('❌ Failed to save game data:', error);
    }
  }

  // Schedule save (debounced to prevent too many writes)
  private scheduleSave(): void {
    this.isDirty = true;
    
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.save();
    }, 1000); // Save after 1 second of inactivity
  }

  // Force immediate save
  async forceSave(): Promise<void> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    await this.save();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SESSION RECORDING
  // ─────────────────────────────────────────────────────────────────────────────

  recordSession(session: Omit<SessionRecord, 'id' | 'timestamp'>): void {
    if (!this.cache) return;

    const record: SessionRecord = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to history (keep last 100 sessions)
    this.cache.sessionHistory.unshift(record);
    if (this.cache.sessionHistory.length > 100) {
      this.cache.sessionHistory = this.cache.sessionHistory.slice(0, 100);
    }

    // Update player mind
    this.updatePlayerMindFromSession(record);

    // Update total play time
    this.cache.totalPlayTime += session.duration;

    this.scheduleSave();
  }

  private updatePlayerMindFromSession(session: SessionRecord): void {
    if (!this.cache) return;

    const mind = this.cache.playerMind;
    const oldTrials = mind.totalTrials;
    
    // Update basic stats
    mind.totalSessions += 1;
    mind.totalTrials += session.roundsPlayed;
    mind.lastUpdated = Date.now();

    // Update lifetime accuracy (weighted average)
    if (oldTrials > 0) {
      mind.lifetimeAccuracy = 
        (mind.lifetimeAccuracy * oldTrials + session.accuracy * session.roundsPlayed) / 
        (oldTrials + session.roundsPlayed);
    } else {
      mind.lifetimeAccuracy = session.accuracy;
    }

    // Update reaction profile
    this.updateReactionProfile(session.responseTime);

    // Update cognitive vector based on chamber type
    this.updateCognitiveVector(session);

    // Update evolution stage
    this.updateEvolutionStage();

    console.log('🧠 Player mind updated:', {
      sessions: mind.totalSessions,
      trials: mind.totalTrials,
      accuracy: Math.round(mind.lifetimeAccuracy * 100) + '%',
      evolution: mind.evolutionStage,
    });
  }

  private updateReactionProfile(newResponseTime: number): void {
    if (!this.cache) return;

    const profile = this.cache.playerMind.reactionProfile;
    const history = this.cache.sessionHistory.slice(0, 20);
    
    if (history.length === 0) {
      profile.mean = newResponseTime;
      profile.median = newResponseTime;
      return;
    }

    // Calculate from recent history
    const times = history.map(s => s.responseTime).sort((a, b) => a - b);
    
    profile.mean = times.reduce((a, b) => a + b, 0) / times.length;
    profile.median = times[Math.floor(times.length / 2)];
    profile.percentile_25 = times[Math.floor(times.length * 0.25)] || times[0];
    profile.percentile_75 = times[Math.floor(times.length * 0.75)] || times[times.length - 1];
    
    // Calculate variance
    const squareDiffs = times.map(t => Math.pow(t - profile.mean, 2));
    profile.variance = Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / times.length);

    // Determine trend
    if (history.length >= 5) {
      const recentAvg = history.slice(0, 5).reduce((a, b) => a + b.responseTime, 0) / 5;
      const olderAvg = history.slice(5, 10).reduce((a, b) => a + b.responseTime, 0) / Math.min(5, history.length - 5);
      
      if (recentAvg < olderAvg * 0.95) {
        profile.trend = 'improving';
      } else if (recentAvg > olderAvg * 1.05) {
        profile.trend = 'declining';
      } else {
        profile.trend = 'stable';
      }
    }
  }

  private updateCognitiveVector(session: SessionRecord): void {
    if (!this.cache) return;

    const vector = this.cache.playerMind.cognitiveVector;
    const accuracy = session.accuracy;
    const speed = Math.max(0, 100 - session.responseTime / 20); // Convert ms to score
    
    // Small increments based on performance
    const increment = (accuracy - 0.5) * 2; // -1 to +1 based on accuracy
    const speedBonus = speed > 50 ? 0.5 : 0;
    
    // Update based on sector type
    const sectorId = session.sectorId;
    
    if (sectorId === 'genesis' || sectorId === 'prisma') {
      vector.perception = Math.min(100, Math.max(0, vector.perception + increment + speedBonus));
      vector.pattern_recognition = Math.min(100, Math.max(0, vector.pattern_recognition + increment * 0.5));
    } else if (sectorId === 'void' || sectorId === 'axiom') {
      vector.spatial = Math.min(100, Math.max(0, vector.spatial + increment + speedBonus));
      vector.logic = Math.min(100, Math.max(0, vector.logic + increment * 0.5));
    } else if (sectorId === 'chronos' || sectorId === 'temporal') {
      vector.temporal = Math.min(100, Math.max(0, vector.temporal + increment + speedBonus));
    } else if (sectorId === 'nexus') {
      vector.working_memory = Math.min(100, Math.max(0, vector.working_memory + increment + speedBonus));
      vector.flexibility = Math.min(100, Math.max(0, vector.flexibility + increment * 0.5));
    } else {
      // General improvement
      vector.perception = Math.min(100, Math.max(0, vector.perception + increment * 0.3));
      vector.logic = Math.min(100, Math.max(0, vector.logic + increment * 0.3));
    }
  }

  private updateEvolutionStage(): void {
    if (!this.cache) return;

    const mind = this.cache.playerMind;
    const vector = mind.cognitiveVector;
    
    // Calculate average cognitive score
    const avgScore = (
      vector.perception +
      vector.spatial +
      vector.logic +
      vector.temporal +
      vector.working_memory +
      vector.pattern_recognition
    ) / 6;

    // Evolution stages based on overall progress
    if (avgScore >= 90 && mind.totalSessions >= 50) {
      mind.evolutionStage = 10; // Transcendent
    } else if (avgScore >= 80 && mind.totalSessions >= 40) {
      mind.evolutionStage = 9;
    } else if (avgScore >= 75 && mind.totalSessions >= 30) {
      mind.evolutionStage = 8;
    } else if (avgScore >= 70 && mind.totalSessions >= 25) {
      mind.evolutionStage = 7;
    } else if (avgScore >= 65 && mind.totalSessions >= 20) {
      mind.evolutionStage = 6;
    } else if (avgScore >= 60 && mind.totalSessions >= 15) {
      mind.evolutionStage = 5;
    } else if (avgScore >= 55 && mind.totalSessions >= 10) {
      mind.evolutionStage = 4;
    } else if (avgScore >= 52 && mind.totalSessions >= 5) {
      mind.evolutionStage = 3;
    } else if (mind.totalSessions >= 2) {
      mind.evolutionStage = 2;
    } else {
      mind.evolutionStage = 1;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAMBER & SECTOR PROGRESS
  // ─────────────────────────────────────────────────────────────────────────────

  completeChamber(chamberId: string): void {
    if (!this.cache) return;

    if (!this.cache.completedChambers.includes(chamberId)) {
      this.cache.completedChambers.push(chamberId);
      this.scheduleSave();
    }
  }

  isChamberCompleted(chamberId: string): boolean {
    return this.cache?.completedChambers.includes(chamberId) || false;
  }

  getCompletedChambers(): string[] {
    return this.cache?.completedChambers || [];
  }

  unlockSector(sectorId: string): void {
    if (!this.cache) return;

    if (!this.cache.unlockedSectors.includes(sectorId)) {
      this.cache.unlockedSectors.push(sectorId);
      console.log('🔓 Sector unlocked:', sectorId);
      this.scheduleSave();
    }
  }

  isSectorUnlocked(sectorId: string): boolean {
    return this.cache?.unlockedSectors.includes(sectorId) || false;
  }

  getUnlockedSectors(): string[] {
    return this.cache?.unlockedSectors || ['genesis'];
  }

  updateSectorProgress(sectorId: string, progress: number): void {
    if (!this.cache) return;

    this.cache.sectorProgress[sectorId] = Math.min(1, Math.max(0, progress));
    this.scheduleSave();
  }

  getSectorProgress(sectorId: string): number {
    return this.cache?.sectorProgress[sectorId] || 0;
  }

  getAllSectorProgress(): Record<string, number> {
    return this.cache?.sectorProgress || {};
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DAILY CHALLENGES
  // ─────────────────────────────────────────────────────────────────────────────

  getTodayDateString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  recordDailyChallenge(score: number, streak: number): void {
    if (!this.cache) return;

    const today = this.getTodayDateString();
    this.cache.dailyChallenges[today] = {
      date: today,
      completed: true,
      score,
      bestStreak: streak,
    };
    this.scheduleSave();
  }

  isDailyChallengeCompleted(): boolean {
    const today = this.getTodayDateString();
    return this.cache?.dailyChallenges[today]?.completed || false;
  }

  getDailyStreak(): number {
    if (!this.cache) return 0;

    let streak = 0;
    const now = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      if (this.cache.dailyChallenges[dateString]?.completed) {
        streak++;
      } else if (i > 0) { // Allow today to not be completed yet
        break;
      }
    }
    
    return streak;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATISTICS
  // ─────────────────────────────────────────────────────────────────────────────

  getSessionHistory(limit: number = 10): SessionRecord[] {
    return this.cache?.sessionHistory.slice(0, limit) || [];
  }

  getRecentAccuracyTrend(sessions: number = 10): number[] {
    const history = this.cache?.sessionHistory.slice(0, sessions) || [];
    return history.map(s => Math.round(s.accuracy * 100)).reverse();
  }

  getAverageSessionDuration(): number {
    const history = this.cache?.sessionHistory || [];
    if (history.length === 0) return 0;
    return history.reduce((a, b) => a + b.duration, 0) / history.length;
  }

  getTotalPlayTime(): number {
    return this.cache?.totalPlayTime || 0;
  }

  getTotalPlayTimeFormatted(): string {
    const totalSeconds = this.getTotalPlayTime();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DEBUG & RESET
  // ─────────────────────────────────────────────────────────────────────────────

  async resetAllData(): Promise<void> {
    this.cache = createDefaultSaveData();
    await this.save();
    console.log('🔄 Game data reset');
  }

  async exportData(): Promise<string> {
    return JSON.stringify(this.cache, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData) as GameSaveData;
      this.cache = this.migrateData(data);
      await this.save();
      return true;
    } catch (error) {
      console.error('❌ Failed to import data:', error);
      return false;
    }
  }
}

// Singleton instance
export const gameStorage = new GameStorage();

export default gameStorage;
