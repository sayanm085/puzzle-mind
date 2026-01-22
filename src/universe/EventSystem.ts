// ═══════════════════════════════════════════════════════════════════════════════
// 🌟 MISSION & EVENT SYSTEM - Living World Events
// The world feels alive, not linear
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DailyTrial,
  WeeklyExpedition,
  MindStorm,
  CosmicEvent,
  EventType,
  ChallengeType,
  CognitiveDomain,
  DifficultyGenome,
  ChamberModifier,
  Anomaly,
} from '../types';
import { CHAMBER_MODIFIERS } from '../universe/UniverseStructure';

// ─────────────────────────────────────────────────────────────────────────────────
// DAILY TRIAL GENERATION - Fresh challenges every day
// ─────────────────────────────────────────────────────────────────────────────────

const DAILY_THEMES = [
  { name: 'Chromatic Dawn', domains: ['perception'] as CognitiveDomain[], icon: '🌅', color: '#FF6B6B' },
  { name: 'Spatial Odyssey', domains: ['spatial'] as CognitiveDomain[], icon: '🌌', color: '#4ECDC4' },
  { name: 'Logic Labyrinth', domains: ['logic'] as CognitiveDomain[], icon: '🧩', color: '#45B7D1' },
  { name: 'Temporal Tides', domains: ['temporal'] as CognitiveDomain[], icon: '⏰', color: '#96CEB4' },
  { name: 'Mind Fusion', domains: ['perception', 'spatial'] as CognitiveDomain[], icon: '🔮', color: '#DDA0DD' },
  { name: 'Cognitive Storm', domains: ['logic', 'temporal'] as CognitiveDomain[], icon: '⚡', color: '#FFD93D' },
  { name: 'Perfect Balance', domains: ['perception', 'spatial', 'logic', 'temporal'] as CognitiveDomain[], icon: '☯️', color: '#C9B1FF' },
];

const CHALLENGE_POOLS: Record<CognitiveDomain, ChallengeType[]> = {
  perception: [
    'chromatic_isolation', 'luminance_peak', 'shadow_depth', 'scale_anomaly',
    'form_recognition', 'saturation_extreme', 'matchColor', 'matchShape',
    'brightestColor', 'darkestColor', 'largestShape', 'smallestShape',
  ],
  spatial: [
    'cardinal_extreme', 'centroid_proximity', 'isolation_index', 'cluster_density',
    'diagonal_alignment', 'depth_ordering', 'symmetry_axis', 'boundary_distance',
    'topMost', 'bottomMost', 'centerMost', 'mostIsolated',
  ],
  logic: [
    'pattern_breach', 'sequence_prediction', 'set_exclusion', 'majority_rule',
    'inverse_logic', 'conditional_chain', 'oddOneOut', 'patternBreaker',
    'countBased', 'exclusion', 'majority',
  ],
  temporal: [
    'emergence_order', 'duration_estimate', 'rhythm_sync', 'velocity_comparison',
    'decay_prediction', 'temporal_memory', 'firstAppeared', 'lastAppeared',
    'flickering', 'pulsing',
  ],
  // Aliases for compatibility
  visual: [
    'chromatic_isolation', 'luminance_peak', 'form_recognition', 'matchColor', 'matchShape',
  ],
  logical: [
    'pattern_breach', 'sequence_prediction', 'set_exclusion', 'oddOneOut', 'patternBreaker',
  ],
};

