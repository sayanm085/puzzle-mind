import { InsightRule } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// 💭 INSIGHT RULES - Profound Messages for Players
// ═══════════════════════════════════════════════════════════════════════════════

export const INSIGHT_RULES: InsightRule[] = [
  // Speed-based insights
  {
    id: 'speed_demon',
    condition: (profile) => profile.averageResponseTime < 1000,
    message: "Your reflexes transcend thought. You see the answer before it exists.",
    icon: '⚡',
    category: 'tempo',
  },
  {
    id: 'deliberate_master',
    condition: (profile) => profile.averageResponseTime > 3000 && profile.accuracy > 0.85,
    message: "Patience is your weapon. Every choice is a meditation.",
    icon: '🧘',
    category: 'tempo',
  },
  {
    id: 'steady_rhythm',
    condition: (profile) => Math.abs(profile.averageResponseTime - 2000) < 500,
    message: "You've found your flow state. Time bends to your rhythm.",
    icon: '🎵',
    category: 'tempo',
  },

  // Accuracy-based insights
  {
    id: 'perfectionist',
    condition: (profile) => profile.accuracy > 0.95,
    message: "Near-perfection. The shapes fear your gaze.",
    icon: '✨',
    category: 'precision',
  },
  {
    id: 'improving_accuracy',
    condition: (profile) => profile.recentAccuracy > profile.accuracy + 0.1,
    message: "Evolution in action. Your eyes grow sharper with each round.",
    icon: '📈',
    category: 'precision',
  },
  {
    id: 'learner',
    condition: (profile) => profile.accuracy < 0.6 && profile.totalRounds > 10,
    message: "Every master was once a disaster. Your journey shapes greatness.",
    icon: '🌱',
    category: 'precision',
  },

  // Skill domain insights
  {
    id: 'spatial_genius',
    condition: (profile) => profile.skillVector.spatial > 0.8,
    message: "Space itself speaks to you. Positions reveal their secrets.",
    icon: '🎯',
    category: 'mastery',
  },
  {
    id: 'color_sage',
    condition: (profile) => profile.skillVector.visual > 0.8,
    message: "Colors dance for you alone. Light and shadow are your allies.",
    icon: '🎨',
    category: 'mastery',
  },
  {
    id: 'logic_lord',
    condition: (profile) => profile.skillVector.logical > 0.8,
    message: "Patterns cannot hide from you. Logic flows through your veins.",
    icon: '🧠',
    category: 'mastery',
  },
  {
    id: 'temporal_oracle',
    condition: (profile) => profile.skillVector.temporal > 0.8,
    message: "Time whispers its secrets to you. The sequence bows to your memory.",
    icon: '⏳',
    category: 'mastery',
  },

  // Behavioral insights
  {
    id: 'corner_lover',
    condition: (profile) => !!(profile.positionBias && profile.positionBias.corner > 0.4),
    message: "Corners call to you. Perhaps safety lies at the edges.",
    icon: '📐',
    category: 'pattern',
  },
  {
    id: 'center_seeker',
    condition: (profile) => !!(profile.positionBias && profile.positionBias.center > 0.4),
    message: "You gravitate to the center. Balance is your nature.",
    icon: '⭕',
    category: 'pattern',
  },
  {
    id: 'streak_builder',
    condition: (profile) => profile.currentStreak > 5,
    message: "Momentum builds. You are becoming unstoppable.",
    icon: '🔥',
    category: 'flow',
  },
  {
    id: 'comeback_king',
    condition: (profile) => profile.longestStreak > 3 && profile.currentStreak > profile.longestStreak * 0.8,
    message: "From ashes, phoenix rises. Your comeback is legendary.",
    icon: '👑',
    category: 'flow',
  },

  // Milestone insights
  {
    id: 'veteran',
    condition: (profile) => profile.totalRounds > 100,
    message: "A hundred battles fought. You are no longer a novice.",
    icon: '🏆',
    category: 'milestone',
  },
  {
    id: 'marathon_runner',
    condition: (profile) => profile.totalRounds > 50,
    message: "Endurance defines you. The long path reveals true strength.",
    icon: '🏃',
    category: 'milestone',
  },
  {
    id: 'first_blood',
    condition: (profile) => profile.totalRounds === 1 && profile.accuracy === 1,
    message: "A perfect beginning. The journey of a thousand shapes starts with one.",
    icon: '🌅',
    category: 'milestone',
  },

  // Challenge-specific insights
  {
    id: 'size_master',
    condition: (profile) => {
      const sizeAccuracy = profile.challengeAccuracy?.['largestShape'] ?? 0;
      const smallAccuracy = profile.challengeAccuracy?.['smallestShape'] ?? 0;
      return (sizeAccuracy + smallAccuracy) / 2 > 0.9;
    },
    message: "Size is merely perception. You see what others cannot.",
    icon: '📏',
    category: 'mastery',
  },
  {
    id: 'position_master',
    condition: (profile) => {
      const positionChallenges = ['leftMost', 'rightMost', 'topMost', 'bottomMost', 'centerMost'];
      const avgAccuracy = positionChallenges.reduce((sum, c) => 
        sum + (profile.challengeAccuracy?.[c] ?? 0), 0) / positionChallenges.length;
      return avgAccuracy > 0.85;
    },
    message: "The coordinate plane bends to your will.",
    icon: '🧭',
    category: 'mastery',
  },
];

// Get applicable insights for a player profile
export function getApplicableInsights(profile: any): InsightRule[] {
  return INSIGHT_RULES.filter(rule => {
    try {
      return rule.condition(profile);
    } catch {
      return false;
    }
  });
}

// Get a random insight from applicable ones
export function getRandomInsight(profile: any): InsightRule | null {
  const applicable = getApplicableInsights(profile);
  if (applicable.length === 0) return null;
  return applicable[Math.floor(Math.random() * applicable.length)];
}

// Get most relevant insight (highest priority/newest unlocked)
export function getMostRelevantInsight(profile: any): InsightRule | null {
  const applicable = getApplicableInsights(profile);
  // Prioritize milestone > mastery > flow > tempo > pattern > precision
  const priority = ['milestone', 'mastery', 'flow', 'tempo', 'pattern', 'precision'];
  for (const category of priority) {
    const match = applicable.find(i => i.category === category);
    if (match) return match;
  }
  return applicable[0] || null;
}
