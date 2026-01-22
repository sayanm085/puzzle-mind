// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 UNIVERSE STRUCTURE - Galaxy-Scale World Architecture
// Locked regions feel mythic, exploration is mental
// ═══════════════════════════════════════════════════════════════════════════════

import {
  Sector,
  Chamber,
  ChamberModifier,
  Anomaly,
  CosmicCoordinate,
  DifficultyGenome,
  ChallengeType,
  CognitiveDomain,
  LegendaryChallenge,
  UnlockCondition,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────────
// DEFAULT DIFFICULTY GENOME - Base challenge parameters
// ─────────────────────────────────────────────────────────────────────────────────

const createBaseGenome = (complexity: number): DifficultyGenome => ({
  timeAllocation: 8 - complexity * 3,          // 8s → 5s
  shapePopulation: 4 + Math.floor(complexity * 8), // 4 → 12
  distractorRatio: 0.1 + complexity * 0.4,     // 10% → 50%
  colorSimilarity: 0.2 + complexity * 0.5,     // 20% → 70%
  sizeDifferentiation: 0.8 - complexity * 0.4, // 80% → 40%
  spatialDensity: 0.3 + complexity * 0.5,      // 30% → 80%
  ruleComplexity: complexity,
  memoryLoad: Math.floor(complexity * 3),      // 0 → 3
  attentionSplits: 1 + Math.floor(complexity * 2), // 1 → 3
  decayRate: complexity * 0.5,                 // 0 → 0.5
  rhythmComplexity: complexity * 0.3,          // 0 → 0.3
  ambiguityLevel: complexity * 0.3,            // 0 → 0.3
  trapDensity: complexity * 0.4,               // 0 → 0.4
});

// ─────────────────────────────────────────────────────────────────────────────────
// CHAMBER MODIFIERS - Special challenge conditions
// ─────────────────────────────────────────────────────────────────────────────────

export const CHAMBER_MODIFIERS: Record<string, ChamberModifier> = {
  temporal_flux: {
    type: 'temporal_flux',
    intensity: 0.7,
    description: 'Time flows differently here. Trust your instincts.',
    icon: '⏳',
    visualEffect: 'time_distortion',
  },
  spatial_warp: {
    type: 'spatial_warp',
    intensity: 0.6,
    description: 'Space bends. What appears close may be far.',
    icon: '🌀',
    visualEffect: 'warp_distortion',
  },
  sensory_overload: {
    type: 'sensory_overload',
    intensity: 0.8,
    description: 'Every sense heightened. Every detail matters.',
    icon: '✨',
    visualEffect: 'particle_storm',
  },
  zen_focus: {
    type: 'zen_focus',
    intensity: 0.4,
    description: 'Silence. Clarity. One breath, one answer.',
    icon: '🧘',
    visualEffect: 'calm_void',
  },
  chaos_entropy: {
    type: 'chaos_entropy',
    intensity: 0.9,
    description: 'Order dissolves. Find pattern in chaos.',
    icon: '🔥',
    visualEffect: 'chaos_particles',
  },
  mirror_realm: {
    type: 'mirror_realm',
    intensity: 0.7,
    description: 'Everything reflects. Nothing is as it seems.',
    icon: '🪞',
    visualEffect: 'mirror_effect',
  },
  shadow_play: {
    type: 'shadow_play',
    intensity: 0.65,
    description: 'Darkness reveals what light conceals.',
    icon: '🌑',
    visualEffect: 'shadow_pulse',
  },
  velocity_storm: {
    type: 'velocity_storm',
    intensity: 0.85,
    description: 'Everything accelerates. Your mind must keep pace.',
    icon: '⚡',
    visualEffect: 'speed_lines',
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// SECTOR DEFINITIONS - 12 Unique Cosmic Regions
// ─────────────────────────────────────────────────────────────────────────────────

const createChamber = (
  id: string,
  sectorId: string,
  index: number,
  name: string,
  essence: string,
  domain: CognitiveDomain,
  challenges: ChallengeType[],
  complexity: number,
  modifier?: ChamberModifier
): Chamber => ({
  id,
  sectorId,
  index,
  name,
  essence,
  primaryDomain: domain,
  challengePool: challenges,
  trialCount: 7 + Math.floor(complexity * 5), // 7-12 trials
  difficulty: Math.ceil(complexity * 5) || 1, // 1-5 difficulty rating
  baseGenome: createBaseGenome(complexity),
  modifier,
  state: index === 0 ? 'available' : 'locked',
  attempts: 0,
  evolutionReward: Math.floor(50 + complexity * 150),
});

export const SECTORS: Sector[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 1: GENESIS - The Beginning
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'genesis',
    name: 'GENESIS',
    subtitle: 'The Awakening',
    coordinate: { sector: 1, cluster: 0, node: 0, depth: 0 },
    primaryColor: '#00D9FF',
    secondaryColor: '#0A1628',
    accentColor: '#00FF88',
    color: '#00D9FF', // Alias for UI components
    icon: '🌟',
    backgroundEffect: 'nebula',
    ambientSound: 'cosmic_hum',
    chambers: [
      createChamber('gen_1', 'genesis', 0, 'First Light', 'Where perception begins', 'perception',
        ['chromatic_isolation', 'matchColor', 'form_recognition', 'matchShape'], 0.1),
      createChamber('gen_2', 'genesis', 1, 'Shape Whispers', 'Forms emerge from void', 'perception',
        ['scale_anomaly', 'largestShape', 'smallestShape'], 0.15),
      createChamber('gen_3', 'genesis', 2, 'Color Pulse', 'Light finds its voice', 'perception',
        ['luminance_peak', 'brightestColor', 'shadow_depth', 'darkestColor'], 0.2),
      createChamber('gen_4', 'genesis', 3, 'Spatial Dawn', 'Space reveals its secrets', 'spatial',
        ['cardinal_extreme', 'topMost', 'bottomMost', 'leftMost', 'rightMost'], 0.25),
      createChamber('gen_5', 'genesis', 4, 'The Threshold', 'Where novice becomes seeker', 'spatial',
        ['centroid_proximity', 'centerMost', 'boundary_distance'], 0.3, CHAMBER_MODIFIERS.zen_focus),
    ],
    totalChambers: 5,
    completedChambers: 0,
    state: 'accessible',
    unlockCondition: { type: 'evolution', requirement: 0, current: 0, description: 'Always open' },
    mythicTitle: 'The Cradle of Cognition',
    description: 'Where all minds begin their journey. Simple challenges awaken dormant perception.',
    discoveryDialogue: 'Welcome, seeker. Your mind stirs. Let us see what you perceive.',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 2: PRISMA - Color Mastery
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'prisma',
    name: 'PRISMA',
    subtitle: 'Spectrum\'s Edge',
    coordinate: { sector: 2, cluster: 1, node: 0, depth: 1 },
    primaryColor: '#FF00FF',
    secondaryColor: '#1A0A28',
    accentColor: '#FFFF00',
    color: '#FF00FF', // Alias for UI components
    icon: '💎',
    backgroundEffect: 'aurora',
    ambientSound: 'crystal_resonance',
    chambers: [
      createChamber('pri_1', 'prisma', 0, 'Chroma Well', 'Where colors pool', 'perception',
        ['chromatic_isolation', 'uniqueColor', 'saturation_extreme'], 0.3),
      createChamber('pri_2', 'prisma', 1, 'Gradient Falls', 'Hues cascade endlessly', 'perception',
        ['colorGradient', 'opacity_gradient'], 0.35),
      createChamber('pri_3', 'prisma', 2, 'Luminance Peak', 'Light at its brightest', 'perception',
        ['luminance_peak', 'shadow_depth'], 0.4, CHAMBER_MODIFIERS.sensory_overload),
      createChamber('pri_4', 'prisma', 3, 'Color Memory', 'Remember the spectrum', 'temporal',
        ['temporal_memory', 'colorShift'], 0.45),
      createChamber('pri_5', 'prisma', 4, 'Prismatic Trial', 'Master of all colors', 'perception',
        ['chromatic_isolation', 'saturation_extreme', 'luminance_peak'], 0.5),
    ],
    totalChambers: 5,
    completedChambers: 0,
    state: 'glimpsed',
    unlockCondition: { type: 'chambers', requirement: 3, current: 0, description: 'Complete 3 Genesis chambers' },
    mythicTitle: 'The Chromatic Depths',
    description: 'Here, color is everything. Your eyes must learn to see beyond the obvious.',
    discoveryDialogue: 'You have glimpsed true color. But can you master its infinite variations?',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 3: VOID - Spatial Mastery
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'void',
    name: 'THE VOID',
    subtitle: 'Between Dimensions',
    coordinate: { sector: 3, cluster: 1, node: 1, depth: 2 },
    primaryColor: '#1A0A28',
    secondaryColor: '#050510',
    accentColor: '#8B00FF',
    color: '#8B00FF',
    icon: '🌑',
    backgroundEffect: 'void',
    ambientSound: 'deep_space',
    chambers: [
      createChamber('voi_1', 'void', 0, 'Empty Expanse', 'Space without form', 'spatial',
        ['isolation_index', 'mostIsolated', 'cluster_density', 'mostCrowded'], 0.35),
      createChamber('voi_2', 'void', 1, 'Depth Perception', 'Near and far blur', 'spatial',
        ['depth_ordering', 'diagonal_alignment', 'diagonal'], 0.4),
      createChamber('voi_3', 'void', 2, 'Mirror Space', 'Reflections deceive', 'spatial',
        ['symmetry_axis', 'centroid_proximity'], 0.45, CHAMBER_MODIFIERS.mirror_realm),
      createChamber('voi_4', 'void', 3, 'Warped Reality', 'Dimensions fold', 'spatial',
        ['cardinal_extreme', 'boundary_distance', 'cluster_density'], 0.5, CHAMBER_MODIFIERS.spatial_warp),
      createChamber('voi_5', 'void', 4, 'Singularity', 'Where space collapses', 'spatial',
        ['isolation_index', 'depth_ordering', 'diagonal_alignment'], 0.55),
    ],
    totalChambers: 5,
    completedChambers: 0,
    state: 'undiscovered',
    unlockCondition: { type: 'evolution', requirement: 200, current: 0, description: 'Reach Evolution 200' },
    mythicTitle: 'The Absence Between',
    description: 'In the void, there is no up or down. Only your spatial sense can guide you.',
    discoveryDialogue: 'You have found the void. Here, space itself is your challenge.',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 4: AXIOM - Logic Domain
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'axiom',
    name: 'AXIOM',
    subtitle: 'Temple of Reason',
    coordinate: { sector: 4, cluster: 2, node: 0, depth: 2 },
    primaryColor: '#00FF88',
    secondaryColor: '#0A2818',
    accentColor: '#FFFFFF',
    color: '#00FF88',
    icon: '⚖️',
    backgroundEffect: 'crystals',
    ambientSound: 'logic_hum',
    chambers: [
      createChamber('axi_1', 'axiom', 0, 'First Principles', 'Where truth begins', 'logic',
        ['pattern_breach', 'oddOneOut', 'set_exclusion'], 0.4),
      createChamber('axi_2', 'axiom', 1, 'Deduction Chamber', 'From cause to effect', 'logic',
        ['sequence_prediction', 'patternBreaker'], 0.45),
      createChamber('axi_3', 'axiom', 2, 'The Majority Rule', 'What most believe', 'logic',
        ['majority_rule', 'majority', 'countBased'], 0.5),
      createChamber('axi_4', 'axiom', 3, 'Inverse Logic', 'Think in reverse', 'logic',
        ['inverse_logic', 'exclusion'], 0.55, CHAMBER_MODIFIERS.mirror_realm),
      createChamber('axi_5', 'axiom', 4, 'Conditional Mind', 'If this, then what?', 'logic',
        ['conditional_chain', 'probability_weight'], 0.6),
      createChamber('axi_6', 'axiom', 5, 'Pure Reason', 'Logic at its peak', 'logic',
        ['category_bridge', 'conditional_chain', 'sequence_prediction'], 0.65),
    ],
    totalChambers: 6,
    completedChambers: 0,
    state: 'undiscovered',
    unlockCondition: { type: 'chambers', requirement: 8, current: 0, description: 'Complete 8 total chambers' },
    mythicTitle: 'The Fortress of Logic',
    description: 'Here, emotion has no place. Only pure reason prevails.',
    discoveryDialogue: 'Logic requires no belief. Only proof. Show me your reasoning.',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 5: CHRONOS - Temporal Domain
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'chronos',
    name: 'CHRONOS',
    subtitle: 'Rivers of Time',
    coordinate: { sector: 5, cluster: 2, node: 1, depth: 3 },
    primaryColor: '#FFD700',
    secondaryColor: '#1A1500',
    accentColor: '#FF6600',
    color: '#FFD700',
    icon: '⏳',
    backgroundEffect: 'storm',
    ambientSound: 'time_flow',
    chambers: [
      createChamber('chr_1', 'chronos', 0, 'First Moment', 'Time begins', 'temporal',
        ['emergence_order', 'firstAppeared', 'lastAppeared'], 0.45),
      createChamber('chr_2', 'chronos', 1, 'Duration Sense', 'Feel time pass', 'temporal',
        ['duration_estimate', 'decay_prediction'], 0.5),
      createChamber('chr_3', 'chronos', 2, 'Rhythm Chamber', 'The beat of existence', 'temporal',
        ['rhythm_sync', 'pulse_frequency', 'pulsing'], 0.55, CHAMBER_MODIFIERS.velocity_storm),
      createChamber('chr_4', 'chronos', 3, 'Time Dilation', 'Seconds stretch', 'temporal',
        ['velocity_comparison', 'phase_alignment'], 0.6, CHAMBER_MODIFIERS.temporal_flux),
      createChamber('chr_5', 'chronos', 4, 'Memory Stream', 'Remember what was', 'temporal',
        ['temporal_memory', 'flickering', 'colorShift'], 0.65),
      createChamber('chr_6', 'chronos', 5, 'Eternal Now', 'Past and future merge', 'temporal',
        ['emergence_order', 'temporal_memory', 'decay_prediction'], 0.7),
    ],
    totalChambers: 6,
    completedChambers: 0,
    state: 'undiscovered',
    unlockCondition: { type: 'evolution', requirement: 500, current: 0, description: 'Reach Evolution 500' },
    mythicTitle: 'The Temporal Depths',
    description: 'Time bends here. Your perception of moments will be tested.',
    discoveryDialogue: 'Time is not a line. It is a river with many currents. Can you navigate them?',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 6: NEXUS - Mixed Challenges
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'nexus',
    name: 'NEXUS',
    subtitle: 'The Convergence',
    coordinate: { sector: 6, cluster: 3, node: 0, depth: 3 },
    primaryColor: '#FFFFFF',
    secondaryColor: '#0A0A0A',
    accentColor: '#00FFFF',
    color: '#FFFFFF',
    icon: '🌀',
    backgroundEffect: 'nebula',
    ambientSound: 'convergence',
    chambers: [
      createChamber('nex_1', 'nexus', 0, 'Fusion Point', 'Where domains meet', 'perception',
        ['chromatic_isolation', 'cardinal_extreme', 'pattern_breach'], 0.5),
      createChamber('nex_2', 'nexus', 1, 'Hybrid Mind', 'Think in multiple ways', 'logic',
        ['set_exclusion', 'isolation_index', 'luminance_peak'], 0.55),
      createChamber('nex_3', 'nexus', 2, 'Temporal Space', 'Time meets distance', 'temporal',
        ['emergence_order', 'depth_ordering', 'majority_rule'], 0.6, CHAMBER_MODIFIERS.chaos_entropy),
      createChamber('nex_4', 'nexus', 3, 'Unity Chamber', 'All skills required', 'spatial',
        ['symmetry_axis', 'sequence_prediction', 'saturation_extreme', 'rhythm_sync'], 0.65),
      createChamber('nex_5', 'nexus', 4, 'The Synthesis', 'Complete integration', 'logic',
        ['conditional_chain', 'temporal_memory', 'centroid_proximity', 'chromatic_isolation'], 0.7),
    ],
    totalChambers: 5,
    completedChambers: 0,
    state: 'undiscovered',
    unlockCondition: { type: 'mastery', requirement: 4, current: 0, description: 'Master 4 different sectors' },
    mythicTitle: 'Where All Paths Cross',
    description: 'All cognitive domains converge here. Only the balanced mind survives.',
    discoveryDialogue: 'You have walked separate paths. Now they become one. Are you ready?',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 7: ENTROPY - Chaos Domain
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'entropy',
    name: 'ENTROPY',
    subtitle: 'Edge of Chaos',
    color: '#FF0066',
    icon: '🔥',
    coordinate: { sector: 7, cluster: 3, node: 1, depth: 4 },
    primaryColor: '#FF0066',
    secondaryColor: '#1A0010',
    accentColor: '#FF6600',
    backgroundEffect: 'storm',
    ambientSound: 'chaos_static',
    chambers: [
      createChamber('ent_1', 'entropy', 0, 'Disorder Gate', 'Order begins to fail', 'perception',
        ['chromatic_isolation', 'form_recognition'], 0.6, CHAMBER_MODIFIERS.chaos_entropy),
      createChamber('ent_2', 'entropy', 1, 'Noise Floor', 'Signal lost in static', 'perception',
        ['luminance_peak', 'saturation_extreme'], 0.65, CHAMBER_MODIFIERS.sensory_overload),
      createChamber('ent_3', 'entropy', 2, 'Pattern Collapse', 'Rules stop working', 'logic',
        ['pattern_breach', 'inverse_logic'], 0.7, CHAMBER_MODIFIERS.chaos_entropy),
      createChamber('ent_4', 'entropy', 3, 'Time Shatter', 'Moments fragment', 'temporal',
        ['emergence_order', 'decay_prediction'], 0.75, CHAMBER_MODIFIERS.temporal_flux),
      createChamber('ent_5', 'entropy', 4, 'Pure Chaos', 'No rules remain', 'logic',
        ['set_exclusion', 'conditional_chain', 'temporal_memory'], 0.8, CHAMBER_MODIFIERS.chaos_entropy),
    ],
    totalChambers: 5,
    completedChambers: 0,
    state: 'undiscovered',
    unlockCondition: { type: 'evolution', requirement: 1000, current: 0, description: 'Reach Evolution 1000' },
    mythicTitle: 'The Unraveling',
    description: 'Here, order is an illusion. Only those who embrace chaos survive.',
    discoveryDialogue: 'Everything you know... forget it. Chaos has its own logic.',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 8: ORACLE - Prediction Domain
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'oracle',
    name: 'ORACLE',
    subtitle: 'Sight Beyond',
    color: '#8B00FF',
    icon: '🔮',
    coordinate: { sector: 8, cluster: 4, node: 0, depth: 4 },
    primaryColor: '#8B00FF',
    secondaryColor: '#0A001A',
    accentColor: '#00FF88',
    backgroundEffect: 'aurora',
    ambientSound: 'prophecy_whisper',
    chambers: [
      createChamber('ora_1', 'oracle', 0, 'Foresight Well', 'See what comes', 'logic',
        ['sequence_prediction', 'probability_weight'], 0.55),
      createChamber('ora_2', 'oracle', 1, 'Pattern Prophet', 'Know before it happens', 'logic',
        ['pattern_breach', 'sequence_prediction'], 0.6),
      createChamber('ora_3', 'oracle', 2, 'Temporal Sight', 'Feel time\'s flow', 'temporal',
        ['decay_prediction', 'phase_alignment'], 0.65, CHAMBER_MODIFIERS.shadow_play),
      createChamber('ora_4', 'oracle', 3, 'Mind\'s Eye', 'See without looking', 'spatial',
        ['depth_ordering', 'symmetry_axis'], 0.7),
      createChamber('ora_5', 'oracle', 4, 'True Prophecy', 'Know the unknowable', 'logic',
        ['probability_weight', 'conditional_chain', 'temporal_memory'], 0.75),
    ],
    totalChambers: 5,
    completedChambers: 0,
    state: 'undiscovered',
    unlockCondition: { type: 'streak', requirement: 25, current: 0, description: 'Achieve a 25-trial streak' },
    mythicTitle: 'The All-Seeing Depths',
    description: 'Here, you must see what is not yet there. Prediction is your only tool.',
    discoveryDialogue: 'The future is not fixed. But it can be glimpsed. Look deeper.',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 9: ABYSS - Ultimate Challenge
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'abyss',
    name: 'THE ABYSS',
    subtitle: 'Beyond Understanding',
    color: '#1A1A2E',
    icon: '🕳️',
    coordinate: { sector: 9, cluster: 4, node: 1, depth: 5 },
    primaryColor: '#000000',
    secondaryColor: '#050505',
    accentColor: '#FFFFFF',
    backgroundEffect: 'void',
    ambientSound: 'absolute_silence',
    chambers: [
      createChamber('aby_1', 'abyss', 0, 'Event Horizon', 'No return beyond', 'perception',
        ['chromatic_isolation', 'shadow_depth'], 0.75, CHAMBER_MODIFIERS.shadow_play),
      createChamber('aby_2', 'abyss', 1, 'Thought Void', 'Mind against nothing', 'logic',
        ['inverse_logic', 'conditional_chain'], 0.8, CHAMBER_MODIFIERS.zen_focus),
      createChamber('aby_3', 'abyss', 2, 'Time\'s End', 'Where moments cease', 'temporal',
        ['temporal_memory', 'decay_prediction'], 0.85, CHAMBER_MODIFIERS.temporal_flux),
      createChamber('aby_4', 'abyss', 3, 'Spatial Infinity', 'Distance has no meaning', 'spatial',
        ['isolation_index', 'depth_ordering'], 0.9, CHAMBER_MODIFIERS.spatial_warp),
      createChamber('aby_5', 'abyss', 4, 'The Unknowable', 'Face the impossible', 'logic',
        ['category_bridge', 'probability_weight', 'temporal_memory', 'symmetry_axis'], 0.95),
    ],
    totalChambers: 5,
    completedChambers: 0,
    state: 'undiscovered',
    unlockCondition: { type: 'evolution', requirement: 2000, current: 0, description: 'Reach Evolution 2000' },
    mythicTitle: 'The Final Depth',
    description: 'This is the end of understanding. Beyond lies only transcendence.',
    discoveryDialogue: 'You have come far. But the abyss does not reward the weak.',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECTOR 10: TRANSCENDENCE - Mastery Zone
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'transcendence',
    name: 'TRANSCENDENCE',
    subtitle: 'Beyond the Mind',
    color: '#FFD700',
    icon: '✨',
    coordinate: { sector: 10, cluster: 5, node: 0, depth: 6 },
    primaryColor: '#FFD700',
    secondaryColor: '#1A1400',
    accentColor: '#FFFFFF',
    backgroundEffect: 'organic',
    ambientSound: 'enlightenment',
    chambers: [
      createChamber('tra_1', 'transcendence', 0, 'Ego Death', 'Surrender to succeed', 'perception',
        ['chromatic_isolation', 'form_recognition', 'saturation_extreme'], 0.85, CHAMBER_MODIFIERS.zen_focus),
      createChamber('tra_2', 'transcendence', 1, 'Unity Mind', 'All becomes one', 'logic',
        ['category_bridge', 'conditional_chain'], 0.9),
      createChamber('tra_3', 'transcendence', 2, 'Timeless', 'Past and future merge', 'temporal',
        ['temporal_memory', 'emergence_order', 'decay_prediction'], 0.92),
      createChamber('tra_4', 'transcendence', 3, 'Infinite Space', 'Everywhere at once', 'spatial',
        ['symmetry_axis', 'centroid_proximity', 'depth_ordering'], 0.95),
      createChamber('tra_5', 'transcendence', 4, 'Perfect Mind', 'The ultimate trial', 'logic',
        ['conditional_chain', 'probability_weight', 'temporal_memory', 'chromatic_isolation', 'symmetry_axis'], 1.0),
    ],
    totalChambers: 5,
    completedChambers: 0,
    state: 'undiscovered',
    unlockCondition: { type: 'secret', requirement: 'master_abyss', current: 0, description: 'Master the Abyss' },
    mythicTitle: 'The Eternal Realm',
    description: 'Few reach here. Fewer survive. Only the transcendent remain.',
    discoveryDialogue: 'You have surpassed understanding. Welcome to transcendence.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// ANOMALY TEMPLATES - Rare spawning events
// ─────────────────────────────────────────────────────────────────────────────────

export const ANOMALY_TEMPLATES: Partial<Anomaly>[] = [
  {
    type: 'rift',
    pulseColor: '#FF0066',
    intensity: 0.9,
    challenge: {
      id: 'rift_challenge',
      title: 'THE RIFT',
      epithet: 'The Impossible',
      genome: createBaseGenome(0.85),
      domains: ['perception', 'spatial'],
      trialCount: 10,
      minimumEvolution: 500,
      titleReward: 'Rift Walker',
      evolutionBonus: 500,
    },
  },
  {
    type: 'echo',
    pulseColor: '#00FF88',
    intensity: 0.7,
    challenge: {
      id: 'echo_challenge',
      title: 'THE ECHO',
      epithet: 'Memory\'s Shadow',
      genome: createBaseGenome(0.75),
      domains: ['temporal', 'logic'],
      trialCount: 8,
      minimumEvolution: 300,
      titleReward: 'Echo Master',
      evolutionBonus: 350,
    },
  },
  {
    type: 'void_pocket',
    pulseColor: '#8B00FF',
    intensity: 0.95,
    challenge: {
      id: 'void_challenge',
      title: 'VOID POCKET',
      epithet: 'The Unseeable',
      genome: createBaseGenome(0.9),
      domains: ['spatial', 'perception'],
      trialCount: 12,
      minimumEvolution: 800,
      titleReward: 'Void Seer',
      cosmeticReward: 'void_aura',
      evolutionBonus: 750,
    },
  },
  {
    type: 'time_eddy',
    pulseColor: '#FFD700',
    intensity: 0.8,
    challenge: {
      id: 'time_challenge',
      title: 'TIME EDDY',
      epithet: 'The Eternal Moment',
      genome: createBaseGenome(0.8),
      domains: ['temporal'],
      trialCount: 10,
      minimumEvolution: 600,
      titleReward: 'Time Bender',
      evolutionBonus: 450,
    },
  },
  {
    type: 'nexus',
    pulseColor: '#FFFFFF',
    intensity: 1.0,
    challenge: {
      id: 'nexus_challenge',
      title: 'THE NEXUS',
      epithet: 'Mind Shatter',
      genome: createBaseGenome(1.0),
      domains: ['perception', 'spatial', 'logic', 'temporal'],
      trialCount: 15,
      minimumEvolution: 1500,
      titleReward: 'Nexus Conqueror',
      cosmeticReward: 'nexus_crown',
      evolutionBonus: 1000,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

export function getSectorById(id: string): Sector | undefined {
  return SECTORS.find(s => s.id === id);
}

export function getChamberById(id: string): Chamber | undefined {
  for (const sector of SECTORS) {
    const chamber = sector.chambers.find(c => c.id === id);
    if (chamber) return chamber;
  }
  return undefined;
}

export function getAvailableSectors(evolution: number, completedChambers: number): Sector[] {
  return SECTORS.filter(sector => {
    const condition = sector.unlockCondition;
    switch (condition.type) {
      case 'evolution':
        return evolution >= (condition.requirement as number);
      case 'chambers':
        return completedChambers >= (condition.requirement as number);
      default:
        return sector.state === 'accessible';
    }
  });
}

export function generateAnomaly(
  playerEvolution: number,
  coordinate: CosmicCoordinate
): Anomaly | null {
  // Filter templates by player evolution
  const eligible = ANOMALY_TEMPLATES.filter(
    t => t.challenge && playerEvolution >= t.challenge.minimumEvolution
  );
  
  if (eligible.length === 0) return null;
  
  const template = eligible[Math.floor(Math.random() * eligible.length)];
  
  return {
    id: `anomaly_${Date.now()}`,
    coordinate,
    type: template.type!,
    state: 'active',
    appearedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    challenge: template.challenge as LegendaryChallenge,
    pulseColor: template.pulseColor!,
    intensity: template.intensity!,
  };
}

export function calculateSectorProgress(sector: Sector): number {
  if (sector.totalChambers === 0) return 0;
  return sector.completedChambers / sector.totalChambers;
}

export function getNextChamber(sectorId: string, completedChambers: string[]): Chamber | null {
  const sector = getSectorById(sectorId);
  if (!sector) return null;
  
  for (const chamber of sector.chambers) {
    if (!completedChambers.includes(chamber.id)) {
      return chamber;
    }
  }
  
  return null;
}

export default {
  SECTORS,
  CHAMBER_MODIFIERS,
  ANOMALY_TEMPLATES,
  getSectorById,
  getChamberById,
  getAvailableSectors,
  generateAnomaly,
  calculateSectorProgress,
  getNextChamber,
};
