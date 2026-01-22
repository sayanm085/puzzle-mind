// ═══════════════════════════════════════════════════════════════════════════════
// 💭 DIALOGUE & INSIGHT SYSTEM - Observer Communication
// Life-changing reflections, intelligent session analysis
// The game speaks like an observer, not a cheerleader
// ═══════════════════════════════════════════════════════════════════════════════

import {
  Insight,
  SessionReflection,
  PlayerMindModel,
  CognitiveVector,
  ReactionProfile,
  RiskProfile,
  FatigueModel,
  PlayerMood,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────────
// INSIGHT DATABASE - Profound observations
// ─────────────────────────────────────────────────────────────────────────────────

export const INSIGHTS: Insight[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // PERCEPTION INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'perc_sharp_vision',
    category: 'perception',
    message: 'Your visual processing operates at exceptional speed.',
    subtext: 'Pattern recognition: top 15%',
    conditions: [{ metric: 'cognitiveVector.perception', operator: '>', value: 75 }],
    priority: 80,
    cooldown: 300000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'perc_color_mastery',
    category: 'perception',
    message: 'Colors reveal their secrets to you.',
    subtext: 'Chromatic discrimination: enhanced',
    conditions: [{ metric: 'cognitiveVector.perception', operator: '>', value: 70 }],
    priority: 70,
    cooldown: 600000,
    tone: 'encouraging',
    duration: 'standard',
  },
  {
    id: 'perc_developing',
    category: 'perception',
    message: 'Your perception sharpens with each trial.',
    conditions: [{ metric: 'cognitiveVector.perception', operator: 'between', value: [40, 60] }],
    priority: 40,
    cooldown: 900000,
    tone: 'encouraging',
    duration: 'brief',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEMPO & SPEED INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'tempo_lightning',
    category: 'tempo',
    message: 'Your decisions arrive before most minds even recognize the question.',
    subtext: 'Response time: exceptional',
    conditions: [{ metric: 'reactionProfile.mean', operator: '<', value: 1200 }],
    priority: 90,
    cooldown: 180000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'tempo_improving',
    category: 'tempo',
    message: 'Speed improved. Precision declined.',
    subtext: 'Consider the tradeoff.',
    conditions: [
      { metric: 'reactionProfile.trend', operator: '==', value: 1 }, // improving
      { metric: 'recentAccuracy', operator: '<', value: 0.7 },
    ],
    priority: 75,
    cooldown: 300000,
    tone: 'challenging',
    duration: 'standard',
  },
  {
    id: 'tempo_deliberate',
    category: 'tempo',
    message: 'You take your time. Each answer is considered.',
    subtext: 'Deliberate thinking detected.',
    conditions: [{ metric: 'reactionProfile.mean', operator: '>', value: 3000 }],
    priority: 50,
    cooldown: 600000,
    tone: 'neutral',
    duration: 'brief',
  },
  {
    id: 'tempo_consistent',
    category: 'tempo',
    message: 'Your rhythm is remarkably stable.',
    subtext: 'Timing variance: minimal',
    conditions: [{ metric: 'reactionProfile.variance', operator: '<', value: 400 }],
    priority: 70,
    cooldown: 300000,
    tone: 'neutral',
    duration: 'standard',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PRECISION INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'prec_flawless',
    category: 'precision',
    message: 'Precision without hesitation. A rare combination.',
    conditions: [{ metric: 'accuracy', operator: '>', value: 0.9 }],
    priority: 95,
    cooldown: 120000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'prec_surgical',
    category: 'precision',
    message: 'Your selections are surgical. No wasted motion.',
    conditions: [{ metric: 'accuracy', operator: '>', value: 0.85 }],
    priority: 80,
    cooldown: 240000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'prec_improving',
    category: 'precision',
    message: 'Accuracy climbs. Your pattern recognition adapts.',
    conditions: [
      { metric: 'accuracy', operator: 'between', value: [0.65, 0.8] },
      { metric: 'trend', operator: '==', value: 1 },
    ],
    priority: 60,
    cooldown: 300000,
    tone: 'encouraging',
    duration: 'brief',
  },
  {
    id: 'prec_pressure',
    category: 'precision',
    message: 'Your perception sharpened under pressure.',
    conditions: [{ metric: 'accuracy', operator: '>', value: 0.75 }],
    priority: 65,
    cooldown: 300000,
    tone: 'neutral',
    duration: 'standard',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // GROWTH INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'growth_breakthrough',
    category: 'growth',
    message: 'A threshold crossed. Your mind operates differently now.',
    conditions: [{ metric: 'evolutionStage', operator: '>', value: 5 }],
    priority: 100,
    cooldown: 0, // Only shows once per milestone
    tone: 'profound',
    duration: 'extended',
  },
  {
    id: 'growth_learning',
    category: 'growth',
    message: 'Each failure teaches. Each success confirms.',
    conditions: [{ metric: 'totalTrials', operator: '>', value: 50 }],
    priority: 50,
    cooldown: 900000,
    tone: 'encouraging',
    duration: 'brief',
  },
  {
    id: 'growth_plateau',
    category: 'growth',
    message: 'You have reached a plateau. New challenges await.',
    subtext: 'Consider exploring unfamiliar domains.',
    conditions: [{ metric: 'improvementRate', operator: '<', value: 0.01 }],
    priority: 55,
    cooldown: 1800000,
    tone: 'challenging',
    duration: 'standard',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PATTERN INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'pattern_intuitive',
    category: 'pattern',
    message: 'You recognized structure before certainty.',
    subtext: 'Intuitive processing: dominant',
    conditions: [{ metric: 'behaviorSignature.intuitionVsAnalysis', operator: '>', value: 0.5 }],
    priority: 75,
    cooldown: 300000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'pattern_analytical',
    category: 'pattern',
    message: 'Your mind dissects before it decides.',
    subtext: 'Analytical processing: dominant',
    conditions: [{ metric: 'behaviorSignature.intuitionVsAnalysis', operator: '<', value: -0.5 }],
    priority: 75,
    cooldown: 300000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'pattern_spatial_bias',
    category: 'pattern',
    message: 'You favor the center. The edges remain unexplored.',
    conditions: [{ metric: 'behaviorSignature.scanPattern', operator: '==', value: 'center-out' }],
    priority: 60,
    cooldown: 600000,
    tone: 'challenging',
    duration: 'standard',
  },
  {
    id: 'pattern_systematic',
    category: 'pattern',
    message: 'Your search pattern is methodical. Almost mechanical.',
    conditions: [{ metric: 'behaviorSignature.scanPattern', operator: '==', value: 'systematic' }],
    priority: 55,
    cooldown: 600000,
    tone: 'neutral',
    duration: 'standard',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PRESSURE INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'pressure_thrives',
    category: 'pressure',
    message: 'Difficulty rises. Your performance rises with it.',
    subtext: 'Pressure response: exceptional',
    conditions: [{ metric: 'riskProfile.pressureResponse', operator: '==', value: 'thrives' }],
    priority: 85,
    cooldown: 300000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'pressure_steady',
    category: 'pressure',
    message: 'Chaos surrounds you. Your mind remains still.',
    conditions: [
      { metric: 'riskProfile.pressureResponse', operator: '==', value: 'neutral' },
      { metric: 'accuracy', operator: '>', value: 0.7 },
    ],
    priority: 70,
    cooldown: 300000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'pressure_fatigue',
    category: 'pressure',
    message: 'Your responses slow. The mind signals for rest.',
    subtext: 'Fatigue detected.',
    conditions: [{ metric: 'fatigueModel.estimatedFatigue', operator: '>', value: 0.6 }],
    priority: 90,
    cooldown: 600000,
    tone: 'challenging',
    duration: 'standard',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // MILESTONE INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'mile_first_hundred',
    category: 'milestone',
    message: 'One hundred trials. Your neural pathways strengthen.',
    conditions: [{ metric: 'totalTrials', operator: '==', value: 100 }],
    priority: 100,
    cooldown: 0,
    tone: 'profound',
    duration: 'extended',
  },
  {
    id: 'mile_streak_10',
    category: 'milestone',
    message: 'Ten consecutive. The streak builds momentum.',
    conditions: [{ metric: 'currentStreak', operator: '>=', value: 10 }],
    priority: 70,
    cooldown: 60000,
    tone: 'encouraging',
    duration: 'brief',
  },
  {
    id: 'mile_streak_25',
    category: 'milestone',
    message: 'Twenty-five without error. Exceptional focus.',
    conditions: [{ metric: 'currentStreak', operator: '>=', value: 25 }],
    priority: 85,
    cooldown: 60000,
    tone: 'neutral',
    duration: 'standard',
  },
  {
    id: 'mile_streak_50',
    category: 'milestone',
    message: 'Fifty. The void takes notice.',
    conditions: [{ metric: 'currentStreak', operator: '>=', value: 50 }],
    priority: 95,
    cooldown: 0,
    tone: 'profound',
    duration: 'extended',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // FLOW STATE INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'flow_entering',
    category: 'flow',
    message: 'You enter the flow. Time loses meaning.',
    conditions: [{ metric: 'currentMood', operator: '==', value: 'flowing' }],
    priority: 80,
    cooldown: 300000,
    tone: 'mysterious',
    duration: 'standard',
  },
  {
    id: 'flow_peak',
    category: 'flow',
    message: 'Perfect synchronization. Mind and challenge merge.',
    conditions: [
      { metric: 'currentMood', operator: '==', value: 'flowing' },
      { metric: 'accuracy', operator: '>', value: 0.9 },
    ],
    priority: 90,
    cooldown: 180000,
    tone: 'profound',
    duration: 'extended',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // MASTERY INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'mastery_domain',
    category: 'mastery',
    message: 'You have mastered a cognitive domain.',
    subtext: 'New challenges unlocked.',
    conditions: [{ metric: 'domainMastery', operator: '>', value: 0.85 }],
    priority: 100,
    cooldown: 0,
    tone: 'profound',
    duration: 'extended',
  },
  {
    id: 'mastery_balance',
    category: 'mastery',
    message: 'All domains balanced. A rare mind.',
    conditions: [{ metric: 'cognitiveBalance', operator: '==', value: true }],
    priority: 95,
    cooldown: 0,
    tone: 'profound',
    duration: 'extended',
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// SESSION HEADLINES - Opening observations
// ─────────────────────────────────────────────────────────────────────────────────

const SESSION_HEADLINES = {
  exceptional: [
    'The void witnessed something rare today.',
    'Few minds operate at this level.',
    'Your cognitive signature has evolved.',
    'This session exceeded all parameters.',
  ],
  strong: [
    'A solid performance. Growth is evident.',
    'Your patterns strengthen.',
    'Improvement detected across domains.',
    'The mind sharpens.',
  ],
  moderate: [
    'A session of learning.',
    'Each challenge teaches.',
    'Progress is not always visible.',
    'The journey continues.',
  ],
  struggling: [
    'Difficulty reveals growth areas.',
    'Challenge exposes potential.',
    'Struggle precedes breakthrough.',
    'The path is not meant to be easy.',
  ],
};

const SESSION_SUBHEADLINES = {
  speed: [
    'Response time: {value}ms average',
    'Temporal efficiency: {value}%',
    'Decision speed: {value}ms median',
  ],
  accuracy: [
    'Precision index: {value}%',
    'Success rate: {value}%',
    'Accuracy: {value} in {total}',
  ],
  streak: [
    'Peak streak: {value} consecutive',
    'Longest chain: {value} correct',
    'Maximum flow: {value} trials',
  ],
  evolution: [
    'Evolution gained: +{value}',
    'Growth: {value} points',
    'Progression: +{value} evolution',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// REFLECTION GENERATOR - Post-session analysis
// ─────────────────────────────────────────────────────────────────────────────────

export function generateSessionReflection(
  stats: {
    trials: number;
    accuracy: number;
    avgResponseTime: number;
    peakStreak: number;
    evolutionGained: number;
    cognitiveVector: CognitiveVector;
    mood: PlayerMood;
  }
): SessionReflection {
  // Determine overall performance tier
  let tier: 'exceptional' | 'strong' | 'moderate' | 'struggling';
  
  if (stats.accuracy > 0.85 && stats.avgResponseTime < 1500) {
    tier = 'exceptional';
  } else if (stats.accuracy > 0.70) {
    tier = 'strong';
  } else if (stats.accuracy > 0.50) {
    tier = 'moderate';
  } else {
    tier = 'struggling';
  }
  
  // Select headline
  const headlines = SESSION_HEADLINES[tier];
  const headline = headlines[Math.floor(Math.random() * headlines.length)];
  
  // Generate subheadline based on most notable metric
  let subheadline: string;
  if (stats.peakStreak >= 10) {
    const templates = SESSION_SUBHEADLINES.streak;
    subheadline = templates[Math.floor(Math.random() * templates.length)]
      .replace('{value}', stats.peakStreak.toString());
  } else if (stats.accuracy > 0.8) {
    const templates = SESSION_SUBHEADLINES.accuracy;
    subheadline = templates[Math.floor(Math.random() * templates.length)]
      .replace('{value}', Math.round(stats.accuracy * 100).toString())
      .replace('{total}', stats.trials.toString());
  } else {
    const templates = SESSION_SUBHEADLINES.speed;
    subheadline = templates[Math.floor(Math.random() * templates.length)]
      .replace('{value}', Math.round(stats.avgResponseTime).toString());
  }
  
  // Select applicable insights
  const insights = selectApplicableInsights({
    accuracy: stats.accuracy,
    reactionProfile: { mean: stats.avgResponseTime } as ReactionProfile,
    currentMood: stats.mood,
    currentStreak: stats.peakStreak,
    cognitiveVector: stats.cognitiveVector,
    evolutionGained: stats.evolutionGained,
  });
  
  // Generate highlighted metric
  let highlightedMetric: SessionReflection['highlightedMetric'];
  
  if (stats.peakStreak >= 5) {
    highlightedMetric = {
      label: 'Peak Streak',
      value: stats.peakStreak.toString(),
      context: stats.peakStreak >= 10 ? 'Exceptional focus' : 'Building momentum',
      trend: 'up',
    };
  } else if (stats.accuracy >= 0.75) {
    highlightedMetric = {
      label: 'Accuracy',
      value: `${Math.round(stats.accuracy * 100)}%`,
      context: 'Precision maintained',
      trend: stats.accuracy >= 0.85 ? 'up' : 'stable',
    };
  } else {
    highlightedMetric = {
      label: 'Trials',
      value: stats.trials.toString(),
      context: 'Experience gained',
      trend: 'stable',
    };
  }
  
  // Generate suggestion
  const suggestion = generateSuggestion(stats);
  
  // Determine overall tone
  let overallTone: SessionReflection['overallTone'];
  if (tier === 'exceptional') {
    overallTone = 'celebratory';
  } else if (tier === 'strong') {
    overallTone = 'analytical';
  } else if (tier === 'moderate') {
    overallTone = 'encouraging';
  } else {
    overallTone = 'challenging';
  }
  
  return {
    headline,
    subheadline,
    insights: insights.slice(0, 3),
    highlightedMetric,
    suggestion,
    overallTone,
  };
}

function selectApplicableInsights(context: {
  accuracy: number;
  reactionProfile: Partial<ReactionProfile>;
  currentMood: PlayerMood;
  currentStreak: number;
  cognitiveVector: CognitiveVector;
  evolutionGained: number;
}): Insight[] {
  const now = Date.now();
  const applicable: { insight: Insight; score: number }[] = [];
  
  for (const insight of INSIGHTS) {
    // Check cooldown
    if (insight.lastShown && now - insight.lastShown < insight.cooldown) {
      continue;
    }
    
    // Check conditions (simplified evaluation)
    let matches = true;
    for (const condition of insight.conditions) {
      const value = getMetricValue(condition.metric, context);
      if (value === undefined) {
        matches = false;
        break;
      }
      
      switch (condition.operator) {
        case '>':
          matches = value > (condition.value as number);
          break;
        case '<':
          matches = value < (condition.value as number);
          break;
        case '==':
          matches = value === condition.value;
          break;
        case '>=':
          matches = value >= (condition.value as number);
          break;
        case '<=':
          matches = value <= (condition.value as number);
          break;
        case 'between':
          const [min, max] = condition.value as [number, number];
          matches = value >= min && value <= max;
          break;
      }
      
      if (!matches) break;
    }
    
    if (matches) {
      applicable.push({ insight, score: insight.priority });
    }
  }
  
  // Sort by priority and return top insights
  applicable.sort((a, b) => b.score - a.score);
  
  return applicable.map(a => {
    a.insight.lastShown = now;
    return a.insight;
  });
}

function getMetricValue(metric: string, context: any): any {
  const parts = metric.split('.');
  let value = context;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  
  return value;
}

function generateSuggestion(stats: {
  accuracy: number;
  avgResponseTime: number;
  cognitiveVector: CognitiveVector;
}): string {
  const cv = stats.cognitiveVector;
  
  // Find weakest domain
  const domains = [
    { name: 'perception', value: cv.perception },
    { name: 'spatial', value: cv.spatial },
    { name: 'logic', value: cv.logic },
    { name: 'temporal', value: cv.temporal },
  ];
  
  domains.sort((a, b) => a.value - b.value);
  const weakest = domains[0];
  
  if (weakest.value < 40) {
    return `Consider exploring ${weakest.name} challenges to strengthen that domain.`;
  }
  
  if (stats.accuracy < 0.6 && stats.avgResponseTime < 1500) {
    return 'Slowing down may improve accuracy without sacrificing flow.';
  }
  
  if (stats.accuracy > 0.85 && stats.avgResponseTime > 2500) {
    return 'Your precision is high. Trust your instincts more.';
  }
  
  return 'Continue at your current pace. Growth is occurring.';
}

// ─────────────────────────────────────────────────────────────────────────────────
// TRIAL FEEDBACK - Immediate micro-feedback
// ─────────────────────────────────────────────────────────────────────────────────

export function getTrialFeedback(
  correct: boolean,
  responseTime: number,
  streak: number
): string | null {
  // Only occasional feedback to avoid noise
  if (Math.random() > 0.15) return null;
  
  if (correct) {
    if (responseTime < 800 && streak >= 5) {
      return 'Lightning.';
    }
    if (streak === 10) {
      return 'Ten.';
    }
    if (streak === 25) {
      return 'Impressive.';
    }
    if (responseTime < 1000) {
      return 'Fast.';
    }
    return null;
  } else {
    if (streak >= 10) {
      return 'The streak ends.';
    }
    if (responseTime < 500) {
      return 'Too hasty.';
    }
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONTEXTUAL WHISPERS - Atmosphere enhancement
// ─────────────────────────────────────────────────────────────────────────────────

export const AMBIENT_WHISPERS = [
  'The patterns shift...',
  'Something watches...',
  'Your mind adapts...',
  'The void remembers...',
  'Deeper...',
  'Faster...',
  'Focus...',
  'Again...',
];

export function getAmbientWhisper(): string | null {
  if (Math.random() > 0.02) return null; // 2% chance
  return AMBIENT_WHISPERS[Math.floor(Math.random() * AMBIENT_WHISPERS.length)];
}

export default {
  INSIGHTS,
  generateSessionReflection,
  getTrialFeedback,
  getAmbientWhisper,
  AMBIENT_WHISPERS,
};
