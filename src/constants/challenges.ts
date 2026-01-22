import { ChallengeDefinition } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 CHALLENGE DEFINITIONS (25+ Types)
// ═══════════════════════════════════════════════════════════════════════════════
export const CHALLENGE_DEFINITIONS: ChallengeDefinition[] = [
  // Visual Domain (8 types)
  { type: 'matchColor', domain: 'visual', baseWeight: 1.0, description: 'Find the COLOR shape', unlockLevel: 1, complexity: 0.2 },
  { type: 'matchShape', domain: 'visual', baseWeight: 1.0, description: 'Find the SHAPE', unlockLevel: 1, complexity: 0.2 },
  { type: 'brightestColor', domain: 'visual', baseWeight: 1.2, description: 'Find the BRIGHTEST', unlockLevel: 1, complexity: 0.3 },
  { type: 'darkestColor', domain: 'visual', baseWeight: 1.2, description: 'Find the DARKEST', unlockLevel: 3, complexity: 0.3 },
  { type: 'largestShape', domain: 'visual', baseWeight: 1.1, description: 'Find the LARGEST', unlockLevel: 1, complexity: 0.2 },
  { type: 'smallestShape', domain: 'visual', baseWeight: 1.1, description: 'Find the SMALLEST', unlockLevel: 2, complexity: 0.2 },
  { type: 'colorGradient', domain: 'visual', baseWeight: 1.8, description: 'Find the GRADIENT BREAKER', unlockLevel: 15, complexity: 0.7 },
  { type: 'uniqueColor', domain: 'visual', baseWeight: 1.5, description: 'Find the UNIQUE COLOR', unlockLevel: 8, complexity: 0.5 },
  
  // Spatial Domain (8 types)
  { type: 'topMost', domain: 'spatial', baseWeight: 1.0, description: 'Find the HIGHEST', unlockLevel: 4, complexity: 0.3 },
  { type: 'bottomMost', domain: 'spatial', baseWeight: 1.0, description: 'Find the LOWEST', unlockLevel: 4, complexity: 0.3 },
  { type: 'leftMost', domain: 'spatial', baseWeight: 1.0, description: 'Find the LEFTMOST', unlockLevel: 2, complexity: 0.3 },
  { type: 'rightMost', domain: 'spatial', baseWeight: 1.0, description: 'Find the RIGHTMOST', unlockLevel: 2, complexity: 0.3 },
  { type: 'centerMost', domain: 'spatial', baseWeight: 1.4, description: 'Find the CENTER', unlockLevel: 10, complexity: 0.5 },
  { type: 'mostIsolated', domain: 'spatial', baseWeight: 1.6, description: 'Find the ISOLATED', unlockLevel: 18, complexity: 0.7 },
  { type: 'mostCrowded', domain: 'spatial', baseWeight: 1.6, description: 'Find the CROWDED', unlockLevel: 20, complexity: 0.7 },
  { type: 'diagonal', domain: 'spatial', baseWeight: 1.5, description: 'Find the DIAGONAL', unlockLevel: 25, complexity: 0.6 },
  
  // Logical Domain (5 types)
  { type: 'oddOneOut', domain: 'logical', baseWeight: 1.8, description: 'Find the ODD ONE', unlockLevel: 12, complexity: 0.6 },
  { type: 'patternBreaker', domain: 'logical', baseWeight: 2.0, description: 'Find the ANOMALY', unlockLevel: 22, complexity: 0.8 },
  { type: 'countBased', domain: 'logical', baseWeight: 1.5, description: 'Find the Nth TYPE', unlockLevel: 14, complexity: 0.5 },
  { type: 'exclusion', domain: 'logical', baseWeight: 1.7, description: 'Find NOT this AND NOT that', unlockLevel: 28, complexity: 0.8 },
  { type: 'majority', domain: 'logical', baseWeight: 1.6, description: 'Find the MAJORITY type', unlockLevel: 30, complexity: 0.7 },
  
  // Temporal Domain (5 types)
  { type: 'firstAppeared', domain: 'temporal', baseWeight: 2.0, description: 'Find the FIRST', unlockLevel: 35, complexity: 0.8 },
  { type: 'lastAppeared', domain: 'temporal', baseWeight: 2.0, description: 'Find the LAST', unlockLevel: 35, complexity: 0.8 },
  { type: 'flickering', domain: 'temporal', baseWeight: 2.2, description: 'Find the FLICKERING', unlockLevel: 40, complexity: 0.9 },
  { type: 'colorShift', domain: 'temporal', baseWeight: 2.5, description: 'Find the SHIFTING', unlockLevel: 45, complexity: 1.0 },
  { type: 'pulsing', domain: 'temporal', baseWeight: 2.3, description: 'Find the PULSING', unlockLevel: 42, complexity: 0.9 },
];

// Get challenges available for a level
export function getAvailableChallenges(levelId: number): ChallengeDefinition[] {
  return CHALLENGE_DEFINITIONS.filter(c => c.unlockLevel <= levelId);
}

// Get challenge by type
export function getChallengeByType(type: string): ChallengeDefinition | undefined {
  return CHALLENGE_DEFINITIONS.find(c => c.type === type);
}

// Get challenge description for display
export function getChallengeDescription(
  challenge: string,
  context?: { 
    targetColor?: string; 
    targetShape?: string;
    targetCount?: number;
    excludeColor?: string;
    excludeSize?: string;
  }
): string {
  const def = CHALLENGE_DEFINITIONS.find(d => d.type === challenge);
  
  switch (challenge) {
    case 'matchColor': return `Find the ${context?.targetColor?.toUpperCase() || 'CYAN'} one`;
    case 'matchShape': return `Find the ${context?.targetShape?.toUpperCase() || 'CIRCLE'}`;
    case 'countBased': return `Find the ${context?.targetCount === 2 ? '2ND' : context?.targetCount === 3 ? '3RD' : `${context?.targetCount}TH`} LARGEST`;
    case 'exclusion': return `NOT ${context?.excludeColor?.toUpperCase() || 'CYAN'} • NOT ${context?.excludeSize?.toUpperCase() || 'LARGE'}`;
    case 'majority': return 'Find the MAJORITY type';
    case 'uniqueColor': return 'Find the UNIQUE color';
    case 'diagonal': return 'Find the DIAGONAL one';
    case 'pulsing': return 'Find the PULSING one';
    default: return def?.description || 'Find the TARGET';
  }
}