function getDateSeed(date: Date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function generateDailyTrial(date: Date = new Date()): DailyTrial {
  const seed = getDateSeed(date);
  const random = seededRandom(seed);
  
  // Select theme based on day
  const themeIndex = Math.floor(random() * DAILY_THEMES.length);
  const theme = DAILY_THEMES[themeIndex];
  
  // Generate difficulty based on day of week (harder on weekends)
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const baseDifficulty = isWeekend ? 0.6 : 0.4 + (dayOfWeek * 0.05);
  
  const genome: DifficultyGenome = {
    timeAllocation: 7 - baseDifficulty * 2,
    shapePopulation: 5 + Math.floor(baseDifficulty * 5),
    distractorRatio: 0.2 + baseDifficulty * 0.3,
    colorSimilarity: 0.3 + baseDifficulty * 0.3,
    sizeDifferentiation: 0.7 - baseDifficulty * 0.3,
    spatialDensity: 0.4 + baseDifficulty * 0.3,
    ruleComplexity: baseDifficulty,
    memoryLoad: Math.floor(baseDifficulty * 2),
    attentionSplits: 1 + Math.floor(baseDifficulty),
    decayRate: baseDifficulty * 0.3,
    rhythmComplexity: baseDifficulty * 0.2,
    ambiguityLevel: baseDifficulty * 0.2,
    trapDensity: baseDifficulty * 0.3,
  };
  
  return {
    id: `daily_${seed}`,
    date: date.toISOString().split('T')[0],
    theme: theme.name,
    domains: theme.domains,
    trialCount: 10 + Math.floor(baseDifficulty * 5),
    genome,
    completed: false,
    evolutionReward: 100 + Math.floor(baseDifficulty * 100),
    streakBonus: 25,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// WEEKLY EXPEDITION - Multi-day challenge chains
// ─────────────────────────────────────────────────────────────────────────────────

const EXPEDITION_THEMES = [
  {
    name: 'The Chromatic Journey',
    description: 'Seven days of color mastery',
    icon: '🌈',
    challenges: [
      'chromatic_isolation', 'saturation_extreme', 'luminance_peak',
      'shadow_depth', 'colorGradient', 'uniqueColor', 'chromatic_isolation',
    ] as ChallengeType[],
  },
  {
    name: 'Spatial Conquest',
    description: 'Navigate the dimensions',
    icon: '🗺️',
    challenges: [
      'cardinal_extreme', 'centroid_proximity', 'isolation_index',
      'cluster_density', 'diagonal_alignment', 'symmetry_axis', 'depth_ordering',
    ] as ChallengeType[],
  },
  {
    name: 'Logic\'s Path',
    description: 'Follow reason to its end',
    icon: '🧮',
    challenges: [
      'pattern_breach', 'sequence_prediction', 'set_exclusion',
      'majority_rule', 'inverse_logic', 'conditional_chain', 'probability_weight',
    ] as ChallengeType[],
  },
  {
    name: 'Temporal Mastery',
    description: 'Command the flow of time',
    icon: '⌛',
    challenges: [
      'emergence_order', 'duration_estimate', 'rhythm_sync',
      'velocity_comparison', 'decay_prediction', 'temporal_memory', 'phase_alignment',
    ] as ChallengeType[],
  },
];

function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

export function generateWeeklyExpedition(date: Date = new Date()): WeeklyExpedition {
  const weekStart = getWeekStart(date);
  const seed = parseInt(weekStart.replace(/-/g, ''));
  const random = seededRandom(seed);
  
  const themeIndex = Math.floor(random() * EXPEDITION_THEMES.length);
  const theme = EXPEDITION_THEMES[themeIndex];
  
  return {
    id: `weekly_${weekStart}`,
    weekStart,
    name: theme.name,
    chapters: theme.challenges.map((challenge, index) => ({
      day: index,
      challenge,
      completed: false,
    })),
    currentChapter: 0,
    totalCompleted: 0,
    chapterRewards: [50, 75, 100, 125, 150, 200, 300],
    completionReward: 500,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// MIND STORMS - Time-limited chaos events
// ─────────────────────────────────────────────────────────────────────────────────

const STORM_TYPES = [
  {
    name: 'Perception Surge',
    description: 'Your senses amplify beyond limits',
    modifier: CHAMBER_MODIFIERS.sensory_overload,
    ambientColor: '#FF00FF',
    particleEffect: 'sparkle_storm',
    multiplier: 2.0,
  },
  {
    name: 'Temporal Maelstrom',
    description: 'Time fractures into shards',
    modifier: CHAMBER_MODIFIERS.temporal_flux,
    ambientColor: '#FFD700',
    particleEffect: 'time_fragments',
    multiplier: 2.5,
  },
  {
    name: 'Chaos Vortex',
    description: 'Reality bends and breaks',
    modifier: CHAMBER_MODIFIERS.chaos_entropy,
    ambientColor: '#FF0066',
    particleEffect: 'chaos_spiral',
    multiplier: 3.0,
  },
  {
    name: 'Zen Moment',
    description: 'Perfect stillness, perfect clarity',
    modifier: CHAMBER_MODIFIERS.zen_focus,
    ambientColor: '#00FF88',
    particleEffect: 'calm_glow',
    multiplier: 1.5,
  },
  {
    name: 'Velocity Storm',
    description: 'Everything accelerates',
    modifier: CHAMBER_MODIFIERS.velocity_storm,
    ambientColor: '#00FFFF',
    particleEffect: 'speed_lines',
    multiplier: 2.0,
  },
];

export function generateMindStorm(durationMinutes: number = 30): MindStorm {
  const stormType = STORM_TYPES[Math.floor(Math.random() * STORM_TYPES.length)];
  const now = Date.now();
  
  return {
    id: `storm_${now}`,
    startTime: now,
    endTime: now + durationMinutes * 60 * 1000,
    name: stormType.name,
    description: stormType.description,
    modifier: stormType.modifier,
    multiplier: stormType.multiplier,
    personalBest: 0,
    ambientColor: stormType.ambientColor,
    particleEffect: stormType.particleEffect,
  };
}

export function isMindStormActive(storm: MindStorm): boolean {
  const now = Date.now();
  return now >= storm.startTime && now <= storm.endTime;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COSMIC EVENTS - Unified event management
// ─────────────────────────────────────────────────────────────────────────────────

export function createCosmicEvent(
  type: EventType,
  content: DailyTrial | WeeklyExpedition | MindStorm | Anomaly
): CosmicEvent {
  const now = Date.now();
  
  let title: string;
  let teaser: string;
  let urgency: 'low' | 'medium' | 'high' | 'critical';
  let endTime: number | undefined;
  
  switch (type) {
    case 'daily_trial':
      const daily = content as DailyTrial;
      title = daily.theme;
      teaser = 'A new cognitive challenge awaits';
      urgency = 'medium';
      // Ends at midnight
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      endTime = tomorrow.getTime();
      break;
      
    case 'weekly_expedition':
      const weekly = content as WeeklyExpedition;
      title = weekly.name;
      teaser = `Chapter ${weekly.currentChapter + 1} of 7`;
      urgency = 'low';
      break;
      
    case 'mind_storm':
      const storm = content as MindStorm;
      title = storm.name;
      teaser = storm.description;
      urgency = 'high';
      endTime = storm.endTime;
      break;
      
    case 'anomaly_breach':
      const anomaly = content as Anomaly;
      title = anomaly.challenge.title;
      teaser = anomaly.challenge.epithet;
      urgency = 'critical';
      endTime = anomaly.expiresAt;
      break;
      
    default:
      title = 'Unknown Event';
      teaser = 'Something stirs in the cosmos';
      urgency = 'low';
  }
  
  return {
    id: `event_${now}_${Math.random().toString(36).slice(2)}`,
    type,
    startTime: now,
    endTime,
    content,
    acknowledged: false,
    participated: false,
    completed: false,
    title,
    teaser,
    urgency,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// VOID WHISPERS - Random mysterious messages
// ─────────────────────────────────────────────────────────────────────────────────

export const VOID_WHISPERS = [
  { message: 'The void remembers your patterns.', rarity: 'common' as const },
  { message: 'Something watches from the edges.', rarity: 'common' as const },
  { message: 'Your mind leaves traces in the dark.', rarity: 'common' as const },
  { message: 'The shapes remember you.', rarity: 'uncommon' as const },
  { message: 'Time bends around certain minds.', rarity: 'uncommon' as const },
  { message: 'You solved that faster than expected.', rarity: 'uncommon' as const },
  { message: 'The cosmos has taken notice.', rarity: 'rare' as const },
  { message: 'Few perceive what you perceive.', rarity: 'rare' as const },
  { message: 'Your neural signature is... unusual.', rarity: 'rare' as const },
  { message: 'The architects are watching.', rarity: 'legendary' as const },
  { message: 'You approach the threshold.', rarity: 'legendary' as const },
  { message: 'Reality questions your presence.', rarity: 'legendary' as const },
];

export function getRandomWhisper(): string | null {
  const roll = Math.random();
  
  let rarityPool: typeof VOID_WHISPERS;
  
  if (roll < 0.01) {
    // 1% legendary
    rarityPool = VOID_WHISPERS.filter(w => w.rarity === 'legendary');
  } else if (roll < 0.05) {
    // 4% rare
    rarityPool = VOID_WHISPERS.filter(w => w.rarity === 'rare');
  } else if (roll < 0.15) {
    // 10% uncommon
    rarityPool = VOID_WHISPERS.filter(w => w.rarity === 'uncommon');
  } else if (roll < 0.30) {
    // 15% common
    rarityPool = VOID_WHISPERS.filter(w => w.rarity === 'common');
  } else {
    // 70% no whisper
    return null;
  }
  
  if (rarityPool.length === 0) return null;
  return rarityPool[Math.floor(Math.random() * rarityPool.length)].message;
}

// ─────────────────────────────────────────────────────────────────────────────────
// EVENT SCHEDULER - Manages active events
// ─────────────────────────────────────────────────────────────────────────────────

class EventScheduler {
  private activeEvents: CosmicEvent[] = [];
  private lastDailyCheck: string = '';
  private lastWeeklyCheck: string = '';
  
  checkAndGenerateEvents(): CosmicEvent[] {
    const newEvents: CosmicEvent[] = [];
    const today = new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart();
    
    // Check for new daily trial
    if (today !== this.lastDailyCheck) {
      this.lastDailyCheck = today;
      const daily = generateDailyTrial();
      newEvents.push(createCosmicEvent('daily_trial', daily));
    }
    
    // Check for new weekly expedition
    if (weekStart !== this.lastWeeklyCheck) {
      this.lastWeeklyCheck = weekStart;
      const weekly = generateWeeklyExpedition();
      newEvents.push(createCosmicEvent('weekly_expedition', weekly));
    }
    
    // Random chance for mind storm (5% per check)
    if (Math.random() < 0.05) {
      const existingStorm = this.activeEvents.find(e => e.type === 'mind_storm');
      if (!existingStorm || !isMindStormActive(existingStorm.content as MindStorm)) {
        const storm = generateMindStorm();
        newEvents.push(createCosmicEvent('mind_storm', storm));
      }
    }
    
    // Add new events to active list
    this.activeEvents.push(...newEvents);
    
    // Clean up expired events
    this.cleanupExpiredEvents();
    
    return newEvents;
  }
  
  private cleanupExpiredEvents(): void {
    const now = Date.now();
    this.activeEvents = this.activeEvents.filter(event => {
      if (!event.endTime) return true;
      return now < event.endTime;
    });
  }
  
  getActiveEvents(): CosmicEvent[] {
    this.cleanupExpiredEvents();
    return [...this.activeEvents];
  }
  
  getEventsByType(type: EventType): CosmicEvent[] {
    return this.activeEvents.filter(e => e.type === type);
  }
  
  acknowledgeEvent(eventId: string): void {
    const event = this.activeEvents.find(e => e.id === eventId);
    if (event) event.acknowledged = true;
  }
  
  markEventParticipated(eventId: string): void {
    const event = this.activeEvents.find(e => e.id === eventId);
    if (event) event.participated = true;
  }
  
  markEventCompleted(eventId: string): void {
    const event = this.activeEvents.find(e => e.id === eventId);
    if (event) {
      event.completed = true;
      event.participated = true;
    }
  }
  
  addEvent(event: CosmicEvent): void {
    this.activeEvents.push(event);
  }
  
  removeEvent(eventId: string): void {
    this.activeEvents = this.activeEvents.filter(e => e.id !== eventId);
  }
}

export const eventScheduler = new EventScheduler();

export default {
  generateDailyTrial,
  generateWeeklyExpedition,
  generateMindStorm,
  isMindStormActive,
  createCosmicEvent,
  getRandomWhisper,
  eventScheduler,
  VOID_WHISPERS,
  CHALLENGE_POOLS,
};
